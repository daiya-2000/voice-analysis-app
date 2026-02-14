function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function pickFromBucket(values: readonly string[], bucket: 0 | 1 | 2, seed: number): string {
  const baseIndex = bucket * 4;
  const offset = Math.abs(seed) % 4;
  return values[baseIndex + offset];
}

export const ENGAGEMENT_EXPRESSIONS = [
  '反応が控えめな傾向',
  '発話量が少なめの傾向',
  '間が長くなりやすい傾向',
  'エネルギー低めの傾向',
  '緩やかな参加傾向',
  '様子見の反応傾向',
  '安定したエンゲージメント傾向',
  'バランスのよい参加傾向',
  '反応が増加している傾向',
  '発話の勢いが高まりつつある傾向',
  'エンゲージメント高めの傾向',
  '活発なやり取り傾向',
] as const;

export const TONE_EXPRESSIONS = [
  '緊張が残るトーン傾向',
  '慎重なトーン傾向',
  '抑制的なトーン傾向',
  '硬めのトーン傾向',
  '落ち着いたトーン傾向',
  '中立的なトーン傾向',
  '安定したトーン傾向',
  '協調的なトーン傾向',
  '共感的なトーン傾向',
  '前向きなトーン傾向',
  '明るめのトーン傾向',
  '活気のあるトーン傾向',
] as const;

export const PACE_EXPRESSIONS = [
  '非常にゆっくりした会話ペース傾向',
  'ゆっくりした会話ペース傾向',
  '間を取りやすい会話ペース傾向',
  '落ち着いた会話ペース傾向',
  'ややゆるやかな会話ペース傾向',
  '安定した会話ペース傾向',
  'バランスのよい会話ペース傾向',
  'やや速めの会話ペース傾向',
  '速めの会話ペース傾向',
  'テンポの高い会話ペース傾向',
  '変動しやすい会話ペース傾向',
  '波のある会話ペース傾向',
] as const;

export interface LiveAnalysisLabelInput {
  silenceLikely: boolean;
  engagementScore: number;
  toneScore: number;
  paceScore: number;
  seed: number;
}

export interface LiveAnalysisLabels {
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
}

function bucketFromScore(score: number): 0 | 1 | 2 {
  const normalized = clamp01(score);

  if (normalized < 0.34) {
    return 0;
  }

  if (normalized < 0.67) {
    return 1;
  }

  return 2;
}

export function resolveLiveAnalysisLabels(input: LiveAnalysisLabelInput): LiveAnalysisLabels {
  if (input.silenceLikely) {
    const seed = Math.abs(input.seed);

    return {
      engagementEstimate: ENGAGEMENT_EXPRESSIONS[seed % 4],
      toneEstimate: TONE_EXPRESSIONS[(seed + 1) % 4],
      paceEstimate: PACE_EXPRESSIONS[(seed + 2) % 4],
    };
  }

  const engagementBucket = bucketFromScore(input.engagementScore);
  const toneBucket = bucketFromScore(input.toneScore);
  const paceBucket = bucketFromScore(input.paceScore);

  return {
    engagementEstimate: pickFromBucket(ENGAGEMENT_EXPRESSIONS, engagementBucket, input.seed),
    toneEstimate: pickFromBucket(TONE_EXPRESSIONS, toneBucket, input.seed + 17),
    paceEstimate: pickFromBucket(PACE_EXPRESSIONS, paceBucket, input.seed + 29),
  };
}
