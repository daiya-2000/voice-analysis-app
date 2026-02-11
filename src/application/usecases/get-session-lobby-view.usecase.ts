import type { SessionDataPort } from '@/src/application/ports/session-data.port';
import type { Observer } from '@/src/domain/analysis/entities';

export interface SessionLobbyView {
  sessionCode: string;
  activeObserverCount: number;
  observers: Observer[];
}

export class GetSessionLobbyViewUseCase {
  constructor(private readonly sessionDataPort: SessionDataPort) {}

  execute(): SessionLobbyView {
    const snapshot = this.sessionDataPort.getSessionSnapshot();

    return {
      sessionCode: snapshot.sessionCode,
      activeObserverCount: snapshot.activeObserverCount,
      observers: snapshot.observers,
    };
  }
}
