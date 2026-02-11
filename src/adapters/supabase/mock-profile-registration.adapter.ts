import type {
  ObserverProfileRegistrationRequest,
  ObserverProfileRegistrationResult,
  ProfileRegistrationPort,
} from '@/src/application/ports/profile-registration.port';

export class MockProfileRegistrationAdapter implements ProfileRegistrationPort {
  async registerObserverProfile(
    request: ObserverProfileRegistrationRequest
  ): Promise<ObserverProfileRegistrationResult> {
    const profileSuffix = request.displayName.trim().toLowerCase().replace(/\s+/g, '-');

    return {
      observerId: `mock-${request.observerRole}-${profileSuffix || 'observer'}`,
    };
  }
}
