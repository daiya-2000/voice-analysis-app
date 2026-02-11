import type { HostProfileCachePort } from '@/src/application/ports/host-profile-cache.port';
import type { PersistedHostProfile } from '@/src/domain/profile/persisted-host-profile';

export class LoadHostProfileUseCase {
  constructor(private readonly hostProfileCachePort: HostProfileCachePort) {}

  async execute(): Promise<PersistedHostProfile | null> {
    return this.hostProfileCachePort.loadHostProfile();
  }
}
