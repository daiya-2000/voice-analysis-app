import test from 'node:test';
import assert from 'node:assert/strict';

import { parseSessionJoinLink } from '@/src/domain/session/session-join-link';

test('parseSessionJoinLink parses deep link payload', () => {
  const parsed = parseSessionJoinLink(
    'voiceanalysisapp://observer-setup?sessionCode=AB12-CD34'
  );

  assert.deepEqual(parsed, { sessionCode: 'AB12-CD34' });
});

test('parseSessionJoinLink parses plain query payload', () => {
  const parsed = parseSessionJoinLink('sessionCode=AB12-CD34');

  assert.deepEqual(parsed, { sessionCode: 'AB12-CD34' });
});

test('parseSessionJoinLink parses backward-compatible tuple payload', () => {
  const parsed = parseSessionJoinLink('AB12-CD34 P4SS77');

  assert.deepEqual(parsed, { sessionCode: 'AB12-CD34' });
});

test('parseSessionJoinLink returns null for invalid payload', () => {
  const parsed = parseSessionJoinLink('invalid-qr-value');

  assert.equal(parsed, null);
});
