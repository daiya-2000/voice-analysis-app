export interface PersistedHostProfile {
  observerId?: string;
  observerRole: 'host';
  displayName: string;
  avatarPresetId: string;
  updatedAtIso: string;
}

export interface CreatePersistedHostProfileInput {
  observerId?: string;
  displayName: string;
  avatarPresetId: string;
  updatedAtIso?: string;
}

export function createPersistedHostProfile(
  input: CreatePersistedHostProfileInput
): PersistedHostProfile {
  const normalizedObserverId = input.observerId?.trim();
  const normalizedDisplayName = input.displayName.trim();
  const normalizedAvatarPresetId = input.avatarPresetId.trim();

  return {
    observerId: normalizedObserverId ? normalizedObserverId : undefined,
    observerRole: 'host',
    displayName: normalizedDisplayName || 'Host User',
    avatarPresetId: normalizedAvatarPresetId || 'forest',
    updatedAtIso: input.updatedAtIso ?? new Date().toISOString(),
  };
}
