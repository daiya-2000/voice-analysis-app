import type { Observer } from '@/src/domain/analysis/entities';

export interface CreateSessionLobbyRequest {
  sessionCode: string;
  joinPassword: string;
  qrPayload: string;
  hostObserverId?: string;
  hostDisplayName: string;
  hostAvatarPresetId: string;
}

export interface CreateSessionLobbyResult {
  hostObserverId: string;
}

export interface VerifySessionJoinPasswordRequest {
  sessionCode: string;
  joinPassword: string;
}

export interface SessionLobbyPort {
  createSessionLobby(request: CreateSessionLobbyRequest): Promise<CreateSessionLobbyResult>;
  getObservers(sessionCode: string): Promise<Observer[]>;
  verifySessionJoinPassword(request: VerifySessionJoinPasswordRequest): Promise<void>;
  subscribeObservers(
    sessionCode: string,
    onUpdate: (observers: Observer[]) => void,
    onError?: (error: Error) => void
  ): () => void;
}
