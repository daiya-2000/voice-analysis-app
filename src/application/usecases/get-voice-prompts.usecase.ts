import { VOICE_SAMPLE_PROMPTS, type VoicePrompt } from '@/src/domain/voice/voice-prompt';

export class GetVoicePromptsUseCase {
  execute(): VoicePrompt[] {
    return VOICE_SAMPLE_PROMPTS;
  }
}
