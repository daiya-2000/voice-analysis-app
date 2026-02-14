const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authContext = await verifyRequestAuth(req);
    if (!authContext.ok) {
      return jsonResponse({ ok: false, error: authContext.error }, 401);
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const payload = token ? decodeJwtPayload(token) : null;

    return jsonResponse({
      ok: true,
      route: 'auth-ping',
      checkedAtIso: new Date().toISOString(),
      userId: authContext.userId,
      hasAuthorizationHeader: Boolean(authHeader),
      jwt: payload
        ? {
            sub: toStringOrNull(payload.sub),
            role: toStringOrNull(payload.role),
            iss: toStringOrNull(payload.iss),
            exp: toNumberOrNull(payload.exp),
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return jsonResponse({ ok: false, error: message }, 500);
  }
});

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const encodedPayload = parts[1];
  const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);

  const decoded = atob(padded);
  return JSON.parse(decoded) as Record<string, unknown>;
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
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

async function verifyRequestAuth(
  req: Request
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, error: 'Missing Bearer token.' };
  }

  const token = authHeader.slice(7);
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const apikey = anonKey ?? serviceRoleKey;

  if (!supabaseUrl || !apikey) {
    return { ok: false, error: 'Auth verification is not configured on Edge environment.' };
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { ok: false, error: 'Invalid or expired JWT.' };
  }

  const payload = (await response.json()) as { id?: string };
  if (!payload?.id) {
    return { ok: false, error: 'Authenticated user payload is missing id.' };
  }

  return { ok: true, userId: payload.id };
}
