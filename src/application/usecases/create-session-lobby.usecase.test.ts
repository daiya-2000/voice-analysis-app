import test from 'node:test';
import assert from 'node:assert/strict';

import type {
  CreateSessionLobbyRequest,
  CreateSessionLobbyResult,
  SessionLobbyPort,
} from '@/src/application/ports/session-lobby.port';
import { CreateSessionLobbyUseCase } from '@/src/application/usecases/create-session-lobby.usecase';
import type { Observer } from '@/src/domain/analysis/entities';

class InMemorySessionLobbyPort implements SessionLobbyPort {
  latestRequest: CreateSessionLobbyRequest | null = null;

  async createSessionLobby(request: CreateSessionLobbyRequest): Promise<CreateSessionLobbyResult> {
    this.latestRequest = request;
    return { hostObserverId: request.hostObserverId ?? 'generated-host-id' };
  }

  async getObservers(_sessionCode: string): Promise<Observer[]> {
    return [];
  }

  async verifySessionJoinPassword(_request: {
    sessionCode: string;
    joinPassword: string;
  }): Promise<void> {}

  subscribeObservers(
    _sessionCode: string,
    _onUpdate: (observers: Observer[]) => void,
    _onError?: (error: Error) => void
  ): () => void {
    return () => undefined;
  }
}

test('CreateSessionLobbyUseCase creates new code/password/payload and persists session', async () => {
  const port = new InMemorySessionLobbyPort();
  const useCase = new CreateSessionLobbyUseCase(port);

  const output = await useCase.execute({
    hostObserverId: 'host-001',
    hostDisplayName: 'Host User',
    hostAvatarPresetId: 'forest',
  });

  assert.match(output.sessionCode, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  assert.match(output.joinPassword, /^[A-Z0-9]{6}$/);
  assert.match(output.qrPayload, /^voiceanalysisapp:\/\/observer-setup\?/);
  assert.equal(output.hostObserverId, 'host-001');
  assert.equal(port.latestRequest?.sessionCode, output.sessionCode);
  assert.equal(port.latestRequest?.joinPassword, output.joinPassword);
});
