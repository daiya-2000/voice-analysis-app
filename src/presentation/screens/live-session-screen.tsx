import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { WaveBars } from '@/src/presentation/components/wave-bars';
import { useLiveSessionController } from '@/src/presentation/hooks/use-live-session-controller';
import { useVoiceAnalysisUiData } from '@/src/presentation/hooks/use-voice-analysis-ui-data';
import { palette } from '@/src/presentation/theme/palette';

const LIVE_WAVE_BARS = [16, 28, 48, 72, 96, 68, 88, 58, 72, 34, 20];

function buildLiveWaveBars(currentMeteringDb: number | null, isAnalyzingChunk: boolean): number[] {
  if (isAnalyzingChunk) {
    return LIVE_WAVE_BARS.map((height, index) => Math.max(14, height + ((index % 3) - 1) * 10));
  }

  if (currentMeteringDb === null) {
    return LIVE_WAVE_BARS.map((height) => Math.max(10, Math.round(height * 0.55)));
  }

  const normalized = Math.min(1, Math.max(0, (currentMeteringDb + 65) / 35));

  return LIVE_WAVE_BARS.map((height, index) => {
    const scaled = height * (0.55 + normalized * 0.7);
    const wobble = index % 2 === 0 ? 4 : -3;

    return Math.max(10, Math.round(scaled + wobble));
  });
}

function formatDbValue(value: number | null): string {
  if (value === null) {
    return '取得中';
  }

  return `${value.toFixed(1)} dB`;
}

function formatInputLevel(value: number | null, isMuted = false): string {
  if (isMuted) {
    return '0%';
  }

  if (value === null) {
    return '取得中';
  }

  const normalized = Math.min(1, Math.max(0, (value + 60) / 60));
  return `${Math.round(normalized * 100)}%`;
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return '--';
  }

  return `${Math.round(value * 100)}%`;
}

function formatLastAnalyzedLabel(analyzedAtIso: string | null): string {
  if (!analyzedAtIso) {
    return '未解析';
  }

  const analyzedDate = new Date(analyzedAtIso);
  const timeLabel = analyzedDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${timeLabel}`;
}

export function LiveSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionCode?: string }>();
  const sessionCode = typeof params.sessionCode === 'string' ? params.sessionCode : undefined;

  const { liveSession } = useVoiceAnalysisUiData();
  const {
    analysisMode,
    analysisState,
    analyzedChunkCount,
    currentMeteringDb,
    endSession,
    errorMessage,
    isAnalyzingChunk,
    isMuted,
    lastChunkDiagnostics,
    runtimeView,
    secondsUntilNextAnalysis,
    status,
    toggleMute,
  } = useLiveSessionController({
    baseView: liveSession,
    sessionCode,
  });

  const handleLeaveSession = async () => {
    await endSession();
    router.back();
  };

  const handleFinishSession = async () => {
    await endSession();
    router.replace('/home');
  };

  const liveWaveBars = buildLiveWaveBars(currentMeteringDb, isAnalyzingChunk);

  const nextAnalysisLabel = isMuted
    ? 'ミュート中'
    : isAnalyzingChunk
      ? '解析中...'
      : secondsUntilNextAnalysis === null
        ? '--'
        : `${secondsUntilNextAnalysis}秒`;

  return (
    <AppScreen scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.roundIcon}
          onPress={() => {
            void handleLeaveSession();
          }}>
          <MaterialIcons name="close" size={20} color={palette.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>Live Analysis</Text>
          <View style={styles.headerStatusRow}>
            <View
              style={[
                styles.headerPulse,
                status === 'muted' && styles.headerPulseMuted,
                status === 'error' && styles.headerPulseError,
              ]}
            />
            <Text style={styles.headerTitle}>
              {status === 'starting'
                ? '録音開始中'
                : status === 'muted'
                  ? 'ミュート中'
                  : status === 'error'
                    ? '録音エラー'
                    : '録音セッション中'}
            </Text>
          </View>
        </View>

        <Pressable style={styles.roundIcon}>
          <MaterialIcons name="more-horiz" size={22} color={palette.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.engagementChip}>
        <MaterialIcons name="auto-awesome" size={16} color={palette.primary} />
        <Text style={styles.engagementText}>{analysisState.engagementEstimate}</Text>
      </View>

      <Text style={styles.tendencySummary}>
        {analysisState.tendencySummary}
        {analyzedChunkCount > 0 ? ` (confidence ${analysisState.confidence.toFixed(2)})` : ''}
      </Text>

      <View style={styles.telemetryChipRow}>
        <View style={styles.telemetryChip}>
          <MaterialIcons name="graphic-eq" size={14} color={palette.primary} />
          <Text style={styles.telemetryChipLabel}>
            入力レベル {formatInputLevel(currentMeteringDb, isMuted)}
          </Text>
        </View>

        <View style={styles.telemetryChip}>
          <MaterialIcons name="schedule" size={14} color={palette.primary} />
          <Text style={styles.telemetryChipLabel}>次回解析 {nextAnalysisLabel}</Text>
        </View>
      </View>

      <View style={styles.liveWaveArea}>
        <WaveBars heights={liveWaveBars} activeFrom={2} barWidth={6} />
      </View>

      <View style={styles.elapsedArea}>
        <Text style={styles.elapsedTime}>{runtimeView.elapsedTimeLabel}</Text>
        <Text style={styles.elapsedCaption}>
          {runtimeView.isWarmup ? 'トーンとペースを分析中...' : '会話の流れを分析中...'}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>トーン</Text>
          <Text style={styles.metricValue}>{runtimeView.toneEstimate}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ペース</Text>
          <Text style={styles.metricValue}>{runtimeView.paceEstimate}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <ActionIcon
          label={isMuted ? 'ミュート解除' : 'ミュート'}
          iconName={isMuted ? 'mic' : 'mic-off'}
          onPress={() => {
            void toggleMute();
          }}
        />
        <ActionIcon
          label="データ表示"
          iconName="equalizer"
          onPress={() => router.push('/insights')}
          isPrimary
        />
      </View>

      <View style={styles.diagnosticsCard}>
        <Text style={styles.diagnosticsTitle}>直近チャンク診断</Text>
        <View style={styles.diagnosticsRow}>
          <Text style={styles.diagnosticsLabel}>解析時刻</Text>
          <Text style={styles.diagnosticsValue}>
            {formatLastAnalyzedLabel(lastChunkDiagnostics.analyzedAtIso)}
          </Text>
        </View>
        <View style={styles.diagnosticsRow}>
          <Text style={styles.diagnosticsLabel}>無音比</Text>
          <Text style={styles.diagnosticsValue}>{formatPercent(lastChunkDiagnostics.silenceRatio)}</Text>
        </View>
        <View style={styles.diagnosticsRow}>
          <Text style={styles.diagnosticsLabel}>平均入力</Text>
          <Text style={styles.diagnosticsValue}>
            {lastChunkDiagnostics.averageMeteringDb === null
              ? '--'
              : `${formatInputLevel(lastChunkDiagnostics.averageMeteringDb)} (${formatDbValue(
                  lastChunkDiagnostics.averageMeteringDb
                )})`}
          </Text>
        </View>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Text style={styles.backendHint}>
        {analysisMode === 'supabase'
          ? `Supabaseライブ解析: ${analyzedChunkCount}回`
          : analysisMode === 'mock_fallback'
            ? `JWT未認証のためモック解析に切替中 (${analyzedChunkCount}回)`
            : `モック解析で表示を更新中 (${analyzedChunkCount}回)`}
      </Text>
      <Text style={styles.speakerScopeHint}>
        現在は会話全体の傾向を推定中（Detected Speakerごとの分離解析は未対応）
      </Text>

      <PrimaryButton
        label="セッションを終了して保存"
        onPress={() => {
          void handleFinishSession();
        }}
      />
    </AppScreen>
  );
}

interface ActionIconProps {
  iconName: 'mic' | 'mic-off' | 'equalizer';
  label: string;
  onPress?: () => void;
  isPrimary?: boolean;
}

function ActionIcon({ iconName, label, onPress, isPrimary = false }: ActionIconProps) {
  return (
    <Pressable onPress={onPress} style={styles.actionRoot}>
      <View style={[styles.actionIconCircle, isPrimary && styles.actionIconCirclePrimary]}>
        <MaterialIcons
          name={iconName}
          size={20}
          color={isPrimary ? palette.primary : palette.textSecondary}
        />
      </View>
      <Text style={[styles.actionLabel, isPrimary && styles.actionLabelPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerEyebrow: {
    color: 'rgba(43, 238, 108, 0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  headerPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
  headerPulseMuted: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerPulseError: {
    backgroundColor: '#ff7676',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  engagementChip: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.24)',
    backgroundColor: 'rgba(43, 238, 108, 0.1)',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  engagementText: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  tendencySummary: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  telemetryChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  telemetryChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.16)',
    backgroundColor: 'rgba(43, 238, 108, 0.08)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  telemetryChipLabel: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  liveWaveArea: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  elapsedArea: {
    alignItems: 'center',
    marginTop: 8,
  },
  elapsedTime: {
    color: palette.textPrimary,
    fontSize: 52,
    fontWeight: '300',
    letterSpacing: 1,
  },
  elapsedCaption: {
    color: palette.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    gap: 4,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginTop: 14,
    marginBottom: 8,
  },
  actionRoot: {
    alignItems: 'center',
    gap: 5,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCirclePrimary: {
    borderColor: 'rgba(43, 238, 108, 0.3)',
    backgroundColor: 'rgba(43, 238, 108, 0.1)',
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '700',
  },
  actionLabelPrimary: {
    color: palette.primary,
  },
  diagnosticsCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    gap: 6,
  },
  diagnosticsTitle: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  diagnosticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diagnosticsLabel: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 11,
  },
  diagnosticsValue: {
    color: palette.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff9b9b',
    fontSize: 11,
    textAlign: 'center',
  },
  backendHint: {
    color: 'rgba(43, 238, 108, 0.72)',
    fontSize: 11,
    textAlign: 'center',
  },
  speakerScopeHint: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
});
