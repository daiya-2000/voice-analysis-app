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
import { StartVoiceRecordingUseCase } from '@/src/application/usecases/start-voice-recording.usecase';
import type { AvatarPreset } from '@/src/domain/profile/avatar-preset';
import type { ObserverRoleType, VoiceEnrollmentResult } from '@/src/domain/voice/voice-enrollment';

export type RecordingState = 'idle' | 'recording' | 'submitting' | 'success' | 'error';
export type BackendMode = 'supabase' | 'mock' | 'missing_env';

interface UseProfileSetupOptions {
  observerRole: ObserverRoleType;
  sessionCode?: string;
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
      const result = await completeVoiceEnrollmentUseCase.execute({
        displayName: displayName.trim() || (options.observerRole === 'host' ? 'Host User' : 'Observer User'),
        avatarPresetId: selectedAvatarPreset?.id ?? 'forest',
        observerRole: options.observerRole,
        script: currentPrompt,
        sessionCode: options.sessionCode,
      });

      setEnrollmentResult(result);
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
    displayName,
    options.observerRole,
    options.sessionCode,
    recordingState,
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
    recordingState,
    selectedAvatarId,
    selectedAvatarPreset,
    setAvatarPreset,
    setDisplayName,
    supabaseDiagnostics: diagnostics,
    toggleRecording,
    chooseNextPrompt,
  };
}
