import type { VoiceRecorderPort } from '@/src/application/ports/voice-recorder.port';
import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export class StopVoiceRecordingUseCase {
  constructor(private readonly voiceRecorderPort: VoiceRecorderPort) {}

  async execute(): Promise<RecordedVoiceSample> {
    return this.voiceRecorderPort.stopRecording();
  }
}
