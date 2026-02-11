import type { ProfileRegistrationPort } from '@/src/application/ports/profile-registration.port';
import type { VoiceEnrollmentPort } from '@/src/application/ports/voice-enrollment.port';
import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';
import type { VoiceEnrollmentResult, ObserverRoleType } from '@/src/domain/voice/voice-enrollment';
import type { VoicePrompt } from '@/src/domain/voice/voice-prompt';

export interface CompleteVoiceEnrollmentInput {
  existingObserverId?: string;
  displayName: string;
  avatarPresetId: string;
  observerRole: ObserverRoleType;
  script: VoicePrompt;
  sessionCode?: string;
  joinPassword?: string;
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
    const observerId =
      input.existingObserverId ??
      (
        await this.profileRegistrationPort.registerObserverProfile({
          displayName: input.displayName,
          avatarPresetId: input.avatarPresetId,
          observerRole: input.observerRole,
          sessionCode: input.sessionCode,
          joinPassword: input.joinPassword,
        })
      ).observerId;

    const sample = await this.voiceRecorderPort.stopRecording();

    const enrollment = await this.voiceEnrollmentPort.enrollVoiceSample({
      observerId,
      displayName: input.displayName,
      avatarPresetId: input.avatarPresetId,
      observerRole: input.observerRole,
      script: input.script,
      sample,
      sessionCode: input.sessionCode,
    });

    return {
      observerId,
      enrollment,
    };
  }
}
