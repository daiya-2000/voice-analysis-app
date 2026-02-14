interface LiveAnalyzePayload {
  sessionCode?: string;
  observerId?: string;
  audioBase64: string;
  audioMimeType?: string;
  durationMs?: number;
  averageMeteringDb?: number;
  silenceRatio?: number;
  peakMeteringDb?: number;
  dynamicRangeDb?: number;
}

const ENGAGEMENT_EXPRESSIONS = [
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

const TONE_EXPRESSIONS = [
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

const PACE_EXPRESSIONS = [
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as LiveAnalyzePayload;

    if (!body.audioBase64) {
      return jsonResponse({ error: 'Invalid payload for live analysis.' }, 400);
    }

    const hfApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    const asrModel = Deno.env.get('HF_ASR_MODEL') ?? 'openai/whisper-large-v3';
    const sentimentModel =
      Deno.env.get('HF_SENTIMENT_MODEL') ?? 'daigo/bert-base-japanese-sentiment';

    const audioBuffer = decodeBase64(body.audioBase64);

    const transcriptEstimate = hfApiKey
      ? await transcribeAudio({
          apiKey: hfApiKey,
          model: asrModel,
          audioBuffer,
          mimeType: body.audioMimeType,
        })
      : '';

    const sentimentScore = hfApiKey && transcriptEstimate
      ? await estimateSentiment({ apiKey: hfApiKey, model: sentimentModel, text: transcriptEstimate })
      : 0.5;

    const timeBucket = Math.floor(Date.now() / 20_000);
    const seed = hashSeed(
      `${transcriptEstimate}:${body.durationMs ?? 0}:${body.averageMeteringDb ?? 'na'}:${timeBucket}`
    );
    const durationSec = body.durationMs && body.durationMs > 0 ? body.durationMs / 1000 : 1;
    const charsPerSecond = transcriptEstimate.length / durationSec;
    const averageMeteringDb = typeof body.averageMeteringDb === 'number' ? body.averageMeteringDb : -45;
    const silenceRatio = typeof body.silenceRatio === 'number' ? body.silenceRatio : 0.5;
    const peakMeteringDb = typeof body.peakMeteringDb === 'number' ? body.peakMeteringDb : averageMeteringDb;
    const dynamicRangeDb = typeof body.dynamicRangeDb === 'number' ? body.dynamicRangeDb : 0;
    const silenceBySignal =
      silenceRatio >= 0.96 ||
      (silenceRatio >= 0.85 && averageMeteringDb <= -55) ||
      (dynamicRangeDb <= 6 && averageMeteringDb <= -48);
    const silenceByTranscript = transcriptEstimate.trim().length < 4;
    const silenceLikely = silenceBySignal || (silenceByTranscript && averageMeteringDb <= -48);

    const speechRatio = clamp01(1 - silenceRatio);
    const meteringActivity = clamp01((averageMeteringDb + 62) / 30);
    const peakActivity = clamp01((peakMeteringDb + 58) / 34);
    const dynamicActivity = clamp01((dynamicRangeDb - 5) / 20);
    const transcriptActivity = clamp01((charsPerSecond - 0.6) / 3.2);
    const engagementScore = clamp01(
      speechRatio * 0.32 +
        meteringActivity * 0.22 +
        peakActivity * 0.2 +
        dynamicActivity * 0.16 +
        transcriptActivity * 0.1
    );
    const toneScore = clamp01(
      sentimentScore * 0.45 +
        meteringActivity * 0.15 +
        speechRatio * 0.15 +
        dynamicActivity * 0.1 +
        peakActivity * 0.15
    );
    const paceScore = clamp01(
      speechRatio * 0.3 + transcriptActivity * 0.35 + dynamicActivity * 0.35
    );

    const labels = resolveLiveAnalysisLabels({
      silenceLikely,
      engagementScore,
      toneScore,
      paceScore,
      seed,
    });

    const tendencySummary = silenceLikely
      ? '発話が少なめの区間が続いている傾向'
      : `${labels.engagementEstimate} / ${labels.toneEstimate} / ${labels.paceEstimate}`;
    const confidence = resolveConfidence(sentimentScore, transcriptEstimate);

    return jsonResponse({
      engagementEstimate: labels.engagementEstimate,
      toneEstimate: labels.toneEstimate,
      paceEstimate: labels.paceEstimate,
      tendencySummary,
      confidence,
      averageMeteringDb,
      silenceRatio,
      transcriptLength: transcriptEstimate.length,
      analyzedAtIso: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return jsonResponse({ error: message }, 500);
  }
});

async function transcribeAudio(input: {
  apiKey: string;
  model: string;
  audioBuffer: Uint8Array;
  mimeType?: string;
}): Promise<string> {
  const response = await fetch(`https://api-inference.huggingface.co/models/${input.model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': input.mimeType ?? 'audio/m4a',
    },
    body: input.audioBuffer,
  });

  if (!response.ok) {
    return '';
  }

  const payload = await response.json();

  if (typeof payload?.text === 'string') {
    return payload.text;
  }

  return '';
}

async function estimateSentiment(input: {
  apiKey: string;
  model: string;
  text: string;
}): Promise<number> {
  const response = await fetch(`https://api-inference.huggingface.co/models/${input.model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: input.text }),
  });

  if (!response.ok) {
    return 0.5;
  }

  const payload = await response.json();

  const first = Array.isArray(payload) && Array.isArray(payload[0]) ? payload[0][0] : payload?.[0];

  if (typeof first?.score === 'number') {
    return first.score;
  }

  return 0.5;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
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

function pickFromBucket(values: readonly string[], bucket: 0 | 1 | 2, seed: number): string {
  const baseIndex = bucket * 4;
  const offset = Math.abs(seed) % 4;
  return values[baseIndex + offset];
}

function resolveLiveAnalysisLabels(input: {
  silenceLikely: boolean;
  engagementScore: number;
  toneScore: number;
  paceScore: number;
  seed: number;
}): {
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
} {
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

function hashSeed(input: string): number {
  let seed = 0;

  for (let index = 0; index < input.length; index += 1) {
    seed = (seed * 31 + input.charCodeAt(index)) >>> 0;
  }

  return seed;
}

function resolveConfidence(sentimentScore: number, transcript: string): number {
  const base = 0.4;
  const sentimentWeight = Math.abs(sentimentScore - 0.5) * 0.4;
  const transcriptWeight = Math.min(0.2, transcript.length / 200);

  return Math.min(0.95, Math.max(0.35, base + sentimentWeight + transcriptWeight));
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
