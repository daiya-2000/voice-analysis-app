import test from 'node:test';
import assert from 'node:assert/strict';

import { createPersistedHostProfile } from '@/src/domain/profile/persisted-host-profile';

test('createPersistedHostProfile normalizes empty values', () => {
  const profile = createPersistedHostProfile({
    observerId: '  ',
    displayName: '   ',
    avatarPresetId: '   ',
    updatedAtIso: '2026-02-11T00:00:00.000Z',
  });

  assert.equal(profile.observerRole, 'host');
  assert.equal(profile.observerId, undefined);
  assert.equal(profile.displayName, 'Host User');
  assert.equal(profile.avatarPresetId, 'forest');
  assert.equal(profile.updatedAtIso, '2026-02-11T00:00:00.000Z');
});
