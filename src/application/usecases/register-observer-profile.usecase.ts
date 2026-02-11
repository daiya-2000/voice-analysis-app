import type { ProfileRegistrationPort } from '@/src/application/ports/profile-registration.port';
import type { ObserverRoleType } from '@/src/domain/voice/voice-enrollment';

export interface RegisterObserverProfileInput {
  displayName: string;
  avatarPresetId: string;
  observerRole: ObserverRoleType;
  sessionCode?: string;
  joinPassword?: string;
}

export interface RegisterObserverProfileOutput {
  observerId: string;
}

export class RegisterObserverProfileUseCase {
  constructor(private readonly profileRegistrationPort: ProfileRegistrationPort) {}

  async execute(input: RegisterObserverProfileInput): Promise<RegisterObserverProfileOutput> {
    return this.profileRegistrationPort.registerObserverProfile({
      displayName: input.displayName,
      avatarPresetId: input.avatarPresetId,
      observerRole: input.observerRole,
      sessionCode: input.sessionCode,
      joinPassword: input.joinPassword,
    });
  }
}
