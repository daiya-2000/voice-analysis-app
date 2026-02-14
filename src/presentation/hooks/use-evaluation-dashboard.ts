import { useCallback, useEffect, useMemo, useState } from 'react';

import { LocalEvaluationDatasetAdapter } from '@/src/adapters/storage/local-evaluation-dataset.adapter';
import { GetEvaluationDashboardViewUseCase } from '@/src/application/usecases/get-evaluation-dashboard-view.usecase';
import { UpdateEvaluationLabelProgressUseCase } from '@/src/application/usecases/update-evaluation-label-progress.usecase';
import type { EvaluationLabelProgress } from '@/src/domain/evaluation/evaluation-dataset';

export function useEvaluationDashboard() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<GetEvaluationDashboardViewUseCase['execute']>
  > | null>(null);

  const adapter = useMemo(() => new LocalEvaluationDatasetAdapter(), []);
  const getViewUseCase = useMemo(() => new GetEvaluationDashboardViewUseCase(adapter), [adapter]);
  const updateLabelsUseCase = useMemo(
    () => new UpdateEvaluationLabelProgressUseCase(adapter),
    [adapter]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const next = await getViewUseCase.execute();
      setDashboard(next);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '評価データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [getViewUseCase]);

  const toggleLabel = useCallback(
    async (sessionId: string, key: keyof EvaluationLabelProgress, current: EvaluationLabelProgress) => {
      const nextLabels: EvaluationLabelProgress = {
        ...current,
        [key]: !current[key],
      };

      await updateLabelsUseCase.execute({
        sessionId,
        labels: nextLabels,
      });

      await refresh();
    },
    [refresh, updateLabelsUseCase]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    dashboard,
    errorMessage,
    loading,
    refresh,
    toggleLabel,
  };
}
