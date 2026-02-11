import { useEffect, useMemo, useState } from 'react';

import { MockSessionLobbyAdapter } from '@/src/adapters/supabase/mock-session-lobby.adapter';
import {
  getSupabaseCredentialDiagnostics,
  hasSupabaseCredentials,
} from '@/src/adapters/supabase/client';
import { SupabaseSessionLobbyAdapter } from '@/src/adapters/supabase/supabase-session-lobby.adapter';
import { LocalHostProfileCacheAdapter } from '@/src/adapters/storage/local-host-profile-cache.adapter';
import { CreateSessionLobbyUseCase } from '@/src/application/usecases/create-session-lobby.usecase';
import { LoadHostProfileUseCase } from '@/src/application/usecases/load-host-profile.usecase';
import { SaveHostProfileUseCase } from '@/src/application/usecases/save-host-profile.usecase';
import type { Observer } from '@/src/domain/analysis/entities';

export type SessionLobbyBackendMode = 'supabase' | 'mock' | 'missing_env';

const useMockBackend = process.env.EXPO_PUBLIC_USE_MOCK_BACKEND === '1';

export function useSessionLobbyData() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [observers, setObservers] = useState<Observer[]>([]);

  const diagnostics = useMemo(() => getSupabaseCredentialDiagnostics(), []);
  const hasSupabase = hasSupabaseCredentials();
  const missingKeysLabel = useMemo(() => diagnostics.missingKeys.join(', '), [diagnostics]);

  const backendMode: SessionLobbyBackendMode = useMemo(() => {
    if (useMockBackend) {
      return 'mock';
    }

    return hasSupabase ? 'supabase' : 'missing_env';
  }, [hasSupabase]);

  const hostProfileCacheAdapter = useMemo(() => new LocalHostProfileCacheAdapter(), []);

  const loadHostProfileUseCase = useMemo(
    () => new LoadHostProfileUseCase(hostProfileCacheAdapter),
    [hostProfileCacheAdapter]
  );
  const saveHostProfileUseCase = useMemo(
    () => new SaveHostProfileUseCase(hostProfileCacheAdapter),
    [hostProfileCacheAdapter]
  );

  const sessionLobbyAdapter = useMemo(() => {
    if (backendMode === 'supabase') {
      return new SupabaseSessionLobbyAdapter();
    }

    return new MockSessionLobbyAdapter();
  }, [backendMode]);

  const createSessionLobbyUseCase = useMemo(
    () => new CreateSessionLobbyUseCase(sessionLobbyAdapter),
    [sessionLobbyAdapter]
  );

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    async function setupSessionLobby() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const hostProfile = await loadHostProfileUseCase.execute();

        const hostDisplayName = hostProfile?.displayName || 'ホスト (あなた)';
        const hostAvatarPresetId = hostProfile?.avatarPresetId || 'forest';

        const createdSession = await createSessionLobbyUseCase.execute({
          hostObserverId: hostProfile?.observerId,
          hostDisplayName,
          hostAvatarPresetId,
        });

        if (!isMounted) {
          return;
        }

        setSessionCode(createdSession.sessionCode);
        setJoinPassword(createdSession.joinPassword);
        setQrPayload(createdSession.qrPayload);

        await saveHostProfileUseCase.execute({
          observerId: createdSession.hostObserverId,
          displayName: hostDisplayName,
          avatarPresetId: hostAvatarPresetId,
        });

        const initialObservers = await sessionLobbyAdapter.getObservers(createdSession.sessionCode);

        if (!isMounted) {
          return;
        }

        setObservers(initialObservers);

        unsubscribe = sessionLobbyAdapter.subscribeObservers(
          createdSession.sessionCode,
          (nextObservers) => {
            if (!isMounted) {
              return;
            }

            setObservers(nextObservers);
          },
          (error) => {
            if (!isMounted) {
              return;
            }

            setErrorMessage(error.message);
          }
        );

        pollTimer = setInterval(async () => {
          try {
            const nextObservers = await sessionLobbyAdapter.getObservers(createdSession.sessionCode);

            if (!isMounted) {
              return;
            }

            setObservers(nextObservers);
          } catch {
            // Realtime購読を主系統とし、ポーリング失敗時は静かに継続する
          }
        }, 3000);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const fallbackMessage =
          backendMode === 'missing_env'
            ? `Supabase環境変数が未設定です: ${missingKeysLabel}`
            : 'セッションロビーの作成に失敗しました。';

        setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    setupSessionLobby();

    return () => {
      isMounted = false;

      if (unsubscribe) {
        unsubscribe();
      }

      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [
    backendMode,
    createSessionLobbyUseCase,
    loadHostProfileUseCase,
    missingKeysLabel,
    saveHostProfileUseCase,
    sessionLobbyAdapter,
  ]);

  const activeObserverCount = observers.filter((observer) => observer.isActive).length;

  return {
    activeObserverCount,
    backendMode,
    errorMessage,
    isLoading,
    joinPassword,
    observers,
    qrPayload,
    sessionCode,
    supabaseDiagnostics: diagnostics,
  };
}
