import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import type { EvaluationProvider } from '@/src/domain/evaluation/evaluation-dataset';

interface AppendEvaluationChunkInput {
  sessionId: string;
  analyzedAtIso: string | null;
  provider: EvaluationProvider;
  averageMeteringDb: number | null;
  silenceRatio: number | null;
  transcriptLength: number | null;
  confidence: number;
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  tendencySummary: string;
}

export class AppendEvaluationChunkUseCase {
  constructor(private readonly evaluationDatasetPort: EvaluationDatasetPort) {}

  async execute(input: AppendEvaluationChunkInput): Promise<void> {
    const dataset = await this.evaluationDatasetPort.loadDataset();
    const session = dataset.sessions.find((item) => item.id === input.sessionId);
    if (!session) {
      return;
    }

    session.chunks.push({
      id: `chunk-${Date.now().toString(36)}-${session.chunks.length.toString(36)}`,
      analyzedAtIso: input.analyzedAtIso ?? new Date().toISOString(),
      provider: input.provider,
      averageMeteringDb: input.averageMeteringDb,
      silenceRatio: input.silenceRatio,
      transcriptLength: input.transcriptLength,
      confidence: input.confidence,
      engagementEstimate: input.engagementEstimate,
      toneEstimate: input.toneEstimate,
      paceEstimate: input.paceEstimate,
      tendencySummary: input.tendencySummary,
    });
    session.updatedAtIso = new Date().toISOString();
    await this.evaluationDatasetPort.saveDataset(dataset);
  }
}
