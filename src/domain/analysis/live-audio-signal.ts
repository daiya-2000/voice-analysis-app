export interface LiveAudioSignalInput {
  averageMeteringDb: number;
  silenceRatio: number;
  peakMeteringDb: number;
  dynamicRangeDb: number;
  transcriptActivity: number;
  seed: number;
}

export interface LiveAudioSignalProfile {
  silenceLikely: boolean;
  engagementScore: number;
  toneScore: number;
  paceScore: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function resolveLiveAudioSignalProfile(
  input: LiveAudioSignalInput
): LiveAudioSignalProfile {
  const silenceLikely =
    input.silenceRatio >= 0.96 ||
    (input.silenceRatio >= 0.85 && input.averageMeteringDb <= -55) ||
    (input.dynamicRangeDb <= 6 && input.averageMeteringDb <= -48);

  const speechRatio = clamp01(1 - input.silenceRatio);
  const meteringActivity = clamp01((input.averageMeteringDb + 62) / 30);
  const peakActivity = clamp01((input.peakMeteringDb + 58) / 34);
  const dynamicActivity = clamp01((input.dynamicRangeDb - 5) / 20);

  const engagementScore = clamp01(
    speechRatio * 0.32 +
      meteringActivity * 0.22 +
      peakActivity * 0.2 +
      dynamicActivity * 0.16 +
      input.transcriptActivity * 0.1
  );

  const seedNoise = ((Math.abs(input.seed) % 1000) / 1000) * 0.2;
  const toneScore = clamp01(
    seedNoise +
      meteringActivity * 0.22 +
      speechRatio * 0.18 +
      peakActivity * 0.2 +
      dynamicActivity * 0.2
  );

  const paceScore = clamp01(speechRatio * 0.3 + dynamicActivity * 0.45 + input.transcriptActivity * 0.25);

  return {
    silenceLikely,
    engagementScore,
    toneScore,
    paceScore,
  };
}
