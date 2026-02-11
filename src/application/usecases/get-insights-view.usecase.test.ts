import assert from 'node:assert/strict';
import test from 'node:test';

import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import { GetInsightsViewUseCase } from '@/src/application/usecases/get-insights-view.usecase';
import type { OnboardingStep, SessionSnapshot } from '@/src/domain/analysis/entities';

class SessionDataPortStub implements SessionDataPort {
  getOnboardingSteps(): OnboardingStep[] {
    return [];
  }

  getSessionSnapshot(): SessionSnapshot {
    return {
      sessionCode: 'TEST-0001',
      activeObserverCount: 1,
      activeViewerCount: 2,
      observers: [
        {
          id: 'observer-1',
          displayName: 'Observer 1',
          role: 'observer',
          isActive: true,
          avatarLabel: 'O1',
        },
      ],
      engagementEstimate: '高め',
      toneEstimate: '落ち着いた',
      paceEstimate: '安定',
      elapsedTimeLabel: '00:10',
      detectedSpeakerInsights: [
        {
          id: 'speaker-a',
          label: '話者 A',
          activity: 'speaking',
          isMainSpeaker: true,
          estimatedEmotionTendency: '前向き',
          estimatedResponseTendency: '共感的',
          estimatedAffinityTendency: 'Observer 1 への関心が高め',
          targetObserverId: 'observer-1',
        },
      ],
    };
  }
}

test('GetInsightsViewUseCase resolves observer name and soft estimate labels', () => {
  const useCase = new GetInsightsViewUseCase(new SessionDataPortStub());

  const view = useCase.execute();

  assert.equal(view.activeViewerCount, 2);
  assert.equal(view.speakerCards[0]?.targetObserverName, 'Observer 1');
  assert.equal(view.speakerCards[0]?.emotionEstimate, '前向き傾向');
  assert.match(view.disclaimer, /推定/);
});
