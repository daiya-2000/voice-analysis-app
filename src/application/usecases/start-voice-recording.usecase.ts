import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';

export class StartVoiceRecordingUseCase {
  constructor(private readonly voiceRecorderPort: VoiceRecorderPort) {}

  async execute(): Promise<void> {
    await this.voiceRecorderPort.startRecording();
  }
}
