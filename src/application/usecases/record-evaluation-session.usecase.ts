import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import {
  buildSessionFingerprint,
  createDefaultLabelProgress,
} from '@/src/domain/evaluation/evaluation-dataset';

export class RecordEvaluationSessionUseCase {
  constructor(private readonly evaluationDatasetPort: EvaluationDatasetPort) {}

  async start(sessionCode?: string): Promise<string> {
    const dataset = await this.evaluationDatasetPort.loadDataset();
    const nowIso = new Date().toISOString();
    const sessionId = `eval-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)
      .toString(36)
      .padStart(2, '0')}`;

    dataset.sessions.unshift({
      id: sessionId,
      sourceSessionFingerprint: buildSessionFingerprint(sessionCode),
      createdAtIso: nowIso,
      updatedAtIso: nowIso,
      endedAtIso: null,
      labels: createDefaultLabelProgress(),
      chunks: [],
    });

    await this.evaluationDatasetPort.saveDataset(dataset);
    return sessionId;
  }

  async complete(sessionId: string): Promise<void> {
    const dataset = await this.evaluationDatasetPort.loadDataset();
    const session = dataset.sessions.find((item) => item.id === sessionId);
    if (!session) {
      return;
    }

    const nowIso = new Date().toISOString();
    session.endedAtIso = nowIso;
    session.updatedAtIso = nowIso;
    await this.evaluationDatasetPort.saveDataset(dataset);
  }
}
