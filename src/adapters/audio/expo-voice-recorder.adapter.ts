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

export class ExpoVoiceRecorderAdapter implements VoiceRecorderPort {
  private recorder: AudioRecorder | null = null;

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
      const platformOptions = createRecordingOptions(RecordingPresets.HIGH_QUALITY);
      this.recorder = new AudioModule.AudioRecorder(platformOptions);
      await this.recorder.prepareToRecordAsync();
    }

    this.recorder.record();
  }

  async stopRecording(): Promise<RecordedVoiceSample> {
    if (!this.recorder || !this.recorder.isRecording) {
      throw new Error('Recording has not started.');
    }

    const recorder = this.recorder;

    await recorder.stop();

    const status = recorder.getStatus();
    const uri = recorder.uri;

    if (!uri) {
      throw new Error('Failed to resolve recorded file URI.');
    }

    const base64Audio = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const durationMs = typeof status.durationMillis === 'number' ? status.durationMillis : 0;

    return {
      base64Audio,
      durationMs,
      mimeType: 'audio/m4a',
    };
  }
}
