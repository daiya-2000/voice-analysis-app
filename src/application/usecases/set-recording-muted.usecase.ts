import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';

export class SetRecordingMutedUseCase {
  constructor(private readonly voiceRecorderPort: VoiceRecorderPort) {}

  async execute(muted: boolean): Promise<void> {
    await this.voiceRecorderPort.setMuted(muted);
  }
}
