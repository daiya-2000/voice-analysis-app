import type { VoiceEnrollmentRequest, VoiceEnrollmentResult } from '@/src/domain/voice/voice-enrollment';

export interface VoiceEnrollmentPort {
  enrollVoiceSample(request: VoiceEnrollmentRequest): Promise<VoiceEnrollmentResult>;
}
