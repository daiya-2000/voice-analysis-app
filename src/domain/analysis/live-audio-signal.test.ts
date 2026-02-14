import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveLiveAudioSignalProfile } from '@/src/domain/analysis/live-audio-signal';

test('resolveLiveAudioSignalProfile returns silence-likely profile for muted-like input', () => {
  const profile = resolveLiveAudioSignalProfile({
    averageMeteringDb: -160,
    silenceRatio: 1,
    peakMeteringDb: -120,
    dynamicRangeDb: 0,
    transcriptActivity: 0,
    seed: 1,
  });

  assert.equal(profile.silenceLikely, true);
  assert.ok(profile.engagementScore < 0.2);
  assert.ok(profile.paceScore < 0.2);
});

test('resolveLiveAudioSignalProfile returns active profile for speech-like input', () => {
  const profile = resolveLiveAudioSignalProfile({
    averageMeteringDb: -26,
    silenceRatio: 0.14,
    peakMeteringDb: -12,
    dynamicRangeDb: 24,
    transcriptActivity: 0.7,
    seed: 44,
  });

  assert.equal(profile.silenceLikely, false);
  assert.ok(profile.engagementScore > 0.5);
  assert.ok(profile.paceScore > 0.5);
});
