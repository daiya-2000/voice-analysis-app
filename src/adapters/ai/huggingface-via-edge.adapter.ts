import type { VoiceEnrollmentPort } from '@/src/application/ports/voice-enrollment.port';
import { ensureSupabaseAuthSession, getSupabaseClient } from '@/src/adapters/supabase/client';
import type { VoiceEnrollmentRequest, VoiceEnrollmentResult } from '@/src/domain/voice/voice-enrollment';

interface VoiceEnrollFunctionResponse {
  enrollmentId?: string;
  tendencySummary?: string;
  confidence?: number;
}

export class HuggingFaceViaEdgeAdapter implements VoiceEnrollmentPort {
  async enrollVoiceSample(request: VoiceEnrollmentRequest): Promise<VoiceEnrollmentResult> {
    await ensureSupabaseAuthSession();

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke<VoiceEnrollFunctionResponse>('voice-enroll', {
      body: {
        observerId: request.observerId,
        sessionCode: request.sessionCode,
        observerRole: request.observerRole,
        displayName: request.displayName,
        avatarPresetId: request.avatarPresetId,
        scriptId: request.script.id,
        scriptText: request.script.text,
        scriptObjective: request.script.objective,
        audioBase64: request.sample.base64Audio,
        audioMimeType: request.sample.mimeType,
        durationMs: request.sample.durationMs,
      },
    });

    if (error) {
      const context = (error as { context?: Response }).context;

      if (context) {
        const responseBody = await context.text();
        throw new Error(
          `Edge function voice-enroll failed (${context.status}): ${responseBody || error.message}`
        );
      }

      throw new Error(`Edge function voice-enroll failed: ${error.message}`);
    }

    return {
      enrollmentId: data?.enrollmentId ?? `edge-${Date.now()}`,
      tendencySummary: data?.tendencySummary ?? '推定処理を完了しました',
      confidence: data?.confidence ?? 0.5,
      provider: 'huggingface-edge',
    };
  }
}
