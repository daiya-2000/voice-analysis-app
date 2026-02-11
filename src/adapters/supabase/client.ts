import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let singletonClient: SupabaseClient | null = null;

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
