import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import type { EvaluationLabelProgress } from '@/src/domain/evaluation/evaluation-dataset';

interface UpdateEvaluationLabelProgressInput {
  sessionId: string;
  labels: EvaluationLabelProgress;
}

export class UpdateEvaluationLabelProgressUseCase {
  constructor(private readonly evaluationDatasetPort: EvaluationDatasetPort) {}

  async execute(input: UpdateEvaluationLabelProgressInput): Promise<void> {
    const dataset = await this.evaluationDatasetPort.loadDataset();
    const session = dataset.sessions.find((item) => item.id === input.sessionId);
    if (!session) {
      return;
    }

    session.labels = input.labels;
    session.updatedAtIso = new Date().toISOString();
    await this.evaluationDatasetPort.saveDataset(dataset);
  }
}
