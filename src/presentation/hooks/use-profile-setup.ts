import { useCallback, useMemo, useState } from 'react';

import { MockVoiceEnrollmentAdapter } from '@/src/adapters/ai/mock-voice-enrollment.adapter';
import { HuggingFaceViaEdgeAdapter } from '@/src/adapters/ai/huggingface-via-edge.adapter';
import { ExpoVoiceRecorderAdapter } from '@/src/adapters/audio/expo-voice-recorder.adapter';
import {
  getSupabaseCredentialDiagnostics,
  hasSupabaseCredentials,
} from '@/src/adapters/supabase/client';
import { MockProfileRegistrationAdapter } from '@/src/adapters/supabase/mock-profile-registration.adapter';
import { SupabaseProfileRegistrationAdapter } from '@/src/adapters/supabase/supabase-profile-registration.adapter';
import { CompleteVoiceEnrollmentUseCase } from '@/src/application/usecases/complete-voice-enrollment.usecase';
import { GetAvatarPresetsUseCase } from '@/src/application/usecases/get-avatar-presets.usecase';
import { GetVoicePromptsUseCase } from '@/src/application/usecases/get-voice-prompts.usecase';
import { RegisterObserverProfileUseCase } from '@/src/application/usecases/register-observer-profile.usecase';
import { StartVoiceRecordingUseCase } from '@/src/application/usecases/start-voice-recording.usecase';
import type { AvatarPreset } from '@/src/domain/profile/avatar-preset';
import type { ObserverRoleType, VoiceEnrollmentResult } from '@/src/domain/voice/voice-enrollment';

export type RecordingState = 'idle' | 'recording' | 'submitting' | 'success' | 'error';
export type BackendMode = 'supabase' | 'mock' | 'missing_env';

interface UseProfileSetupOptions {
  observerRole: ObserverRoleType;
  sessionCode?: string;
  joinPassword?: string;
  initialDisplayName?: string;
}

const useMockBackend = process.env.EXPO_PUBLIC_USE_MOCK_BACKEND === '1';

export function useProfileSetup(options: UseProfileSetupOptions) {
  const avatarPresets = useMemo(() => new GetAvatarPresetsUseCase().execute(), []);
  const voicePrompts = useMemo(() => new GetVoicePromptsUseCase().execute(), []);

  const [displayName, setDisplayName] = useState(options.initialDisplayName ?? '');
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarPresets[0]?.id ?? '');
  const [promptIndex, setPromptIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrollmentResult, setEnrollmentResult] = useState<VoiceEnrollmentResult | null>(null);
  const [registeredObserverId, setRegisteredObserverId] = useState<string | undefined>(undefined);
  const [isRegisteringProfile, setIsRegisteringProfile] = useState(false);

  const diagnostics = getSupabaseCredentialDiagnostics();
  const hasSupabase = hasSupabaseCredentials();

  const backendMode: BackendMode = useMemo(() => {
    if (useMockBackend) {
      return 'mock';
    }

    return hasSupabase ? 'supabase' : 'missing_env';
  }, [hasSupabase]);

  const recorderAdapter = useMemo(() => new ExpoVoiceRecorderAdapter(), []);

  const profileRegistrationAdapter = useMemo(() => {
    if (backendMode === 'supabase') {
      return new SupabaseProfileRegistrationAdapter();
    }

    return new MockProfileRegistrationAdapter();
  }, [backendMode]);

  const voiceEnrollmentAdapter = useMemo(() => {
    if (backendMode === 'supabase') {
      return new HuggingFaceViaEdgeAdapter();
    }

    return new MockVoiceEnrollmentAdapter();
  }, [backendMode]);

  const startVoiceRecordingUseCase = useMemo(
    () => new StartVoiceRecordingUseCase(recorderAdapter),
    [recorderAdapter]
  );

  const completeVoiceEnrollmentUseCase = useMemo(
    () =>
      new CompleteVoiceEnrollmentUseCase(
        profileRegistrationAdapter,
        recorderAdapter,
        voiceEnrollmentAdapter
      ),
    [profileRegistrationAdapter, recorderAdapter, voiceEnrollmentAdapter]
  );
  const registerObserverProfileUseCase = useMemo(
    () => new RegisterObserverProfileUseCase(profileRegistrationAdapter),
    [profileRegistrationAdapter]
  );

  const selectedAvatarPreset = useMemo(
    () => avatarPresets.find((avatar) => avatar.id === selectedAvatarId) ?? avatarPresets[0],
    [avatarPresets, selectedAvatarId]
  );

  const currentPrompt = voicePrompts[promptIndex] ?? voicePrompts[0];

  const chooseNextPrompt = useCallback(() => {
    setPromptIndex((current) => (current + 1) % voicePrompts.length);
  }, [voicePrompts.length]);

  const setAvatarPreset = useCallback((preset: AvatarPreset) => {
    setSelectedAvatarId(preset.id);
  }, []);

  const resolveDisplayName = useCallback(() => {
    const fallback = options.observerRole === 'host' ? 'Host User' : 'Observer User';
    return displayName.trim() || fallback;
  }, [displayName, options.observerRole]);

  const registerProfile = useCallback(async () => {
    if (registeredObserverId) {
      return registeredObserverId;
    }

    if (backendMode === 'missing_env') {
      const missingEnvMessage = `Supabase環境変数が未設定です: ${diagnostics.missingKeys.join(', ')}`;
      setErrorMessage(missingEnvMessage);
      throw new Error(missingEnvMessage);
    }

    setIsRegisteringProfile(true);
    setErrorMessage(null);

    try {
      const outcome = await registerObserverProfileUseCase.execute({
        displayName: resolveDisplayName(),
        avatarPresetId: selectedAvatarPreset?.id ?? 'forest',
        observerRole: options.observerRole,
        sessionCode: options.sessionCode,
        joinPassword: options.joinPassword,
      });

      setRegisteredObserverId(outcome.observerId);
      return outcome.observerId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'プロフィール登録に失敗しました。';
      setErrorMessage(message);
      throw error;
    } finally {
      setIsRegisteringProfile(false);
    }
  }, [
    backendMode,
    diagnostics.missingKeys,
    options.joinPassword,
    options.observerRole,
    options.sessionCode,
    registerObserverProfileUseCase,
    registeredObserverId,
    resolveDisplayName,
    selectedAvatarPreset,
  ]);

  const toggleRecording = useCallback(async () => {
    if (!currentPrompt || recordingState === 'submitting') {
      return;
    }

    if (backendMode === 'missing_env') {
      setRecordingState('error');
      setErrorMessage(`Supabase環境変数が未設定です: ${diagnostics.missingKeys.join(', ')}`);
      return;
    }

    if (recordingState !== 'recording') {
      setErrorMessage(null);
      setEnrollmentResult(null);

      try {
        await startVoiceRecordingUseCase.execute();
        setRecordingState('recording');
      } catch (error) {
        setRecordingState('error');
        setErrorMessage(error instanceof Error ? error.message : '録音開始に失敗しました。');
      }

      return;
    }

    setRecordingState('submitting');
    setErrorMessage(null);

    try {
      const outcome = await completeVoiceEnrollmentUseCase.execute({
        existingObserverId: registeredObserverId,
        displayName: resolveDisplayName(),
        avatarPresetId: selectedAvatarPreset?.id ?? 'forest',
        observerRole: options.observerRole,
        script: currentPrompt,
        sessionCode: options.sessionCode,
        joinPassword: options.joinPassword,
      });

      setRegisteredObserverId(outcome.observerId);
      setEnrollmentResult(outcome.enrollment);
      setRecordingState('success');
      chooseNextPrompt();
    } catch (error) {
      setRecordingState('error');
      setErrorMessage(error instanceof Error ? error.message : '音声登録に失敗しました。');
    }
  }, [
    backendMode,
    chooseNextPrompt,
    completeVoiceEnrollmentUseCase,
    currentPrompt,
    diagnostics.missingKeys,
    options.observerRole,
    options.joinPassword,
    options.sessionCode,
    recordingState,
    registeredObserverId,
    resolveDisplayName,
    selectedAvatarPreset,
    startVoiceRecordingUseCase,
  ]);

  return {
    avatarPresets,
    backendMode,
    currentPrompt,
    displayName,
    enrollmentResult,
    errorMessage,
    hasSupabase,
    isRegisteringProfile,
    recordingState,
    selectedAvatarId,
    selectedAvatarPreset,
    registeredObserverId,
    setAvatarPreset,
    setDisplayName,
    supabaseDiagnostics: diagnostics,
    toggleRecording,
    chooseNextPrompt,
    registerProfile,
  };
}
