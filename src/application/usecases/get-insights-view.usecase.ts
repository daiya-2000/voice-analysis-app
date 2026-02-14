import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import type { ObserverRole } from '@/src/domain/analysis/entities';
import { assertSoftInsightText, toSoftInsightText } from '@/src/domain/analysis/policies';

export interface SpeakerInsightCardView {
  id: string;
  label: string;
  isMainSpeaker: boolean;
  speakingLabel: string;
  targetObserverName: string;
  targetObserverRoleLabel: string;
  affinityScore: number;
  affinityConfidence: number;
  emotionEstimate: string;
  responseEstimate: string;
  affinityEstimate: string;
}

export interface InsightsView {
  activeViewerCount: number;
  observerAvatarLabels: string[];
  affinityByObserverRole: {
    role: ObserverRole;
    roleLabel: string;
    estimatedScore: number | null;
    confidence: number | null;
    tendencyLabel: string;
  }[];
  speakerCards: SpeakerInsightCardView[];
  disclaimer: string;
}

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toRoleLabel(role: ObserverRole): string {
  switch (role) {
    case 'host':
      return 'ホスト';
    case 'observer':
      return '閲覧ユーザー';
    case 'guest':
      return '登録外ユーザー';
  }
}

function toAffinityTendency(score: number | null): string {
  if (score === null) {
    return 'データ不足';
  }

  if (score >= 0.7) {
    return '関心が高まりやすい傾向';
  }

  if (score >= 0.45) {
    return '関心が安定している傾向';
  }

  return '関心が控えめな傾向';
}

function toDisplayTarget(
  targetRole: ObserverRole,
  targetObserverName: string
): { name: string; roleLabel: string } {
  // Observer(ホスト/閲覧者)とDetected Speaker(分析対象)を混同しないため、
  // Observer側の個人名はインサイト表示に出さない。
  if (targetRole === 'guest') {
    return {
      name: targetObserverName,
      roleLabel: toRoleLabel(targetRole),
    };
  }

  return {
    name: '登録外ユーザー',
    roleLabel: toRoleLabel('guest'),
  };
}

export class GetInsightsViewUseCase {
  constructor(private readonly sessionDataPort: SessionDataPort) {}

  execute(): InsightsView {
    const snapshot = this.sessionDataPort.getSessionSnapshot();
    const observerById = new Map(snapshot.observers.map((observer) => [observer.id, observer]));
    const scoreBuckets: Record<ObserverRole, number[]> = {
      host: [],
      observer: [],
      guest: [],
    };
    const confidenceBuckets: Record<ObserverRole, number[]> = {
      host: [],
      observer: [],
      guest: [],
    };

    const speakerCards = snapshot.detectedSpeakerInsights.map((speaker) => {
      const emotionEstimate = toSoftInsightText(speaker.estimatedEmotionTendency);
      const responseEstimate = toSoftInsightText(speaker.estimatedResponseTendency);
      const affinityEstimate = toSoftInsightText(speaker.estimatedAffinityTendency);

      assertSoftInsightText(emotionEstimate);
      assertSoftInsightText(responseEstimate);
      assertSoftInsightText(affinityEstimate);

      const targetRole = speaker.targetObserverId
        ? observerById.get(speaker.targetObserverId)?.role ?? 'guest'
        : 'guest';
      const rawTargetObserverName = speaker.targetObserverId
        ? observerById.get(speaker.targetObserverId)?.displayName ?? '登録外ユーザー'
        : '登録外ユーザー';
      const displayTarget = toDisplayTarget(targetRole, rawTargetObserverName);
      scoreBuckets[targetRole].push(speaker.estimatedAffinityScore);
      confidenceBuckets[targetRole].push(speaker.estimatedAffinityConfidence);

      return {
        id: speaker.id,
        label: speaker.label,
        isMainSpeaker: speaker.isMainSpeaker,
        speakingLabel: speaker.activity === 'speaking' ? 'Speaking' : 'Silent',
        targetObserverName: displayTarget.name,
        targetObserverRoleLabel: displayTarget.roleLabel,
        affinityScore: speaker.estimatedAffinityScore,
        affinityConfidence: speaker.estimatedAffinityConfidence,
        emotionEstimate,
        responseEstimate,
        affinityEstimate,
      };
    });

    const roles: ObserverRole[] = ['host', 'observer', 'guest'];
    const affinityByObserverRole: InsightsView['affinityByObserverRole'] = roles.map((role) => {
      const estimatedScore = average(scoreBuckets[role]);
      const confidence = average(confidenceBuckets[role]);

      return {
        role,
        roleLabel: toRoleLabel(role),
        estimatedScore,
        confidence,
        tendencyLabel: toAffinityTendency(estimatedScore),
      };
    });

    return {
      activeViewerCount: snapshot.activeViewerCount,
      observerAvatarLabels: snapshot.observers.map((observer) => observer.avatarLabel),
      affinityByObserverRole,
      speakerCards,
      disclaimer:
        'これらの結果は音声解析に基づく推定であり、確定的な評価ではありません。振り返りの参考情報としてご利用ください。',
    };
  }
}
