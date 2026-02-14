import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let singletonClient: SupabaseClient | null = null;
let ensureAuthSessionPromise: Promise<void> | null = null;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export interface SupabaseCredentialDiagnostics {
  hasUrl: boolean;
  hasAnonKey: boolean;
  missingKeys: ('EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY')[];
  urlPreview: string;
}

export function getSupabaseCredentialDiagnostics(): SupabaseCredentialDiagnostics {
  const hasUrl = Boolean(supabaseUrl);
  const hasAnonKey = Boolean(supabaseAnonKey);

  const missingKeys: SupabaseCredentialDiagnostics['missingKeys'] = [];

  if (!hasUrl) {
    missingKeys.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  if (!hasAnonKey) {
    missingKeys.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  return {
    hasUrl,
    hasAnonKey,
    missingKeys,
    urlPreview: supabaseUrl ? `${supabaseUrl.slice(0, 24)}...` : '(missing)',
  };
}

export function hasSupabaseCredentials(): boolean {
  const diagnostics = getSupabaseCredentialDiagnostics();
  return diagnostics.missingKeys.length === 0;
}

export function getSupabaseProjectUrl(): string {
  if (!supabaseUrl) {
    throw new Error('Supabase project URL is missing: EXPO_PUBLIC_SUPABASE_URL');
  }

  return supabaseUrl;
}

export function getSupabasePublishableOrAnonKey(): string {
  if (!supabaseAnonKey) {
    throw new Error('Supabase key is missing: EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  return supabaseAnonKey;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    const diagnostics = getSupabaseCredentialDiagnostics();
    throw new Error(
      `Supabase credentials are missing: ${diagnostics.missingKeys.join(', ')}`
    );
  }

  if (!singletonClient) {
    singletonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return singletonClient;
}

export async function ensureSupabaseAuthSession(): Promise<void> {
  if (ensureAuthSessionPromise) {
    return ensureAuthSessionPromise;
  }

  const supabase = getSupabaseClient();

  ensureAuthSessionPromise = (async () => {
    const { data: currentSessionData, error: currentSessionError } = await supabase.auth.getSession();

    if (currentSessionError) {
      throw new Error(`Failed to check Supabase auth session: ${currentSessionError.message}`);
    }

    if (currentSessionData.session?.access_token) {
      return;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      throw new Error(
        `Failed to create Supabase anonymous session: ${signInError.message}. Enable anonymous sign-ins in Supabase Auth settings.`
      );
    }

    if (!signInData.session?.access_token) {
      throw new Error('Supabase anonymous session is missing access token.');
    }

    // invoke/fetch の Authorization で確実に user JWT を使うため、明示的にセットする。
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });

    if (setSessionError) {
      throw new Error(`Failed to set Supabase auth session: ${setSessionError.message}`);
    }
  })();

  try {
    await ensureAuthSessionPromise;
  } finally {
    ensureAuthSessionPromise = null;
  }
}

export async function getSupabaseAccessToken(): Promise<string> {
  await ensureSupabaseAuthSession();

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Failed to get Supabase access token: ${error.message}`);
  }

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error('Supabase access token is missing after auth session setup.');
  }

  return accessToken;
}

export async function renewSupabaseAuthSession(): Promise<void> {
  const supabase = getSupabaseClient();

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    // 既存セッションが無い場合などは継続
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError) {
    throw new Error(
      `Failed to renew Supabase anonymous session: ${signInError.message}. Enable anonymous sign-ins in Supabase Auth settings.`
    );
  }

  if (!signInData.session?.access_token || !signInData.session.refresh_token) {
    throw new Error('Supabase anonymous session is missing tokens during renewal.');
  }

  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  });

  if (setSessionError) {
    throw new Error(`Failed to set renewed Supabase auth session: ${setSessionError.message}`);
  }
}
