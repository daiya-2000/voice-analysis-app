function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

const BACKGROUND_NOISE_FLOOR_DB = -36;
const SPEECH_PEAK_DB = -12;

export function resolveInputLevelPercentage(meteringDb: number | null, isMuted = false): number | null {
  if (isMuted) {
    return 0;
  }

  if (meteringDb === null) {
    return null;
  }

  const normalized = clamp01((meteringDb - BACKGROUND_NOISE_FLOOR_DB) / (SPEECH_PEAK_DB - BACKGROUND_NOISE_FLOOR_DB));
  return Math.round(normalized * 100);
}
