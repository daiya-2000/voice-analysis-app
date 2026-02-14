import assert from 'node:assert/strict';
import test from 'node:test';

import type { LiveAudioAnalysisPort } from '@/src/application/ports/live-audio-analysis.port';
import { AnalyzeLiveAudioSampleUseCase } from '@/src/application/usecases/analyze-live-audio-sample.usecase';
import type {
  LiveAudioAnalysisRequest,
  LiveAudioAnalysisResult,
} from '@/src/domain/analysis/live-audio-analysis';

class InMemoryLiveAudioAnalysisPort implements LiveAudioAnalysisPort {
  latestRequest: LiveAudioAnalysisRequest | null = null;

  async analyzeLiveAudioSample(request: LiveAudioAnalysisRequest): Promise<LiveAudioAnalysisResult> {
    this.latestRequest = request;

    return {
      engagementEstimate: 'エンゲージメント高めの傾向',
      toneEstimate: '共感的なトーン傾向',
      paceEstimate: '安定した会話ペース傾向',
      tendencySummary: '会話全体は調和的な傾向',
      confidence: 0.71,
      analyzedAtIso: '2026-02-11T00:00:00.000Z',
      provider: 'mock',
    };
  }
}

test('AnalyzeLiveAudioSampleUseCase forwards request and returns analysis result', async () => {
  const port = new InMemoryLiveAudioAnalysisPort();
  const useCase = new AnalyzeLiveAudioSampleUseCase(port);

  const request: LiveAudioAnalysisRequest = {
    sessionCode: 'AB12-CD34',
    observerId: 'host-001',
    sample: {
      base64Audio: 'AAAABBBB',
      mimeType: 'audio/m4a',
      durationMs: 20_000,
    },
  };

  const result = await useCase.execute(request);

  assert.equal(port.latestRequest?.sessionCode, 'AB12-CD34');
  assert.equal(result.provider, 'mock');
  assert.match(result.toneEstimate, /傾向/);
});
