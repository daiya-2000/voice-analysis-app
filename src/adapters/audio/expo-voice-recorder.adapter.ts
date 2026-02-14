import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  type AudioRecorder,
} from 'expo-audio';
import AudioModule from 'expo-audio/build/AudioModule';
import { createRecordingOptions } from 'expo-audio/build/utils/options';
import * as FileSystem from 'expo-file-system/legacy';

import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';
import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

const METERING_POLL_MS = 250;
const SILENCE_THRESHOLD_DB = -45;
const RELATIVE_SILENCE_GAP_DB = 18;
const AVERAGE_SILENCE_GAP_DB = 8;
const NOISE_FLOOR_SILENCE_GAP_DB = 9;
const NOISE_FLOOR_RISE_ALPHA = 0.015;
const NOISE_FLOOR_FALL_ALPHA = 0.22;
const INPUT_LEVEL_GATE_GAP_DB = 7;
const INPUT_LEVEL_GAIN = 2.4;
const INPUT_LEVEL_BASE_DB = -42;
const INPUT_LEVEL_MIN_DB = -60;
const INPUT_LEVEL_MAX_DB = -8;

export class ExpoVoiceRecorderAdapter implements VoiceRecorderPort {
  private recorder: AudioRecorder | null = null;
  private muted = false;
  private hasStartedRecording = false;
  private meteringPollTimer: ReturnType<typeof setInterval> | null = null;
  private readonly recordingOptions = {
    ...createRecordingOptions(RecordingPresets.HIGH_QUALITY),
    isMeteringEnabled: true,
  };
  private latestMeteringDb: number | null = null;
  private peakMeteringDb = -160;
  private minMeteringDb = 20;
  private meteringSum = 0;
  private meteringCount = 0;
  private silenceCount = 0;
  private noiseFloorDb: number | null = null;

  async startRecording(): Promise<void> {
    const permission = await requestRecordingPermissionsAsync();

    if (!permission.granted) {
      throw new Error('Microphone permission is required for voice enrollment.');
    }

    if (this.recorder?.isRecording) {
      return;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });

    if (!this.recorder) {
      this.recorder = new AudioModule.AudioRecorder(this.recordingOptions);
    }

    // stop() 後は再度 prepare が必要。毎回呼んで安全に録音セッションを再開する。
    await this.recorder.prepareToRecordAsync(this.recordingOptions);

    this.resetMeteringStats();
    this.recorder.record();
    this.startMeteringPolling();
    this.hasStartedRecording = true;

    if (this.muted) {
      this.recorder.pause();
    }
  }

  async stopRecording(): Promise<RecordedVoiceSample> {
    if (!this.recorder || !this.hasStartedRecording) {
      throw new Error('Recording has not started.');
    }

    const recorder = this.recorder;

    await recorder.stop();
    this.stopMeteringPolling();
    this.hasStartedRecording = false;

    const status = recorder.getStatus();
    const uri = recorder.uri;

    if (!uri) {
      throw new Error('Failed to resolve recorded file URI.');
    }

    const base64Audio = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const durationMs = typeof status.durationMillis === 'number' ? status.durationMillis : 0;
    const averageMeteringDb =
      this.meteringCount > 0 ? this.meteringSum / this.meteringCount : undefined;
    const silenceRatio = this.meteringCount > 0 ? this.silenceCount / this.meteringCount : undefined;
    const peakMeteringDb = this.meteringCount > 0 ? this.peakMeteringDb : undefined;
    const dynamicRangeDb =
      this.meteringCount > 0 ? Math.max(0, this.peakMeteringDb - this.minMeteringDb) : undefined;

    return {
      base64Audio,
      durationMs,
      mimeType: 'audio/m4a',
      averageMeteringDb,
      silenceRatio,
      peakMeteringDb,
      dynamicRangeDb,
      noiseFloorDb: this.noiseFloorDb ?? undefined,
    };
  }

  async setMuted(muted: boolean): Promise<void> {
    this.muted = muted;

    if (!this.recorder) {
      return;
    }

    if (muted) {
      this.latestMeteringDb = -160;

      if (this.recorder.isRecording) {
        this.recorder.pause();
      }

      return;
    }

    this.recorder.record();
  }

  isMuted(): boolean {
    return this.muted;
  }

  getCurrentMeteringDb(): number | null {
    return this.latestMeteringDb;
  }

  private startMeteringPolling(): void {
    if (!this.recorder || this.meteringPollTimer) {
      return;
    }

    this.meteringPollTimer = setInterval(() => {
      if (!this.recorder || !this.recorder.isRecording) {
        return;
      }

      const status = this.recorder.getStatus();

      if (typeof status.metering !== 'number') {
        return;
      }

      this.updateNoiseFloor(status.metering);
      this.latestMeteringDb = this.toInputLevelMeteringDb(status.metering);
      this.peakMeteringDb = Math.max(this.peakMeteringDb, status.metering);
      this.minMeteringDb = Math.min(this.minMeteringDb, status.metering);
      this.meteringSum += status.metering;
      this.meteringCount += 1;
      const runningAverageDb = this.meteringSum / this.meteringCount;
      const adaptiveNoiseThreshold =
        this.noiseFloorDb === null ? -160 : this.noiseFloorDb + NOISE_FLOOR_SILENCE_GAP_DB;

      const dynamicThreshold = Math.max(
        SILENCE_THRESHOLD_DB,
        adaptiveNoiseThreshold,
        this.peakMeteringDb - RELATIVE_SILENCE_GAP_DB,
        runningAverageDb - AVERAGE_SILENCE_GAP_DB
      );

      if (status.metering <= dynamicThreshold) {
        this.silenceCount += 1;
      }
    }, METERING_POLL_MS);
  }

  private stopMeteringPolling(): void {
    if (!this.meteringPollTimer) {
      return;
    }

    clearInterval(this.meteringPollTimer);
    this.meteringPollTimer = null;
  }

  private resetMeteringStats(): void {
    this.latestMeteringDb = null;
    this.peakMeteringDb = -160;
    this.minMeteringDb = 20;
    this.meteringSum = 0;
    this.meteringCount = 0;
    this.silenceCount = 0;
    this.noiseFloorDb = null;
  }

  private updateNoiseFloor(meteringDb: number): void {
    if (this.noiseFloorDb === null) {
      this.noiseFloorDb = meteringDb;
      return;
    }

    const alpha = meteringDb > this.noiseFloorDb ? NOISE_FLOOR_RISE_ALPHA : NOISE_FLOOR_FALL_ALPHA;
    this.noiseFloorDb = this.noiseFloorDb + (meteringDb - this.noiseFloorDb) * alpha;
  }

  private toInputLevelMeteringDb(rawMeteringDb: number): number {
    if (this.noiseFloorDb === null) {
      return rawMeteringDb;
    }

    const gateThreshold = this.noiseFloorDb + INPUT_LEVEL_GATE_GAP_DB;

    if (rawMeteringDb <= gateThreshold) {
      return -160;
    }

    const boosted = INPUT_LEVEL_BASE_DB + (rawMeteringDb - gateThreshold) * INPUT_LEVEL_GAIN;
    return Math.max(INPUT_LEVEL_MIN_DB, Math.min(INPUT_LEVEL_MAX_DB, boosted));
  }
}
