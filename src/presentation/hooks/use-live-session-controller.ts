import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HuggingFaceLiveAnalysisViaEdgeAdapter } from '@/src/adapters/ai/huggingface-live-analysis-via-edge.adapter';
import { MockLiveAudioAnalysisAdapter } from '@/src/adapters/ai/mock-live-audio-analysis.adapter';
import { ExpoVoiceRecorderAdapter } from '@/src/adapters/audio/expo-voice-recorder.adapter';
import {
  getSupabaseCredentialDiagnostics,
  hasSupabaseCredentials,
} from '@/src/adapters/supabase/client';
import { AnalyzeLiveAudioSampleUseCase } from '@/src/application/usecases/analyze-live-audio-sample.usecase';
import { GetLiveSessionRuntimeViewUseCase } from '@/src/application/usecases/get-live-session-runtime-view.usecase';
import type { LiveSessionView } from '@/src/application/usecases/get-live-session-view.usecase';
import { SetRecordingMutedUseCase } from '@/src/application/usecases/set-recording-muted.usecase';
import { StartVoiceRecordingUseCase } from '@/src/application/usecases/start-voice-recording.usecase';
import { StopVoiceRecordingUseCase } from '@/src/application/usecases/stop-voice-recording.usecase';

const LIVE_ANALYSIS_CHUNK_MS = 20 * 1000;
const useMockBackend = process.env.EXPO_PUBLIC_USE_MOCK_BACKEND === '1';

export type LiveRecordingStatus = 'starting' | 'recording' | 'muted' | 'error' | 'stopped';
export type LiveAnalysisBackendMode = 'supabase' | 'mock' | 'missing_env';
export type LiveAnalysisMode = 'supabase' | 'mock' | 'mock_fallback';

interface LiveAnalysisState {
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  tendencySummary: string;
  confidence: number;
}

export interface LiveChunkDiagnostics {
  averageMeteringDb: number | null;
  silenceRatio: number | null;
  transcriptLength: number | null;
  analyzedAtIso: string | null;
  provider: 'huggingface-edge' | 'mock' | null;
}

interface UseLiveSessionControllerOptions {
  baseView: LiveSessionView;
  sessionCode?: string;
}

function isInvalidJwtError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /invalid jwt/i.test(error.message);
}

export function useLiveSessionController(options: UseLiveSessionControllerOptions) {
  const { baseView, sessionCode } = options;

  const [elapsedMs, setElapsedMs] = useState(0);
  const [status, setStatus] = useState<LiveRecordingStatus>('starting');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJwtFallbackActive, setIsJwtFallbackActive] = useState(false);
  const [analyzedChunkCount, setAnalyzedChunkCount] = useState(0);
  const [isAnalyzingChunk, setIsAnalyzingChunk] = useState(false);
  const [secondsUntilNextAnalysis, setSecondsUntilNextAnalysis] = useState<number | null>(
    Math.ceil(LIVE_ANALYSIS_CHUNK_MS / 1000)
  );
  const [currentMeteringDb, setCurrentMeteringDb] = useState<number | null>(null);
  const [lastChunkDiagnostics, setLastChunkDiagnostics] = useState<LiveChunkDiagnostics>({
    averageMeteringDb: null,
    silenceRatio: null,
    transcriptLength: null,
    analyzedAtIso: null,
    provider: null,
  });
  const [analysisState, setAnalysisState] = useState<LiveAnalysisState>({
    engagementEstimate: '分析中...',
    toneEstimate: baseView.toneEstimate,
    paceEstimate: baseView.paceEstimate,
    tendencySummary: '分析中...',
    confidence: 0,
  });

  const startedAtRef = useRef<number | null>(null);
  const chunkWindowStartedAtRef = useRef<number | null>(null);
  const isRecordingActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const isAnalyzingChunkRef = useRef(false);

  const diagnostics = useMemo(() => getSupabaseCredentialDiagnostics(), []);
  const hasSupabase = hasSupabaseCredentials();

  const backendMode: LiveAnalysisBackendMode = useMemo(() => {
    if (useMockBackend) {
      return 'mock';
    }

    return hasSupabase ? 'supabase' : 'missing_env';
  }, [hasSupabase]);

  const recorderAdapter = useMemo(() => new ExpoVoiceRecorderAdapter(), []);
  const startVoiceRecordingUseCase = useMemo(
    () => new StartVoiceRecordingUseCase(recorderAdapter),
    [recorderAdapter]
  );
  const stopVoiceRecordingUseCase = useMemo(
    () => new StopVoiceRecordingUseCase(recorderAdapter),
    [recorderAdapter]
  );
  const setRecordingMutedUseCase = useMemo(
    () => new SetRecordingMutedUseCase(recorderAdapter),
    [recorderAdapter]
  );

  const analyzeWithSupabaseUseCase = useMemo(
    () => new AnalyzeLiveAudioSampleUseCase(new HuggingFaceLiveAnalysisViaEdgeAdapter()),
    []
  );
  const analyzeWithMockUseCase = useMemo(
    () => new AnalyzeLiveAudioSampleUseCase(new MockLiveAudioAnalysisAdapter()),
    []
  );

  const getLiveSessionRuntimeViewUseCase = useMemo(() => new GetLiveSessionRuntimeViewUseCase(), []);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const runtimeView = useMemo(
    () =>
      getLiveSessionRuntimeViewUseCase.execute(
        {
          ...baseView,
          toneEstimate: analysisState.toneEstimate,
          paceEstimate: analysisState.paceEstimate,
        },
        elapsedMs
      ),
    [analysisState.paceEstimate, analysisState.toneEstimate, baseView, elapsedMs, getLiveSessionRuntimeViewUseCase]
  );

  const stopRecordingSafely = useCallback(async () => {
    if (!isRecordingActiveRef.current) {
      return;
    }

    isRecordingActiveRef.current = false;

    try {
      await stopVoiceRecordingUseCase.execute();
    } catch {
      // 終了時は停止失敗でも離脱導線を優先
    } finally {
      setStatus('stopped');
      setIsAnalyzingChunk(false);
      setSecondsUntilNextAnalysis(null);
      setCurrentMeteringDb(null);
    }
  }, [stopVoiceRecordingUseCase]);

  useEffect(() => {
    let isMounted = true;

    async function startSessionRecording() {
      setStatus('starting');
      setErrorMessage(null);

      try {
        await startVoiceRecordingUseCase.execute();

        if (!isMounted) {
          return;
        }

        isRecordingActiveRef.current = true;
        const now = Date.now();
        startedAtRef.current = now;
        chunkWindowStartedAtRef.current = now;
        setSecondsUntilNextAnalysis(Math.ceil(LIVE_ANALYSIS_CHUNK_MS / 1000));
        setStatus('recording');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        isRecordingActiveRef.current = false;
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : '録音開始に失敗しました。');
      }
    }

    void startSessionRecording();

    return () => {
      isMounted = false;
      void stopRecordingSafely();
    };
  }, [startVoiceRecordingUseCase, stopRecordingSafely]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!startedAtRef.current || !isRecordingActiveRef.current) {
        return;
      }

      setElapsedMs(Date.now() - startedAtRef.current);

      if (isMutedRef.current) {
        setSecondsUntilNextAnalysis(null);
        return;
      }

      if (isAnalyzingChunkRef.current) {
        setSecondsUntilNextAnalysis(0);
        return;
      }

      if (!chunkWindowStartedAtRef.current) {
        chunkWindowStartedAtRef.current = Date.now();
      }

      const elapsedChunkMs = Date.now() - chunkWindowStartedAtRef.current;
      const remainingMs = Math.max(0, LIVE_ANALYSIS_CHUNK_MS - elapsedChunkMs);
      setSecondsUntilNextAnalysis(Math.ceil(remainingMs / 1000));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isRecordingActiveRef.current || isMutedRef.current || isAnalyzingChunkRef.current) {
        return;
      }

      setCurrentMeteringDb(recorderAdapter.getCurrentMeteringDb());
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, [recorderAdapter]);

  const analyzeLatestChunk = useCallback(async () => {
    if (!isRecordingActiveRef.current || isAnalyzingChunkRef.current) {
      return;
    }

    isAnalyzingChunkRef.current = true;
    setIsAnalyzingChunk(true);
    let shouldRestartRecording = false;
    let lastErrorMessage: string | null = null;

    try {
      if (isMutedRef.current) {
        const mutedAnalysis = await analyzeWithMockUseCase.execute({
          sessionCode,
          sample: {
            base64Audio: 'AA==',
            mimeType: 'audio/m4a',
            durationMs: LIVE_ANALYSIS_CHUNK_MS,
            averageMeteringDb: -160,
            silenceRatio: 1,
            peakMeteringDb: -120,
            dynamicRangeDb: 0,
          },
        });

        if (!isRecordingActiveRef.current) {
          return;
        }

        setAnalysisState({
          engagementEstimate: mutedAnalysis.engagementEstimate,
          toneEstimate: mutedAnalysis.toneEstimate,
          paceEstimate: mutedAnalysis.paceEstimate,
          tendencySummary: mutedAnalysis.tendencySummary,
          confidence: mutedAnalysis.confidence,
        });
        setLastChunkDiagnostics({
          averageMeteringDb: -160,
          silenceRatio: 1,
          transcriptLength: null,
          analyzedAtIso: mutedAnalysis.analyzedAtIso,
          provider: mutedAnalysis.provider,
        });
        setAnalyzedChunkCount((count) => count + 1);
        setErrorMessage(null);
        setCurrentMeteringDb(-160);
        setStatus('muted');
        return;
      }

      const sample = await stopVoiceRecordingUseCase.execute();
      shouldRestartRecording = true;

      if (!isRecordingActiveRef.current) {
        return;
      }

      if (backendMode === 'missing_env') {
        setErrorMessage(`Supabase環境変数が未設定です: ${diagnostics.missingKeys.join(', ')}`);
      } else {
        let analysis: Awaited<ReturnType<typeof analyzeWithMockUseCase.execute>>;

        if (backendMode === 'mock') {
          analysis = await analyzeWithMockUseCase.execute({
            sessionCode,
            sample,
          });
        } else {
          try {
            analysis = await analyzeWithSupabaseUseCase.execute({
              sessionCode,
              sample,
            });
            setIsJwtFallbackActive(false);
          } catch (analysisError) {
            if (!isInvalidJwtError(analysisError)) {
              throw analysisError;
            }

            setIsJwtFallbackActive(true);
            analysis = await analyzeWithMockUseCase.execute({
              sessionCode,
              sample,
            });
          }
        }

        if (!isRecordingActiveRef.current) {
          return;
        }

        setAnalysisState({
          engagementEstimate: analysis.engagementEstimate,
          toneEstimate: analysis.toneEstimate,
          paceEstimate: analysis.paceEstimate,
          tendencySummary: analysis.tendencySummary,
          confidence: analysis.confidence,
        });
        setLastChunkDiagnostics({
          averageMeteringDb:
            typeof analysis.averageMeteringDb === 'number' ? analysis.averageMeteringDb : null,
          silenceRatio: typeof analysis.silenceRatio === 'number' ? analysis.silenceRatio : null,
          transcriptLength:
            typeof analysis.transcriptLength === 'number' ? analysis.transcriptLength : null,
          analyzedAtIso: analysis.analyzedAtIso,
          provider: analysis.provider,
        });
        setAnalyzedChunkCount((count) => count + 1);
        setErrorMessage(null);
      }
    } catch (error) {
      if (!isRecordingActiveRef.current) {
        return;
      }

      lastErrorMessage = error instanceof Error ? error.message : 'ライブ解析に失敗しました。';
      setStatus('error');
      setErrorMessage(lastErrorMessage);
    } finally {
      if (isRecordingActiveRef.current && shouldRestartRecording) {
        try {
          await startVoiceRecordingUseCase.execute();

          if (isMutedRef.current) {
            await setRecordingMutedUseCase.execute(true);
          }

          chunkWindowStartedAtRef.current = Date.now();
        } catch (restartError) {
          isRecordingActiveRef.current = false;
          const restartMessage =
            restartError instanceof Error ? restartError.message : '録音再開に失敗しました。';
          setStatus('error');
          setErrorMessage(restartMessage);
          setIsAnalyzingChunk(false);
          isAnalyzingChunkRef.current = false;
          return;
        }
      }

      if (isRecordingActiveRef.current) {
        // 解析エラーがあっても録音が継続していれば操作可能状態に戻す
        setStatus(isMutedRef.current ? 'muted' : 'recording');
        if (lastErrorMessage && !shouldRestartRecording) {
          setErrorMessage(lastErrorMessage);
        }
        setSecondsUntilNextAnalysis(isMutedRef.current ? null : Math.ceil(LIVE_ANALYSIS_CHUNK_MS / 1000));
      }

      setCurrentMeteringDb(recorderAdapter.getCurrentMeteringDb());
      setIsAnalyzingChunk(false);
      isAnalyzingChunkRef.current = false;
    }
  }, [
    analyzeWithMockUseCase,
    analyzeWithSupabaseUseCase,
    backendMode,
    diagnostics.missingKeys,
    recorderAdapter,
    sessionCode,
    setRecordingMutedUseCase,
    startVoiceRecordingUseCase,
    stopVoiceRecordingUseCase,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      void analyzeLatestChunk();
    }, LIVE_ANALYSIS_CHUNK_MS);

    return () => {
      clearInterval(timer);
    };
  }, [analyzeLatestChunk]);

  const toggleMute = useCallback(async () => {
    if (!isRecordingActiveRef.current) {
      return;
    }

    const nextMuted = !isMutedRef.current;

    try {
      await setRecordingMutedUseCase.execute(nextMuted);
      setIsMuted(nextMuted);
      setStatus(nextMuted ? 'muted' : 'recording');
      setSecondsUntilNextAnalysis(nextMuted ? null : Math.ceil(LIVE_ANALYSIS_CHUNK_MS / 1000));

      if (!nextMuted) {
        chunkWindowStartedAtRef.current = Date.now();
      }

      setErrorMessage(null);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'ミュート切り替えに失敗しました。');
    }
  }, [setRecordingMutedUseCase]);

  const endSession = useCallback(async () => {
    await stopRecordingSafely();
  }, [stopRecordingSafely]);

  const analysisMode: LiveAnalysisMode = useMemo(() => {
    if (backendMode === 'supabase' && !isJwtFallbackActive) {
      return 'supabase';
    }

    if (backendMode === 'supabase' && isJwtFallbackActive) {
      return 'mock_fallback';
    }

    return 'mock';
  }, [backendMode, isJwtFallbackActive]);

  return {
    analyzedChunkCount,
    analysisMode,
    analysisState,
    backendMode,
    currentMeteringDb,
    errorMessage,
    isAnalyzingChunk,
    isMuted,
    lastChunkDiagnostics,
    runtimeView,
    secondsUntilNextAnalysis,
    status,
    toggleMute,
    endSession,
  };
}
