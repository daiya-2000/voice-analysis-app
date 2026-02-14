import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

loadDotEnv();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

async function main() {
  const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError) {
    throw new Error(`Anonymous sign-in failed: ${signInError.message}`);
  }

  if (!signInData.session?.access_token || !signInData.session.refresh_token) {
    throw new Error('Anonymous session tokens are missing.');
  }

  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  });
  if (setSessionError) {
    throw new Error(`setSession failed: ${setSessionError.message}`);
  }

  const accessToken = signInData.session.access_token;
  const jwtPayload = decodeJwtPayload(accessToken);
  console.log('session-jwt:', {
    sub: jwtPayload?.sub ?? null,
    role: jwtPayload?.role ?? null,
    iss: jwtPayload?.iss ?? null,
    aud: jwtPayload?.aud ?? null,
    exp: jwtPayload?.exp ?? null,
    kid: decodeJwtHeader(accessToken)?.kid ?? null,
  });

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userBody = await userResponse.text();
  console.log('auth-v1-user:', {
    status: userResponse.status,
    body: safeJson(userBody),
  });

  const jwksResponse = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
  const jwksBody = await jwksResponse.text();
  const jwks = safeJson(jwksBody);
  const keyCount = jwks && Array.isArray(jwks.keys) ? jwks.keys.length : 0;
  console.log('jwks:', {
    status: jwksResponse.status,
    keyCount,
  });

  const authPing = await supabase.functions.invoke('auth-ping', { body: {} });
  console.log('auth-ping:', toResult(authPing));

  const liveAnalyze = await supabase.functions.invoke('live-analyze', {
    body: {
      audioBase64: 'AA==',
      audioMimeType: 'audio/m4a',
      durationMs: 1000,
      averageMeteringDb: -60,
      silenceRatio: 1,
      peakMeteringDb: -55,
      dynamicRangeDb: 1,
    },
  });
  console.log('live-analyze:', toResult(liveAnalyze));
}

function toResult(response) {
  if (response.error) {
    const context = response.error.context;
    return {
      ok: false,
      message: response.error.message,
      status: context?.status ?? null,
    };
  }

  return {
    ok: true,
    data: response.data,
  };
}

void main();

function loadDotEnv() {
  try {
    const raw = readFileSync('.env', 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separator = trimmed.indexOf('=');
      if (separator < 0) {
        continue;
      }

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env が無い場合は既存の process.env を利用
  }
}

function decodeJwtHeader(token) {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  return decodeBase64Json(parts[0]);
}

function decodeJwtPayload(token) {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  return decodeBase64Json(parts[1]);
}

function decodeBase64Json(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const decoded = atob(padded);
  return JSON.parse(decoded);
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
