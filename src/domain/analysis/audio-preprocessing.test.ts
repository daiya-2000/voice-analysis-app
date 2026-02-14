import assert from 'node:assert/strict';
import test from 'node:test';

import { preprocessRecordedVoiceSample } from '@/src/domain/analysis/audio-preprocessing';

test('preprocessRecordedVoiceSample skips remote analysis for silence-like chunks', () => {
  const result = preprocessRecordedVoiceSample({
    base64Audio: 'AA==',
    mimeType: 'audio/m4a',
    durationMs: 8000,
    averageMeteringDb: -58,
    silenceRatio: 0.98,
    peakMeteringDb: -50,
    dynamicRangeDb: 3,
  });

  assert.equal(result.shouldSkipRemoteAnalysis, true);
  assert.ok(result.vadSpeechRatio < 0.26);
});

test('preprocessRecordedVoiceSample keeps remote analysis for speech-like chunks', () => {
  const result = preprocessRecordedVoiceSample({
    base64Audio: 'AA==',
    mimeType: 'audio/m4a',
    durationMs: 8000,
    averageMeteringDb: -28,
    silenceRatio: 0.25,
    peakMeteringDb: -12,
    dynamicRangeDb: 16,
  });

  assert.equal(result.shouldSkipRemoteAnalysis, false);
  assert.ok(result.vadSpeechRatio > 0.4);
});

