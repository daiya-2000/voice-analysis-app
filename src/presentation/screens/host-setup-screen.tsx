import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AvatarPresetPicker } from '@/src/presentation/components/avatar-preset-picker';
import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { VoiceEnrollmentCard } from '@/src/presentation/components/voice-enrollment-card';
import { useProfileSetup } from '@/src/presentation/hooks/use-profile-setup';
import { palette } from '@/src/presentation/theme/palette';

export function HostSetupScreen() {
  const router = useRouter();

  const {
    avatarPresets,
    backendMode,
    chooseNextPrompt,
    currentPrompt,
    displayName,
    enrollmentResult,
    errorMessage,
    recordingState,
    selectedAvatarId,
    setAvatarPreset,
    setDisplayName,
    supabaseDiagnostics,
    toggleRecording,
  } = useProfileSetup({ observerRole: 'host' });

  const statusMessage = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    }

    if (!enrollmentResult) {
      return undefined;
    }

    return `登録結果: ${enrollmentResult.tendencySummary} (confidence ${enrollmentResult.confidence.toFixed(2)})`;
  }, [enrollmentResult, errorMessage]);

  return (
    <AppScreen scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ホストプロフィール登録</Text>
        <Text style={styles.subtitle}>分析開始前に表示名と音声サンプルを設定します</Text>
      </View>

      <AvatarPresetPicker
        presets={avatarPresets}
        selectedPresetId={selectedAvatarId}
        onSelect={setAvatarPreset}
      />

      <View style={styles.block}>
        <Text style={styles.blockLabel}>表示名</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="例: 田中 太郎"
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          style={styles.input}
        />
        <Text style={styles.note}>この名前はObserver側の画面に表示されます。</Text>
      </View>

      <View style={styles.blockHeaderRow}>
        <Text style={styles.blockLabel}>音声登録</Text>
        <Text style={styles.tip}>話者識別の推定精度向上</Text>
      </View>

      <VoiceEnrollmentCard
        scriptText={currentPrompt.text}
        scriptObjective={currentPrompt.objective}
        recordingState={recordingState}
        backendMode={backendMode}
        missingEnvKeys={supabaseDiagnostics.missingKeys}
        statusMessage={statusMessage}
        onChangeScript={chooseNextPrompt}
        onToggleRecording={toggleRecording}
      />

      <View style={styles.policyCard}>
        <MaterialIcons name="verified-user" size={18} color={palette.primary} />
        <Text style={styles.policyText}>
          音声サンプルは話者識別の推定精度向上にのみ使用します。会話内容を断定評価する目的では利用しません。
        </Text>
      </View>

      <PrimaryButton label="設定を完了して開始" onPress={() => router.replace('/home')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 36,
  },
  header: {
    marginTop: 8,
    gap: 6,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '300',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  block: {
    gap: 8,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockLabel: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 14,
    color: palette.textPrimary,
    fontSize: 16,
  },
  note: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
  },
  tip: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  policyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.22)',
    backgroundColor: 'rgba(43, 238, 108, 0.08)',
    padding: 14,
    gap: 8,
    flexDirection: 'row',
  },
  policyText: {
    flex: 1,
    color: palette.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
