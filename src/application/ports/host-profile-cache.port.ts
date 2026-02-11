import type { PersistedHostProfile } from '@/src/domain/profile/persisted-host-profile';

export interface HostProfileCachePort {
  loadHostProfile(): Promise<PersistedHostProfile | null>;
  saveHostProfile(profile: PersistedHostProfile): Promise<void>;
  clearHostProfile(): Promise<void>;
}
