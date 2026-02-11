import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSessionJoinPayload,
  generateSessionCode,
  generateSessionJoinPassword,
} from '@/src/domain/session/session-access';

test('generateSessionCode returns XXXX-XXXX format', () => {
  const value = generateSessionCode();
  assert.match(value, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
});

test('generateSessionJoinPassword returns 6 chars format', () => {
  const value = generateSessionJoinPassword();
  assert.match(value, /^[A-Z0-9]{6}$/);
});

test('buildSessionJoinPayload builds deep link with query', () => {
  const payload = buildSessionJoinPayload('ABCD-EF12');
  assert.equal(payload, 'voiceanalysisapp://observer-setup?sessionCode=ABCD-EF12');
});
