import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export const LIVE_ANALYSIS_WINDOW_MS = 10 * 1000;
export const LIVE_ANALYSIS_STEP_MS = 8 * 1000;

const TARGET_LOUDNESS_DB = -24;
const MAX_GAIN_DB = 10;
const MIN_GAIN_DB = -10;
const VAD_SPEECH_THRESHOLD = 0.26;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export interface PreprocessedAudioSample {
  sample: RecordedVoiceSample;
  vadSpeechRatio: number;
  normalizationGainDb: number;
  noiseSuppressionLevel: number;
  shouldSkipRemoteAnalysis: boolean;
}

export function preprocessRecordedVoiceSample(
  sample: RecordedVoiceSample
): PreprocessedAudioSample {
  const averageMeteringDb = sample.averageMeteringDb ?? -60;
  const silenceRatio = sample.silenceRatio ?? 1;
  const dynamicRangeDb = sample.dynamicRangeDb ?? 0;

  const desiredGainDb = TARGET_LOUDNESS_DB - averageMeteringDb;
  const normalizationGainDb = clamp(desiredGainDb, MIN_GAIN_DB, MAX_GAIN_DB);
  const normalizedAverageMeteringDb = clamp(
    averageMeteringDb + normalizationGainDb * 0.45,
    -60,
    -12
  );

  // Dynamic range が狭いほどノイズ優勢とみなし、無音寄りへ補正する。
  const noiseSuppressionLevel = dynamicRangeDb >= 10 ? 0 : clamp01((10 - dynamicRangeDb) / 10);
  const normalizedSilenceRatio = clamp01(silenceRatio + noiseSuppressionLevel * 0.2);
  const normalizedDynamicRangeDb = clamp(dynamicRangeDb - noiseSuppressionLevel * 4, 0, 40);

  const normalizedLoudnessActivity = clamp01((normalizedAverageMeteringDb + 60) / 48);
  const normalizedDynamicActivity = clamp01(normalizedDynamicRangeDb / 18);
  const vadSpeechRatio = clamp01(
    (1 - normalizedSilenceRatio) * 0.7 +
      normalizedLoudnessActivity * 0.2 +
      normalizedDynamicActivity * 0.1
  );

  const shouldSkipRemoteAnalysis =
    vadSpeechRatio < VAD_SPEECH_THRESHOLD || normalizedSilenceRatio >= 0.94;

  return {
    sample: {
      ...sample,
      averageMeteringDb: normalizedAverageMeteringDb,
      silenceRatio: normalizedSilenceRatio,
      dynamicRangeDb: normalizedDynamicRangeDb,
    },
    vadSpeechRatio,
    normalizationGainDb,
    noiseSuppressionLevel,
    shouldSkipRemoteAnalysis,
  };
}
