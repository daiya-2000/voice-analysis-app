import assert from 'node:assert/strict';
import test from 'node:test';

import { GetVoicePromptsUseCase } from '@/src/application/usecases/get-voice-prompts.usecase';

test('GetVoicePromptsUseCase returns prompts for guided reading', () => {
  const useCase = new GetVoicePromptsUseCase();
  const prompts = useCase.execute();

  assert.ok(prompts.length >= 3);
  assert.match(prompts[0]?.text ?? '', /参加|音声|推定|話/);
});
