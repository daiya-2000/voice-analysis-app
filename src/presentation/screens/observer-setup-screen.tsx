import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AvatarPresetPicker } from '@/src/presentation/components/avatar-preset-picker';
import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { VoiceEnrollmentCard } from '@/src/presentation/components/voice-enrollment-card';
import { useProfileSetup } from '@/src/presentation/hooks/use-profile-setup';
import { palette } from '@/src/presentation/theme/palette';

export function ObserverSetupScreen() {
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
  } = useProfileSetup({ observerRole: 'observer', initialDisplayName: 'Guest User' });

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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={18} color={palette.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>閲覧者プロフィール設定</Text>
      </View>

      <AvatarPresetPicker
        presets={avatarPresets}
        selectedPresetId={selectedAvatarId}
        onSelect={setAvatarPreset}
      />

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>ユーザー名</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="名前を入力してください"
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          style={styles.input}
        />
      </View>

      <View style={styles.voiceHeader}>
        <Text style={styles.fieldLabel}>音声登録</Text>
        <Text style={styles.recommendBadge}>推奨</Text>
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

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={18} color={palette.primary} />
        <View style={styles.infoTexts}>
          <Text style={styles.infoTitle}>閲覧モード（Observer）</Text>
          <Text style={styles.infoDescription}>
            あなたは閲覧者として参加します。Detected Speakerの推定結果を閲覧しますが、順位付けや断定的評価は表示しません。
          </Text>
        </View>
      </View>

      <PrimaryButton label="プロフィールを登録して参加" onPress={() => router.replace('/insights')} />
      <Text style={styles.footerText}>
        「参加する」をタップすると、利用規約およびプライバシーポリシーへの同意として扱われます。
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 30,
  },
  header: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 19,
    fontWeight: '700',
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    color: palette.textPrimary,
    fontSize: 16,
    backgroundColor: palette.surface,
  },
  voiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendBadge: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(43, 238, 108, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.26)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 99,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.22)',
    backgroundColor: 'rgba(43, 238, 108, 0.08)',
    padding: 12,
  },
  infoTexts: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  infoDescription: {
    color: palette.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.38)',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
