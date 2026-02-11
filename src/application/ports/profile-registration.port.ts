import type { ObserverRoleType } from '@/src/domain/voice/voice-enrollment';

export interface ObserverProfileRegistrationRequest {
  displayName: string;
  avatarPresetId: string;
  observerRole: ObserverRoleType;
  sessionCode?: string;
  joinPassword?: string;
}

export interface ObserverProfileRegistrationResult {
  observerId: string;
}

export interface ProfileRegistrationPort {
  registerObserverProfile(
    request: ObserverProfileRegistrationRequest
  ): Promise<ObserverProfileRegistrationResult>;
}
