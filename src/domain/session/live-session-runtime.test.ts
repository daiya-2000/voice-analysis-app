import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatElapsedTimeLabel,
  LIVE_ANALYSIS_PENDING_LABEL,
  LIVE_ANALYSIS_WARMUP_MS,
  resolveLiveSessionRuntimeMetrics,
} from '@/src/domain/session/live-session-runtime';

test('formatElapsedTimeLabel formats elapsed time to mm:ss', () => {
  assert.equal(formatElapsedTimeLabel(0), '00:00');
  assert.equal(formatElapsedTimeLabel(65_000), '01:05');
});

test('resolveLiveSessionRuntimeMetrics returns pending labels during warmup', () => {
  const metrics = resolveLiveSessionRuntimeMetrics('共感的なトーン傾向', '安定した会話ペース傾向', 60_000);

  assert.equal(metrics.toneEstimate, LIVE_ANALYSIS_PENDING_LABEL);
  assert.equal(metrics.paceEstimate, LIVE_ANALYSIS_PENDING_LABEL);
  assert.equal(metrics.isWarmup, true);
});

test('resolveLiveSessionRuntimeMetrics returns analyzed labels after warmup', () => {
  const metrics = resolveLiveSessionRuntimeMetrics(
    '共感的なトーン傾向',
    '安定した会話ペース傾向',
    LIVE_ANALYSIS_WARMUP_MS
  );

  assert.equal(metrics.toneEstimate, '共感的なトーン傾向');
  assert.equal(metrics.paceEstimate, '安定した会話ペース傾向');
  assert.equal(metrics.isWarmup, false);
});
