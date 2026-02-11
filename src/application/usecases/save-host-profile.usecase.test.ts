import test from 'node:test';
import assert from 'node:assert/strict';

import type { HostProfileCachePort } from '@/src/application/ports/host-profile-cache.port';
import { SaveHostProfileUseCase } from '@/src/application/usecases/save-host-profile.usecase';
import type { PersistedHostProfile } from '@/src/domain/profile/persisted-host-profile';

class InMemoryHostProfileCachePort implements HostProfileCachePort {
  savedProfile: PersistedHostProfile | null = null;

  async loadHostProfile(): Promise<PersistedHostProfile | null> {
    return this.savedProfile;
  }

  async saveHostProfile(profile: PersistedHostProfile): Promise<void> {
    this.savedProfile = profile;
  }

  async clearHostProfile(): Promise<void> {
    this.savedProfile = null;
  }
}

test('SaveHostProfileUseCase persists normalized host profile', async () => {
  const cachePort = new InMemoryHostProfileCachePort();
  const useCase = new SaveHostProfileUseCase(cachePort);

  const profile = await useCase.execute({
    observerId: 'observer-123',
    displayName: '  さとう  ',
    avatarPresetId: ' forest ',
  });

  assert.equal(profile.displayName, 'さとう');
  assert.equal(profile.avatarPresetId, 'forest');
  assert.equal(profile.observerId, 'observer-123');
  assert.equal(cachePort.savedProfile?.displayName, 'さとう');
  assert.equal(cachePort.savedProfile?.observerRole, 'host');
});
