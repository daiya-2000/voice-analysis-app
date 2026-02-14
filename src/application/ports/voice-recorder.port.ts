import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export interface VoiceRecorderPort {
  startRecording(): Promise<void>;
  stopRecording(): Promise<RecordedVoiceSample>;
  setMuted(muted: boolean): Promise<void>;
  isMuted(): boolean;
}
