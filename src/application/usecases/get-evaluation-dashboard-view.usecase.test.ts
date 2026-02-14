import assert from 'node:assert/strict';
import test from 'node:test';

import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import { GetEvaluationDashboardViewUseCase } from '@/src/application/usecases/get-evaluation-dashboard-view.usecase';
import { createEmptyEvaluationDataset, type EvaluationDataset } from '@/src/domain/evaluation/evaluation-dataset';

class InMemoryEvaluationDatasetPort implements EvaluationDatasetPort {
  constructor(private dataset: EvaluationDataset) {}

  async loadDataset(): Promise<EvaluationDataset> {
    return this.dataset;
  }

  async saveDataset(dataset: EvaluationDataset): Promise<void> {
    this.dataset = dataset;
  }
}

test('GetEvaluationDashboardViewUseCase computes baseline metrics from dataset', async () => {
  const dataset: EvaluationDataset = createEmptyEvaluationDataset();
  dataset.sessions.push({
    id: 'eval-1',
    sourceSessionFingerprint: 'session-1',
    createdAtIso: '2026-02-14T00:00:00.000Z',
    updatedAtIso: '2026-02-14T00:00:00.000Z',
    endedAtIso: '2026-02-14T00:01:00.000Z',
    labels: {
      silenceLabeled: true,
      speakerTurnsLabeled: true,
      sentimentLabeled: true,
    },
    chunks: [
      {
        id: 'chunk-1',
        analyzedAtIso: '2026-02-14T00:00:20.000Z',
        provider: 'huggingface-edge',
        averageMeteringDb: -40,
        silenceRatio: 0.2,
        transcriptLength: 12,
        confidence: 0.7,
        engagementEstimate: '安定したエンゲージメント傾向',
        toneEstimate: '中立的なトーン傾向',
        paceEstimate: '安定した会話ペース傾向',
        tendencySummary: '安定したやり取り傾向',
      },
      {
        id: 'chunk-2',
        analyzedAtIso: '2026-02-14T00:00:40.000Z',
        provider: 'mock',
        averageMeteringDb: -50,
        silenceRatio: 0.8,
        transcriptLength: 0,
        confidence: 0.5,
        engagementEstimate: '反応が控えめな傾向',
        toneEstimate: '慎重なトーン傾向',
        paceEstimate: '間を取りやすい会話ペース傾向',
        tendencySummary: '発話が少なめの区間が続いている傾向',
      },
    ],
  });

  const useCase = new GetEvaluationDashboardViewUseCase(new InMemoryEvaluationDatasetPort(dataset));
  const view = await useCase.execute();

  assert.equal(view.capturedSessionCount, 1);
  assert.equal(view.labelCompletedSessionCount, 1);
  assert.equal(view.baseline.totalChunks, 2);
  assert.equal(Math.round((view.baseline.averageSilenceRatio ?? 0) * 100), 50);
  assert.equal(Math.round(view.baseline.mockChunkRatio * 100), 50);
});
