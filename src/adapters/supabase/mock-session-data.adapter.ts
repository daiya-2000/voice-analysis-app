import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import type { OnboardingStep, SessionSnapshot } from '@/src/domain/analysis/entities';

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'あなたの声を登録',
    description: '話者識別の精度を上げるために、数秒の音声サンプルを登録します。',
    icon: 'voice',
  },
  {
    id: 2,
    title: 'メンバーを招待',
    description: 'QRコードでObserverを招待し、同じセッションの分析結果を共有します。',
    icon: 'qr',
  },
  {
    id: 3,
    title: 'インサイトを閲覧',
    description: 'Detected Speakerごとの感情傾向と反応傾向をリアルタイムで確認します。',
    icon: 'insight',
  },
];

const SESSION_SNAPSHOT: SessionSnapshot = {
  sessionCode: 'A7B2-C8D4',
  activeObserverCount: 3,
  activeViewerCount: 12,
  observers: [
    {
      id: 'observer-host',
      displayName: 'ホスト (あなた)',
      role: 'host',
      isActive: true,
      avatarLabel: 'H',
    },
    {
      id: 'observer-1',
      displayName: 'Observer 1',
      role: 'observer',
      isActive: true,
      avatarLabel: 'O1',
    },
    {
      id: 'observer-2',
      displayName: 'Observer 2',
      role: 'observer',
      isActive: true,
      avatarLabel: 'O2',
    },
    {
      id: 'observer-3',
      displayName: '登録外ユーザー',
      role: 'guest',
      isActive: false,
      avatarLabel: 'G',
    },
  ],
  engagementEstimate: '高いエンゲージメント',
  toneEstimate: '共感的なトーン',
  paceEstimate: '安定した会話ペース',
  elapsedTimeLabel: '12:45',
  detectedSpeakerInsights: [
    {
      id: 'speaker-a',
      label: '話者 A',
      activity: 'speaking',
      isMainSpeaker: true,
      estimatedEmotionTendency: '高い調和と活性',
      estimatedResponseTendency: '共感的な受容',
      estimatedAffinityTendency: 'Observer 1 への関心が高め',
      estimatedAffinityScore: 0.78,
      estimatedAffinityConfidence: 0.74,
      targetObserverId: 'observer-1',
    },
    {
      id: 'speaker-b',
      label: '話者 B',
      activity: 'silent',
      isMainSpeaker: false,
      estimatedEmotionTendency: '冷静な安定感',
      estimatedResponseTendency: '論理的な思考',
      estimatedAffinityTendency: '登録外ユーザーへの反応が増える傾向',
      estimatedAffinityScore: 0.58,
      estimatedAffinityConfidence: 0.61,
      targetObserverId: 'observer-3',
    },
  ],
};

export class MockSessionDataAdapter implements SessionDataPort {
  getOnboardingSteps(): OnboardingStep[] {
    return ONBOARDING_STEPS;
  }

  getSessionSnapshot(): SessionSnapshot {
    return SESSION_SNAPSHOT;
  }
}
