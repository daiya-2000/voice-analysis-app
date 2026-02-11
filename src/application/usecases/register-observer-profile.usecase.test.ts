import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  ObserverProfileRegistrationRequest,
  ObserverProfileRegistrationResult,
  ProfileRegistrationPort,
} from '@/src/application/ports/profile-registration.port';
import { RegisterObserverProfileUseCase } from '@/src/application/usecases/register-observer-profile.usecase';

class InMemoryProfileRegistrationPort implements ProfileRegistrationPort {
  latestRequest: ObserverProfileRegistrationRequest | null = null;

  async registerObserverProfile(
    request: ObserverProfileRegistrationRequest
  ): Promise<ObserverProfileRegistrationResult> {
    this.latestRequest = request;

    return { observerId: 'observer-123' };
  }
}

test('RegisterObserverProfileUseCase passes observer registration payload', async () => {
  const port = new InMemoryProfileRegistrationPort();
  const useCase = new RegisterObserverProfileUseCase(port);

  const output = await useCase.execute({
    displayName: 'Observer User',
    avatarPresetId: 'forest',
    observerRole: 'observer',
    sessionCode: 'AB12-CD34',
    joinPassword: 'ABC123',
  });

  assert.equal(output.observerId, 'observer-123');
  assert.deepEqual(port.latestRequest, {
    displayName: 'Observer User',
    avatarPresetId: 'forest',
    observerRole: 'observer',
    sessionCode: 'AB12-CD34',
    joinPassword: 'ABC123',
  });
});
