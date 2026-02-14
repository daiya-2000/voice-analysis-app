import type { EvaluationDataset } from '@/src/domain/evaluation/evaluation-dataset';

export interface EvaluationDatasetPort {
  loadDataset(): Promise<EvaluationDataset>;
  saveDataset(dataset: EvaluationDataset): Promise<void>;
}
