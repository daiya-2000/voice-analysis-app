export const LIVE_ANALYSIS_WARMUP_MS = 3 * 60 * 1000;
export const LIVE_ANALYSIS_PENDING_LABEL = '分析中...';

export interface LiveSessionRuntimeMetrics {
  toneEstimate: string;
  paceEstimate: string;
  isWarmup: boolean;
}

export function formatElapsedTimeLabel(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function resolveLiveSessionRuntimeMetrics(
  toneEstimate: string,
  paceEstimate: string,
  elapsedMs: number,
  warmupMs = LIVE_ANALYSIS_WARMUP_MS
): LiveSessionRuntimeMetrics {
  const isWarmup = elapsedMs < warmupMs;

  if (isWarmup) {
    return {
      toneEstimate: LIVE_ANALYSIS_PENDING_LABEL,
      paceEstimate: LIVE_ANALYSIS_PENDING_LABEL,
      isWarmup,
    };
  }

  return {
    toneEstimate,
    paceEstimate,
    isWarmup,
  };
}
