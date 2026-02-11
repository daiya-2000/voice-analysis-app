import test from 'node:test';
import assert from 'node:assert/strict';

import { ParseSessionJoinLinkUseCase } from '@/src/application/usecases/parse-session-join-link.usecase';

test('ParseSessionJoinLinkUseCase parses supported QR deep link', () => {
  const useCase = new ParseSessionJoinLinkUseCase();

  const parsed = useCase.execute('voiceanalysisapp://observer-setup?sessionCode=AB12-CD34');

  assert.deepEqual(parsed, { sessionCode: 'AB12-CD34' });
});

test('ParseSessionJoinLinkUseCase returns null for unsupported payload', () => {
  const useCase = new ParseSessionJoinLinkUseCase();

  assert.equal(useCase.execute('hello world'), null);
});
