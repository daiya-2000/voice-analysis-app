import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BackendMode, RecordingState } from '@/src/presentation/hooks/use-profile-setup';
import { WaveBars } from '@/src/presentation/components/wave-bars';
import { palette } from '@/src/presentation/theme/palette';

interface VoiceEnrollmentCardProps {
  scriptText: string;
  scriptObjective: string;
  recordingState: RecordingState;
  backendMode: BackendMode;
  missingEnvKeys?: string[];
  statusMessage?: string;
  onChangeScript: () => void;
  onToggleRecording: () => void;
}

const WAVE_HEIGHTS = [8, 14, 24, 34, 28, 38, 30, 20, 16, 28, 34, 24, 18];

function getRecordingCaption(recordingState: RecordingState): string {
  switch (recordingState) {
    case 'recording':
      return '録音中です。上の文をそのまま読み上げてください。';
    case 'submitting':
      return '音声サンプルを送信しています...';
    case 'success':
      return '音声登録が完了しました。必要なら別の文でもう一度登録できます。';
    case 'error':
      return '録音または送信に失敗しました。再試行してください。';
    default:
      return '表示された文言を読み上げて、話者識別用のサンプルを登録します。';
  }
}

function getBackendText(backendMode: BackendMode, missingEnvKeys: string[]): string {
  if (backendMode === 'supabase') {
    return 'Supabase Edge Function経由で推論を実行';
  }

  if (backendMode === 'mock') {
    return 'モックバックエンドを使用中（EXPO_PUBLIC_USE_MOCK_BACKEND=1）';
  }

  return `Supabase未接続: ${missingEnvKeys.join(', ')}`;
}

export function VoiceEnrollmentCard({
  scriptText,
  scriptObjective,
  recordingState,
  backendMode,
  missingEnvKeys = [],
  statusMessage,
  onChangeScript,
  onToggleRecording,
}: VoiceEnrollmentCardProps) {
  const recording = recordingState === 'recording';
  const busy = recordingState === 'submitting';

  return (
    <View style={styles.voiceCard}>
      <Text style={styles.voiceTitle}>読み上げ文</Text>
      <Text style={styles.scriptText}>「{scriptText}」</Text>
      <Text style={styles.scriptObjective}>{scriptObjective}</Text>

      <Pressable style={styles.scriptSwitchButton} onPress={onChangeScript} disabled={busy || recording}>
        <MaterialIcons name="autorenew" size={14} color={palette.primary} />
        <Text style={styles.scriptSwitchLabel}>別の文言に変更</Text>
      </Pressable>

      <WaveBars heights={WAVE_HEIGHTS} activeFrom={recording ? 2 : 6} barWidth={4} />

      <Pressable style={[styles.micOuter, recording && styles.micOuterActive]} onPress={onToggleRecording}>
        <View style={[styles.micInner, recording && styles.micInnerActive]}>
          <MaterialIcons name={recording ? 'stop' : 'mic'} size={30} color={palette.background} />
        </View>
      </Pressable>

      <Text style={styles.statusText}>{getRecordingCaption(recordingState)}</Text>

      {statusMessage ? <Text style={styles.resultText}>{statusMessage}</Text> : null}

      <View style={styles.providerRow}>
        <MaterialIcons
          name={backendMode === 'supabase' ? 'cloud-done' : 'cloud-off'}
          size={14}
          color={backendMode === 'supabase' ? palette.primary : palette.textSecondary}
        />
        <Text style={styles.providerText}>{getBackendText(backendMode, missingEnvKeys)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  voiceCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: 'rgba(18, 42, 28, 0.74)',
    padding: 16,
    gap: 10,
    alignItems: 'center',
  },
  voiceTitle: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  scriptText: {
    color: palette.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  scriptObjective: {
    color: palette.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  scriptSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.25)',
    backgroundColor: 'rgba(43, 238, 108, 0.1)',
  },
  scriptSwitchLabel: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  micOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  micOuterActive: {
    borderColor: palette.primary,
  },
  micInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  micInnerActive: {
    opacity: 1,
  },
  statusText: {
    color: palette.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  resultText: {
    color: palette.primary,
    fontSize: 11,
    textAlign: 'center',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerText: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 10,
  },
});
