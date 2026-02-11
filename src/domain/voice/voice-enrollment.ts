import type { VoicePrompt } from '@/src/domain/voice/voice-prompt';

export type ObserverRoleType = 'host' | 'observer';

export interface RecordedVoiceSample {
  base64Audio: string;
  mimeType: string;
  durationMs: number;
}

export interface VoiceEnrollmentRequest {
  observerId: string;
  sessionCode?: string;
  observerRole: ObserverRoleType;
  avatarPresetId: string;
  displayName: string;
  script: VoicePrompt;
  sample: RecordedVoiceSample;
}

export interface VoiceEnrollmentResult {
  enrollmentId: string;
  tendencySummary: string;
  confidence: number;
  provider: 'huggingface-edge' | 'mock';
}
