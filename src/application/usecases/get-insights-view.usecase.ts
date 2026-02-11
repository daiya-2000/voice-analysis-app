import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import { assertSoftInsightText, toSoftInsightText } from '@/src/domain/analysis/policies';

export interface SpeakerInsightCardView {
  id: string;
  label: string;
  isMainSpeaker: boolean;
  speakingLabel: string;
  targetObserverName: string;
  emotionEstimate: string;
  responseEstimate: string;
  affinityEstimate: string;
}

export interface InsightsView {
  activeViewerCount: number;
  observerAvatarLabels: string[];
  speakerCards: SpeakerInsightCardView[];
  disclaimer: string;
}

export class GetInsightsViewUseCase {
  constructor(private readonly sessionDataPort: SessionDataPort) {}

  execute(): InsightsView {
    const snapshot = this.sessionDataPort.getSessionSnapshot();
    const observerById = new Map(snapshot.observers.map((observer) => [observer.id, observer]));

    const speakerCards = snapshot.detectedSpeakerInsights.map((speaker) => {
      const emotionEstimate = toSoftInsightText(speaker.estimatedEmotionTendency);
      const responseEstimate = toSoftInsightText(speaker.estimatedResponseTendency);
      const affinityEstimate = toSoftInsightText(speaker.estimatedAffinityTendency);

      assertSoftInsightText(emotionEstimate);
      assertSoftInsightText(responseEstimate);
      assertSoftInsightText(affinityEstimate);

      return {
        id: speaker.id,
        label: speaker.label,
        isMainSpeaker: speaker.isMainSpeaker,
        speakingLabel: speaker.activity === 'speaking' ? 'Speaking' : 'Silent',
        targetObserverName: speaker.targetObserverId
          ? observerById.get(speaker.targetObserverId)?.displayName ?? '全体'
          : '全体',
        emotionEstimate,
        responseEstimate,
        affinityEstimate,
      };
    });

    return {
      activeViewerCount: snapshot.activeViewerCount,
      observerAvatarLabels: snapshot.observers.map((observer) => observer.avatarLabel),
      speakerCards,
      disclaimer:
        'これらの結果は音声解析に基づく推定であり、確定的な評価ではありません。振り返りの参考情報としてご利用ください。',
    };
  }
}
