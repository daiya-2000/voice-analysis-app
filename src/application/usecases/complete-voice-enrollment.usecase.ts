import type { ProfileRegistrationPort } from '@/src/application/ports/profile-registration.port';
import type { VoiceEnrollmentPort } from '@/src/application/ports/voice-enrollment.port';
import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';
import type { VoiceEnrollmentResult, ObserverRoleType } from '@/src/domain/voice/voice-enrollment';
import type { VoicePrompt } from '@/src/domain/voice/voice-prompt';

export interface CompleteVoiceEnrollmentInput {
  displayName: string;
  avatarPresetId: string;
  observerRole: ObserverRoleType;
  script: VoicePrompt;
  sessionCode?: string;
}

export interface CompleteVoiceEnrollmentOutput {
  observerId: string;
  enrollment: VoiceEnrollmentResult;
}

export class CompleteVoiceEnrollmentUseCase {
  constructor(
    private readonly profileRegistrationPort: ProfileRegistrationPort,
    private readonly voiceRecorderPort: VoiceRecorderPort,
    private readonly voiceEnrollmentPort: VoiceEnrollmentPort
  ) {}

  async execute(input: CompleteVoiceEnrollmentInput): Promise<CompleteVoiceEnrollmentOutput> {
    const profile = await this.profileRegistrationPort.registerObserverProfile({
      displayName: input.displayName,
      avatarPresetId: input.avatarPresetId,
      observerRole: input.observerRole,
      sessionCode: input.sessionCode,
    });

    const sample = await this.voiceRecorderPort.stopRecording();

    const enrollment = await this.voiceEnrollmentPort.enrollVoiceSample({
      observerId: profile.observerId,
      displayName: input.displayName,
      avatarPresetId: input.avatarPresetId,
      observerRole: input.observerRole,
      script: input.script,
      sample,
      sessionCode: input.sessionCode,
    });

    return {
      observerId: profile.observerId,
      enrollment,
    };
  }
}
