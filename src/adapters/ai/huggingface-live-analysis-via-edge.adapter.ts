import type { LiveAudioAnalysisPort } from '@/src/application/ports/live-audio-analysis.port';
import {
  getSupabaseAccessToken,
  getSupabaseProjectUrl,
  getSupabasePublishableOrAnonKey,
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
  averageMeteringDb?: number;
  silenceRatio?: number;
  transcriptLength?: number;
  analyzedAtIso?: string;
}

export class HuggingFaceLiveAnalysisViaEdgeAdapter implements LiveAudioAnalysisPort {
  async analyzeLiveAudioSample(request: LiveAudioAnalysisRequest): Promise<LiveAudioAnalysisResult> {
    const accessToken = await getSupabaseAccessToken();
    const projectUrl = getSupabaseProjectUrl().replace(/\/$/, '');
    const publishableOrAnonKey = getSupabasePublishableOrAnonKey();

    const response = await fetch(`${projectUrl}/functions/v1/live-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: publishableOrAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        sessionCode: request.sessionCode,
        observerId: request.observerId,
        audioBase64: request.sample.base64Audio,
        audioMimeType: request.sample.mimeType,
        durationMs: request.sample.durationMs,
        averageMeteringDb: request.sample.averageMeteringDb,
        silenceRatio: request.sample.silenceRatio,
        peakMeteringDb: request.sample.peakMeteringDb,
        dynamicRangeDb: request.sample.dynamicRangeDb,
      }),
    });

    let data: LiveAnalyzeFunctionResponse | null = null;
    try {
      data = (await response.json()) as LiveAnalyzeFunctionResponse;
    } catch {
      data = null;
    }

    if (!response.ok) {
      const bodyText = data ? JSON.stringify(data) : '';
      throw new Error(
        `Edge function live-analyze failed (${response.status}): ${bodyText || 'Unknown error'}`
      );
    }

    return {
      engagementEstimate: data?.engagementEstimate ?? '安定したエンゲージメント傾向',
      toneEstimate: data?.toneEstimate ?? '中立的なトーン傾向',
      paceEstimate: data?.paceEstimate ?? '安定した会話ペース傾向',
      tendencySummary: data?.tendencySummary ?? '会話傾向を推定しました',
      confidence: data?.confidence ?? 0.5,
      averageMeteringDb: data?.averageMeteringDb ?? request.sample.averageMeteringDb,
      silenceRatio: data?.silenceRatio ?? request.sample.silenceRatio,
      transcriptLength: data?.transcriptLength,
      analyzedAtIso: data?.analyzedAtIso ?? new Date().toISOString(),
      provider: 'huggingface-edge',
    };
  }
}
