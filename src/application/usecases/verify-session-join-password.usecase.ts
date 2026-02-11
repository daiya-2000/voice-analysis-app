import type { SessionLobbyPort } from '@/src/application/ports/session-lobby.port';
import {
  isValidSessionCode,
  isValidSessionJoinPassword,
  normalizeSessionCode,
  normalizeSessionJoinPassword,
} from '@/src/domain/session/session-access';

export interface VerifySessionJoinPasswordInput {
  sessionCode: string;
  joinPassword: string;
}

export class VerifySessionJoinPasswordUseCase {
  constructor(private readonly sessionLobbyPort: SessionLobbyPort) {}

  async execute(input: VerifySessionJoinPasswordInput): Promise<void> {
    const sessionCode = normalizeSessionCode(input.sessionCode);
    const joinPassword = normalizeSessionJoinPassword(input.joinPassword);

    if (!isValidSessionCode(sessionCode)) {
      throw new Error('セッションコードの形式が不正です。QRコードを再読み取りしてください。');
    }

    if (!isValidSessionJoinPassword(joinPassword)) {
      throw new Error('参加パスワードは6文字の英数字です。');
    }

    await this.sessionLobbyPort.verifySessionJoinPassword({
      sessionCode,
      joinPassword,
    });
  }
}
