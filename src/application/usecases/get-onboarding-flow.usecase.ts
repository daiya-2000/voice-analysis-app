import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import type { OnboardingStep } from '@/src/domain/analysis/entities';

export class GetOnboardingFlowUseCase {
  constructor(private readonly sessionDataPort: SessionDataPort) {}

  execute(): OnboardingStep[] {
    return this.sessionDataPort.getOnboardingSteps();
  }
}
