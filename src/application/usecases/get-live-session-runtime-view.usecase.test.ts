import assert from 'node:assert/strict';
import test from 'node:test';

import { GetLiveSessionRuntimeViewUseCase } from '@/src/application/usecases/get-live-session-runtime-view.usecase';

test('GetLiveSessionRuntimeViewUseCase keeps tone and pace in pending during warmup', () => {
  const useCase = new GetLiveSessionRuntimeViewUseCase();

  const view = useCase.execute(
    {
      engagementEstimate: '高いエンゲージメント傾向',
      toneEstimate: '共感的なトーン傾向',
      paceEstimate: '安定した会話ペース傾向',
      elapsedTimeLabel: '00:00',
    },
    20_000
  );

  assert.equal(view.elapsedTimeLabel, '00:20');
  assert.equal(view.toneEstimate, '分析中...');
  assert.equal(view.paceEstimate, '分析中...');
  assert.equal(view.isWarmup, true);
});

test('GetLiveSessionRuntimeViewUseCase returns analyzed tone and pace after warmup', () => {
  const useCase = new GetLiveSessionRuntimeViewUseCase();

  const view = useCase.execute(
    {
      engagementEstimate: '高いエンゲージメント傾向',
      toneEstimate: '共感的なトーン傾向',
      paceEstimate: '安定した会話ペース傾向',
      elapsedTimeLabel: '00:00',
    },
    181_000
  );

  assert.equal(view.elapsedTimeLabel, '03:01');
  assert.equal(view.toneEstimate, '共感的なトーン傾向');
  assert.equal(view.paceEstimate, '安定した会話ペース傾向');
  assert.equal(view.isWarmup, false);
});
