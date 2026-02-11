import type { OnboardingStep, SessionSnapshot } from '@/src/domain/analysis/entities';

export interface SessionDataPort {
  getOnboardingSteps(): OnboardingStep[];
  getSessionSnapshot(): SessionSnapshot;
}
