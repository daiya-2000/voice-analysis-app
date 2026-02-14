import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import type {
  EvaluationChunkRecord,
  EvaluationLabelProgress,
  EvaluationProvider,
} from '@/src/domain/evaluation/evaluation-dataset';

export interface EvaluationSessionView {
  id: string;
  fingerprint: string;
  createdAtIso: string;
  endedAtIso: string | null;
  chunkCount: number;
  averageSilenceRatio: number | null;
  averageMeteringDb: number | null;
  averageConfidence: number;
  providers: EvaluationProvider[];
  labels: EvaluationLabelProgress;
}

export interface EvaluationDashboardView {
  capturedSessionCount: number;
  targetSessionRangeLabel: string;
  labelCompletedSessionCount: number;
  baseline: {
    totalChunks: number;
    averageSilenceRatio: number | null;
    averageConfidence: number;
    mockChunkRatio: number;
  };
  recentSessions: EvaluationSessionView[];
}

function average(values: (number | null)[]): number | null {
  const valid = values.filter((value): value is number => typeof value === 'number');
  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function isLabeledComplete(labels: EvaluationLabelProgress): boolean {
  return labels.silenceLabeled && labels.speakerTurnsLabeled && labels.sentimentLabeled;
}

function uniqueProviders(chunks: EvaluationChunkRecord[]): EvaluationProvider[] {
  return Array.from(new Set(chunks.map((chunk) => chunk.provider)));
}

export class GetEvaluationDashboardViewUseCase {
  constructor(private readonly evaluationDatasetPort: EvaluationDatasetPort) {}

  async execute(): Promise<EvaluationDashboardView> {
    const dataset = await this.evaluationDatasetPort.loadDataset();
    const sessions = dataset.sessions;
    const allChunks = sessions.flatMap((session) => session.chunks);
    const mockChunks = allChunks.filter((chunk) => chunk.provider === 'mock').length;

    return {
      capturedSessionCount: sessions.length,
      targetSessionRangeLabel: '10〜20セッション',
      labelCompletedSessionCount: sessions.filter((session) => isLabeledComplete(session.labels)).length,
      baseline: {
        totalChunks: allChunks.length,
        averageSilenceRatio: average(allChunks.map((chunk) => chunk.silenceRatio)),
        averageConfidence: average(allChunks.map((chunk) => chunk.confidence)) ?? 0,
        mockChunkRatio: allChunks.length > 0 ? mockChunks / allChunks.length : 0,
      },
      recentSessions: sessions.slice(0, 20).map((session) => ({
        id: session.id,
        fingerprint: session.sourceSessionFingerprint,
        createdAtIso: session.createdAtIso,
        endedAtIso: session.endedAtIso,
        chunkCount: session.chunks.length,
        averageSilenceRatio: average(session.chunks.map((chunk) => chunk.silenceRatio)),
        averageMeteringDb: average(session.chunks.map((chunk) => chunk.averageMeteringDb)),
        averageConfidence: average(session.chunks.map((chunk) => chunk.confidence)) ?? 0,
        providers: uniqueProviders(session.chunks),
        labels: session.labels,
      })),
    };
  }
}
