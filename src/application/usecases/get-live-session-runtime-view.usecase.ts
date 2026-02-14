import type { LiveSessionView } from '@/src/application/usecases/get-live-session-view.usecase';
import {
  formatElapsedTimeLabel,
  LIVE_ANALYSIS_WARMUP_MS,
  resolveLiveSessionRuntimeMetrics,
} from '@/src/domain/session/live-session-runtime';

export interface LiveSessionRuntimeView {
  elapsedTimeLabel: string;
  toneEstimate: string;
  paceEstimate: string;
  isWarmup: boolean;
}

export class GetLiveSessionRuntimeViewUseCase {
  execute(baseView: LiveSessionView, elapsedMs: number): LiveSessionRuntimeView {
    const metrics = resolveLiveSessionRuntimeMetrics(
      baseView.toneEstimate,
      baseView.paceEstimate,
      elapsedMs,
      LIVE_ANALYSIS_WARMUP_MS
    );

    return {
      elapsedTimeLabel: formatElapsedTimeLabel(elapsedMs),
      toneEstimate: metrics.toneEstimate,
      paceEstimate: metrics.paceEstimate,
      isWarmup: metrics.isWarmup,
    };
  }
}
