import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  CreateSessionLobbyRequest,
  CreateSessionLobbyResult,
  SessionLobbyPort,
  VerifySessionJoinPasswordRequest,
} from '@/src/application/ports/session-lobby.port';
import { VerifySessionJoinPasswordUseCase } from '@/src/application/usecases/verify-session-join-password.usecase';
import type { Observer } from '@/src/domain/analysis/entities';

class InMemorySessionLobbyPort implements SessionLobbyPort {
  public latestVerifyRequest: VerifySessionJoinPasswordRequest | null = null;

  async createSessionLobby(_request: CreateSessionLobbyRequest): Promise<CreateSessionLobbyResult> {
    return { hostObserverId: 'host-001' };
  }

  async getObservers(_sessionCode: string): Promise<Observer[]> {
    return [];
  }

  async verifySessionJoinPassword(request: VerifySessionJoinPasswordRequest): Promise<void> {
    this.latestVerifyRequest = request;

    if (request.joinPassword !== 'ABC123') {
      throw new Error('invalid password');
    }
  }

  subscribeObservers(
    _sessionCode: string,
    _onUpdate: (observers: Observer[]) => void,
    _onError?: (error: Error) => void
  ): () => void {
    return () => undefined;
  }
}

test('VerifySessionJoinPasswordUseCase normalizes values and verifies password', async () => {
  const port = new InMemorySessionLobbyPort();
  const useCase = new VerifySessionJoinPasswordUseCase(port);

  await useCase.execute({
    sessionCode: 'ab12-cd34',
    joinPassword: 'abc123',
  });

  assert.deepEqual(port.latestVerifyRequest, {
    sessionCode: 'AB12-CD34',
    joinPassword: 'ABC123',
  });
});

test('VerifySessionJoinPasswordUseCase rejects invalid password format', async () => {
  const port = new InMemorySessionLobbyPort();
  const useCase = new VerifySessionJoinPasswordUseCase(port);

  await assert.rejects(
    () =>
      useCase.execute({
        sessionCode: 'AB12-CD34',
        joinPassword: '12',
      }),
    /参加パスワードは6文字の英数字です。/
  );
});
