import type { SessionLobbyPort } from '@/src/application/ports/session-lobby.port';
import {
  buildSessionJoinPayload,
  generateSessionCode,
  generateSessionJoinPassword,
} from '@/src/domain/session/session-access';

export interface CreateSessionLobbyInput {
  hostObserverId?: string;
  hostDisplayName: string;
  hostAvatarPresetId: string;
}

export interface CreateSessionLobbyOutput {
  sessionCode: string;
  joinPassword: string;
  qrPayload: string;
  hostObserverId: string;
}

export class CreateSessionLobbyUseCase {
  constructor(private readonly sessionLobbyPort: SessionLobbyPort) {}

  async execute(input: CreateSessionLobbyInput): Promise<CreateSessionLobbyOutput> {
    const sessionCode = generateSessionCode();
    const joinPassword = generateSessionJoinPassword();
    const qrPayload = buildSessionJoinPayload(sessionCode);

    const result = await this.sessionLobbyPort.createSessionLobby({
      sessionCode,
      joinPassword,
      qrPayload,
      hostObserverId: input.hostObserverId,
      hostDisplayName: input.hostDisplayName,
      hostAvatarPresetId: input.hostAvatarPresetId,
    });

    return {
      sessionCode,
      joinPassword,
      qrPayload,
      hostObserverId: result.hostObserverId,
    };
  }
}
