export interface LiveAnalysisScorePoint {
  engagementScore: number;
  toneScore: number;
  paceScore: number;
  confidence: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function smoothLiveAnalysisScores(
  history: LiveAnalysisScorePoint[],
  nextPoint: LiveAnalysisScorePoint,
  windowSize = 5
): {
  nextHistory: LiveAnalysisScorePoint[];
  smoothedPoint: LiveAnalysisScorePoint;
} {
  const nextHistory = [...history, nextPoint].slice(-windowSize);
  return {
    nextHistory,
    smoothedPoint: {
      engagementScore: clamp01(average(nextHistory.map((point) => point.engagementScore))),
      toneScore: clamp01(average(nextHistory.map((point) => point.toneScore))),
      paceScore: clamp01(average(nextHistory.map((point) => point.paceScore))),
      confidence: clamp01(average(nextHistory.map((point) => point.confidence))),
    },
  };
}

export function isLowConfidence(smoothedConfidence: number): boolean {
  return smoothedConfidence < 0.46;
}

