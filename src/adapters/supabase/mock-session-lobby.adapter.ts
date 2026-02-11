import type {
  CreateSessionLobbyRequest,
  CreateSessionLobbyResult,
  SessionLobbyPort,
} from '@/src/application/ports/session-lobby.port';
import type { Observer } from '@/src/domain/analysis/entities';

interface MockLobbyStore {
  hostObserverId: string;
  joinPassword: string;
  observers: Observer[];
}

const lobbyStore = new Map<string, MockLobbyStore>();

export class MockSessionLobbyAdapter implements SessionLobbyPort {
  async createSessionLobby(request: CreateSessionLobbyRequest): Promise<CreateSessionLobbyResult> {
    const hostObserverId = request.hostObserverId ?? `mock-host-${Date.now()}`;

    lobbyStore.set(request.sessionCode, {
      hostObserverId,
      joinPassword: request.joinPassword,
      observers: [
        {
          id: hostObserverId,
          displayName: request.hostDisplayName || 'ホスト (あなた)',
          role: 'host',
          isActive: true,
          avatarLabel: 'H',
        },
      ],
    });

    return { hostObserverId };
  }

  async getObservers(sessionCode: string): Promise<Observer[]> {
    return lobbyStore.get(sessionCode)?.observers ?? [];
  }

  async verifySessionJoinPassword(request: {
    sessionCode: string;
    joinPassword: string;
  }): Promise<void> {
    const lobby = lobbyStore.get(request.sessionCode);

    if (!lobby) {
      throw new Error('セッションコードが見つかりません。');
    }

    if (lobby.joinPassword !== request.joinPassword) {
      throw new Error('パスワードが一致しません。');
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
