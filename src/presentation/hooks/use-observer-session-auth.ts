import { useCallback, useMemo, useState } from 'react';

import { MockSessionLobbyAdapter } from '@/src/adapters/supabase/mock-session-lobby.adapter';
import {
  getSupabaseCredentialDiagnostics,
  hasSupabaseCredentials,
} from '@/src/adapters/supabase/client';
import { SupabaseSessionLobbyAdapter } from '@/src/adapters/supabase/supabase-session-lobby.adapter';
import { VerifySessionJoinPasswordUseCase } from '@/src/application/usecases/verify-session-join-password.usecase';
import {
  isValidSessionCode,
  normalizeSessionCode,
  normalizeSessionJoinPassword,
} from '@/src/domain/session/session-access';

const useMockBackend = process.env.EXPO_PUBLIC_USE_MOCK_BACKEND === '1';

export type SessionAuthBackendMode = 'supabase' | 'mock' | 'missing_env';

interface UseObserverSessionAuthOptions {
  sessionCode: string;
  onVerified: (joinPassword: string) => void;
}

export function useObserverSessionAuth(options: UseObserverSessionAuthOptions) {
  const { onVerified, sessionCode } = options;
  const [joinPassword, setJoinPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const diagnostics = getSupabaseCredentialDiagnostics();
  const hasSupabase = hasSupabaseCredentials();

  const backendMode: SessionAuthBackendMode = useMemo(() => {
    if (useMockBackend) {
      return 'mock';
    }

    return hasSupabase ? 'supabase' : 'missing_env';
  }, [hasSupabase]);

  const normalizedSessionCode = useMemo(() => normalizeSessionCode(sessionCode), [sessionCode]);
  const isSessionCodeValid = useMemo(
    () => isValidSessionCode(normalizedSessionCode),
    [normalizedSessionCode]
  );

  const sessionLobbyAdapter = useMemo(() => {
    if (backendMode === 'supabase') {
      return new SupabaseSessionLobbyAdapter();
    }

    return new MockSessionLobbyAdapter();
  }, [backendMode]);

  const verifySessionJoinPasswordUseCase = useMemo(
    () => new VerifySessionJoinPasswordUseCase(sessionLobbyAdapter),
    [sessionLobbyAdapter]
  );

  const updateJoinPassword = useCallback((value: string) => {
    setJoinPassword(value.toUpperCase());
  }, []);

  const verifyJoinPassword = useCallback(async () => {
    if (!isSessionCodeValid) {
      setErrorMessage('セッションコードが不正です。QRコードを読み取り直してください。');
      return;
    }

    if (backendMode === 'missing_env') {
      setErrorMessage(`Supabase環境変数が未設定です: ${diagnostics.missingKeys.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await verifySessionJoinPasswordUseCase.execute({
        sessionCode: normalizedSessionCode,
        joinPassword,
      });

      onVerified(normalizeSessionJoinPassword(joinPassword));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'パスワード検証に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    backendMode,
    diagnostics.missingKeys,
    isSessionCodeValid,
    joinPassword,
    normalizedSessionCode,
    onVerified,
    verifySessionJoinPasswordUseCase,
  ]);

  return {
    backendMode,
    errorMessage,
    isSessionCodeValid,
    isSubmitting,
    joinPassword,
    normalizedSessionCode,
    setJoinPassword: updateJoinPassword,
    verifyJoinPassword,
  };
}
