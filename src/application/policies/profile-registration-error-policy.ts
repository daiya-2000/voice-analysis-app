interface SupabaseLikeError {
  code?: string | null;
  message: string;
}

function isMissingObserverProfilesTableError(error: SupabaseLikeError): boolean {
  if (error.code !== 'PGRST205') {
    return false;
  }

  const normalizedMessage = error.message.toLowerCase();
  return (
    normalizedMessage.includes('observer_profiles') ||
    normalizedMessage.includes('schema cache')
  );
}

export function toObserverProfileRegistrationErrorMessage(error: SupabaseLikeError): string {
  if (isMissingObserverProfilesTableError(error)) {
    return [
      'Failed to register observer profile: Supabaseに public.observer_profiles テーブルがありません。',
      'supabase/migrations/20260211093000_create_voice_enrollment_tables.sql を適用してください（例: supabase db push）。',
    ].join(' ');
  }

  return `Failed to register observer profile: ${error.message}`;
}

