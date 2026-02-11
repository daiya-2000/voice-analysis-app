import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

interface VoiceEnrollPayload {
  observerId: string;
  sessionCode?: string;
  observerRole: 'host' | 'observer';
  displayName: string;
  avatarPresetId: string;
  scriptId: string;
  scriptText: string;
  scriptObjective: string;
  audioBase64: string;
  audioMimeType?: string;
  durationMs?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as VoiceEnrollPayload;

    if (!body.audioBase64 || !body.observerId || !body.scriptText) {
      return jsonResponse({ error: 'Invalid payload for voice enrollment.' }, 400);
    }

    const hfApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    const asrModel = Deno.env.get('HF_ASR_MODEL') ?? 'openai/whisper-large-v3';
    const sentimentModel =
      Deno.env.get('HF_SENTIMENT_MODEL') ?? 'daigo/bert-base-japanese-sentiment';

    const audioBuffer = decodeBase64(body.audioBase64);

    const asrText = hfApiKey
      ? await transcribeAudio({ apiKey: hfApiKey, model: asrModel, audioBuffer, mimeType: body.audioMimeType })
      : '';

    const sentimentScore = hfApiKey && asrText
      ? await estimateSentiment({ apiKey: hfApiKey, model: sentimentModel, text: asrText })
      : 0.5;

    const tendencySummary = toSoftTendencyText(sentimentScore, asrText);
    const confidence = Math.min(0.95, Math.max(0.35, 0.45 + Math.abs(sentimentScore - 0.5)));

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let enrollmentId = `edge-${crypto.randomUUID()}`;

    if (supabaseUrl && supabaseServiceRoleKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

      const { data } = await supabase
        .from('voice_enrollments')
        .insert({
          observer_id: body.observerId,
          session_code: body.sessionCode ?? null,
          observer_role: body.observerRole,
          display_name: body.displayName,
          avatar_preset_id: body.avatarPresetId,
          script_id: body.scriptId,
          script_text: body.scriptText,
          script_objective: body.scriptObjective,
          transcript_estimate: asrText,
          tendency_summary: tendencySummary,
          confidence,
          duration_ms: body.durationMs ?? null,
        })
        .select('id')
        .single();

      if (data?.id) {
        enrollmentId = data.id;
      }
    }

    return jsonResponse({
      enrollmentId,
      tendencySummary,
      confidence,
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

function toSoftTendencyText(sentimentScore: number, transcript: string): string {
  if (transcript.length === 0) {
    return '音声サンプルの特徴量を登録しました';
  }

  if (sentimentScore >= 0.67) {
    return 'ややポジティブなトーン傾向を検出しました';
  }

  if (sentimentScore <= 0.33) {
    return '落ち着いたトーン傾向を検出しました';
  }

  return '中立的なトーン傾向を検出しました';
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
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
