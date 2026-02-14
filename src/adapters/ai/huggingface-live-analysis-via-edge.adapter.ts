import type { LiveAudioAnalysisPort } from '@/src/application/ports/live-audio-analysis.port';
import {
  ensureSupabaseAuthSession,
  getSupabaseClient,
  renewSupabaseAuthSession,
} from '@/src/adapters/supabase/client';
import type {
  LiveAudioAnalysisRequest,
  LiveAudioAnalysisResult,
} from '@/src/domain/analysis/live-audio-analysis';

interface LiveAnalyzeFunctionResponse {
  engagementEstimate?: string;
  toneEstimate?: string;
  paceEstimate?: string;
  tendencySummary?: string;
  confidence?: number;
  engagementScore?: number;
  toneScore?: number;
  paceScore?: number;
  averageMeteringDb?: number;
  silenceRatio?: number;
  transcriptLength?: number;
  analyzedAtIso?: string;
}

export class HuggingFaceLiveAnalysisViaEdgeAdapter implements LiveAudioAnalysisPort {
  async analyzeLiveAudioSample(request: LiveAudioAnalysisRequest): Promise<LiveAudioAnalysisResult> {
    await ensureSupabaseAuthSession();
    const supabase = getSupabaseClient();
    try {
      const data = await this.invokeLiveAnalyze(supabase, request);
      return this.toResult(data, request);
    } catch (error) {
      if (!this.isInvalidJwtError(error)) {
        throw error;
      }

      await renewSupabaseAuthSession();
      const retriedData = await this.invokeLiveAnalyze(supabase, request);
      return this.toResult(retriedData, request);
    }
  }

  private async invokeLiveAnalyze(
    supabase: ReturnType<typeof getSupabaseClient>,
    request: LiveAudioAnalysisRequest
  ): Promise<LiveAnalyzeFunctionResponse | null> {
    const { data, error } = await supabase.functions.invoke<LiveAnalyzeFunctionResponse>('live-analyze', {
      body: {
        sessionCode: request.sessionCode,
        observerId: request.observerId,
        audioBase64: request.sample.base64Audio,
        audioMimeType: request.sample.mimeType,
        durationMs: request.sample.durationMs,
        averageMeteringDb: request.sample.averageMeteringDb,
        silenceRatio: request.sample.silenceRatio,
        peakMeteringDb: request.sample.peakMeteringDb,
        dynamicRangeDb: request.sample.dynamicRangeDb,
        noiseFloorDb: request.sample.noiseFloorDb,
        preprocessing: request.preprocessing,
      },
    });

    if (error) {
      const context = (error as { context?: Response }).context;
      const responseBody = context ? await context.text() : '';
      throw new Error(
        `Edge function live-analyze failed${context ? ` (${context.status})` : ''}: ${responseBody || error.message}`
      );
    }

    return data;
  }

  private toResult(
    data: LiveAnalyzeFunctionResponse | null,
    request: LiveAudioAnalysisRequest
  ): LiveAudioAnalysisResult {
    return {
      engagementEstimate: data?.engagementEstimate ?? '安定したエンゲージメント傾向',
      toneEstimate: data?.toneEstimate ?? '中立的なトーン傾向',
      paceEstimate: data?.paceEstimate ?? '安定した会話ペース傾向',
      tendencySummary: data?.tendencySummary ?? '会話傾向を推定しました',
      confidence: data?.confidence ?? 0.5,
      engagementScore: data?.engagementScore,
      toneScore: data?.toneScore,
      paceScore: data?.paceScore,
      averageMeteringDb: data?.averageMeteringDb ?? request.sample.averageMeteringDb,
      silenceRatio: data?.silenceRatio ?? request.sample.silenceRatio,
      transcriptLength: data?.transcriptLength,
      analyzedAtIso: data?.analyzedAtIso ?? new Date().toISOString(),
      provider: 'huggingface-edge',
    };
  }

  private isInvalidJwtError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    return /invalid jwt|jwt/i.test(error.message);
  }
}
