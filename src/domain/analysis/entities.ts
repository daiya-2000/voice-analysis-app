export type ObserverRole = 'host' | 'observer';
export type SpeakerActivity = 'speaking' | 'silent';

export interface Observer {
  id: string;
  displayName: string;
  role: ObserverRole;
  isActive: boolean;
  avatarLabel: string;
}

export interface DetectedSpeakerInsight {
  id: string;
  label: string;
  activity: SpeakerActivity;
  isMainSpeaker: boolean;
  estimatedEmotionTendency: string;
  estimatedResponseTendency: string;
  estimatedAffinityTendency: string;
  targetObserverId?: string;
}

export interface SessionSnapshot {
  sessionCode: string;
  activeObserverCount: number;
  activeViewerCount: number;
  observers: Observer[];
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  elapsedTimeLabel: string;
  detectedSpeakerInsights: DetectedSpeakerInsight[];
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: 'voice' | 'qr' | 'insight';
}
