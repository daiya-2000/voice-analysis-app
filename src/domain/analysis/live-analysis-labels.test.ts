import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENGAGEMENT_EXPRESSIONS,
  PACE_EXPRESSIONS,
  resolveLiveAnalysisLabels,
  TONE_EXPRESSIONS,
} from '@/src/domain/analysis/live-analysis-labels';

test('live analysis expressions provide at least 12 options each', () => {
  assert.ok(ENGAGEMENT_EXPRESSIONS.length >= 12);
  assert.ok(TONE_EXPRESSIONS.length >= 12);
  assert.ok(PACE_EXPRESSIONS.length >= 12);
});

test('resolveLiveAnalysisLabels returns low-activity expressions for likely silence', () => {
  const labels = resolveLiveAnalysisLabels({
    silenceLikely: true,
    engagementScore: 0.9,
    toneScore: 0.9,
    paceScore: 0.9,
    seed: 5,
  });

  assert.match(labels.engagementEstimate, /(控えめ|少なめ|間が長く|エネルギー低め)/);
  assert.match(labels.toneEstimate, /(緊張|慎重|抑制|硬め)/);
});

test('resolveLiveAnalysisLabels can return high-activity expressions when active', () => {
  const labels = resolveLiveAnalysisLabels({
    silenceLikely: false,
    engagementScore: 0.95,
    toneScore: 0.9,
    paceScore: 0.85,
    seed: 8,
  });

  assert.match(labels.engagementEstimate, /(増加|高め|活発|勢い)/);
  assert.match(labels.toneEstimate, /(共感的|前向き|明るめ|活気)/);
});
