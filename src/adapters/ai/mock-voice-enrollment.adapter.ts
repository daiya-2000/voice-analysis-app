import type { VoiceEnrollmentPort } from '@/src/application/ports/voice-enrollment.port';
import type { VoiceEnrollmentRequest, VoiceEnrollmentResult } from '@/src/domain/voice/voice-enrollment';

export class MockVoiceEnrollmentAdapter implements VoiceEnrollmentPort {
  async enrollVoiceSample(request: VoiceEnrollmentRequest): Promise<VoiceEnrollmentResult> {
    const shortBase64 = request.sample.base64Audio.slice(0, 16);

    return {
      enrollmentId: `mock-enroll-${Date.now()}`,
      tendencySummary: `音声サンプルを受信しました (${shortBase64}...)`,
      confidence: 0.42,
      provider: 'mock',
    };
  }
}
