import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isLowConfidence,
  smoothLiveAnalysisScores,
} from '@/src/domain/analysis/live-analysis-smoothing';

test('smoothLiveAnalysisScores keeps rolling window and averages scores', () => {
  const { nextHistory, smoothedPoint } = smoothLiveAnalysisScores(
    [
      { engagementScore: 0.2, toneScore: 0.4, paceScore: 0.3, confidence: 0.3 },
      { engagementScore: 0.6, toneScore: 0.8, paceScore: 0.7, confidence: 0.7 },
    ],
    { engagementScore: 1, toneScore: 1, paceScore: 1, confidence: 0.8 },
    3
  );

  assert.equal(nextHistory.length, 3);
  assert.equal(Math.round(smoothedPoint.engagementScore * 100), 60);
  assert.equal(Math.round(smoothedPoint.confidence * 100), 60);
});

test('isLowConfidence returns true under threshold', () => {
  assert.equal(isLowConfidence(0.4), true);
  assert.equal(isLowConfidence(0.5), false);
});

