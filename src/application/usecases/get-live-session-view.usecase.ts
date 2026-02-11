import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import { assertSoftInsightText, toSoftInsightText } from '@/src/domain/analysis/policies';

export interface LiveSessionView {
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  elapsedTimeLabel: string;
}

export class GetLiveSessionViewUseCase {
  constructor(private readonly sessionDataPort: SessionDataPort) {}

  execute(): LiveSessionView {
    const snapshot = this.sessionDataPort.getSessionSnapshot();

    const engagementEstimate = toSoftInsightText(snapshot.engagementEstimate);
    const toneEstimate = toSoftInsightText(snapshot.toneEstimate);
    const paceEstimate = toSoftInsightText(snapshot.paceEstimate);

    assertSoftInsightText(engagementEstimate);
    assertSoftInsightText(toneEstimate);
    assertSoftInsightText(paceEstimate);

    return {
      engagementEstimate,
      toneEstimate,
      paceEstimate,
      elapsedTimeLabel: snapshot.elapsedTimeLabel,
    };
  }
}
