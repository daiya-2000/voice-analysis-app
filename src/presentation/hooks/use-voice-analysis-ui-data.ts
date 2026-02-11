import { useMemo } from 'react';

import { MockSessionDataAdapter } from '@/src/adapters/supabase/mock-session-data.adapter';
import { GetInsightsViewUseCase } from '@/src/application/usecases/get-insights-view.usecase';
import { GetLiveSessionViewUseCase } from '@/src/application/usecases/get-live-session-view.usecase';
import { GetOnboardingFlowUseCase } from '@/src/application/usecases/get-onboarding-flow.usecase';
import { GetSessionLobbyViewUseCase } from '@/src/application/usecases/get-session-lobby-view.usecase';

const sessionDataAdapter = new MockSessionDataAdapter();
const getOnboardingFlowUseCase = new GetOnboardingFlowUseCase(sessionDataAdapter);
const getSessionLobbyViewUseCase = new GetSessionLobbyViewUseCase(sessionDataAdapter);
const getLiveSessionViewUseCase = new GetLiveSessionViewUseCase(sessionDataAdapter);
const getInsightsViewUseCase = new GetInsightsViewUseCase(sessionDataAdapter);

export function useVoiceAnalysisUiData() {
  return useMemo(
    () => ({
      onboardingSteps: getOnboardingFlowUseCase.execute(),
      sessionLobby: getSessionLobbyViewUseCase.execute(),
      liveSession: getLiveSessionViewUseCase.execute(),
      insights: getInsightsViewUseCase.execute(),
    }),
    []
  );
}
