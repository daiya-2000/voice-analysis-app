import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveInputLevelPercentage } from '@/src/domain/analysis/input-level';

test('resolveInputLevelPercentage keeps muted and unknown states stable', () => {
  assert.equal(resolveInputLevelPercentage(null), null);
  assert.equal(resolveInputLevelPercentage(-20, true), 0);
});

test('resolveInputLevelPercentage suppresses ambient noise baseline', () => {
  assert.equal(resolveInputLevelPercentage(-36), 0);
  assert.equal(resolveInputLevelPercentage(-34), 8);
});

test('resolveInputLevelPercentage increases with speech-like levels', () => {
  assert.equal(resolveInputLevelPercentage(-24), 50);
  assert.equal(resolveInputLevelPercentage(-12), 100);
});
