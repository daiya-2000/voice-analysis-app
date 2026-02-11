import type { HostProfileCachePort } from '@/src/application/ports/host-profile-cache.port';
import {
  createPersistedHostProfile,
  type PersistedHostProfile,
} from '@/src/domain/profile/persisted-host-profile';

export interface SaveHostProfileInput {
  observerId?: string;
  displayName: string;
  avatarPresetId: string;
}

export class SaveHostProfileUseCase {
  constructor(private readonly hostProfileCachePort: HostProfileCachePort) {}

  async execute(input: SaveHostProfileInput): Promise<PersistedHostProfile> {
    const profile = createPersistedHostProfile(input);
    await this.hostProfileCachePort.saveHostProfile(profile);
    return profile;
  }
}
