import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { useObserverSessionAuth } from '@/src/presentation/hooks/use-observer-session-auth';
import { palette } from '@/src/presentation/theme/palette';

export function ObserverSessionAuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionCode?: string }>();

  const sessionCode = typeof params.sessionCode === 'string' ? params.sessionCode : '';

  const {
    errorMessage,
    isSessionCodeValid,
    isSubmitting,
    joinPassword,
    normalizedSessionCode,
    setJoinPassword,
    verifyJoinPassword,
  } = useObserverSessionAuth({
    sessionCode,
    onVerified: (verifiedPassword) => {
      router.replace({
        pathname: '/observer-setup',
        params: {
          sessionCode: normalizedSessionCode,
          joinPassword: verifiedPassword,
        },
      });
    },
  });

  return (
    <AppScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={18} color={palette.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>参加パスワード確認</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>参加セッションコード</Text>
        <Text style={styles.sessionCode}>{normalizedSessionCode || '---- ----'}</Text>
        <Text style={styles.cardDescription}>
          QRで取得したセッションコードに対応する参加パスワードを入力してください。
        </Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>参加パスワード</Text>
        <TextInput
          value={joinPassword}
          onChangeText={setJoinPassword}
          placeholder="例: A1B2C3"
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          style={styles.input}
        />
      </View>

      {!isSessionCodeValid ? (
        <Text style={styles.errorText}>セッションコードが無効です。ホームに戻ってQRを再読み取りしてください。</Text>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <PrimaryButton
        label={isSubmitting ? '確認中...' : 'パスワードを確認して進む'}
        onPress={() => {
          void verifyJoinPassword();
        }}
        disabled={isSubmitting || !isSessionCodeValid}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingBottom: 30,
  },
  header: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 8,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sessionCode: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cardDescription: {
    color: palette.textSecondary,
    fontSize: 12,
    lineHeight: 18,
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
    fontSize: 22,
    letterSpacing: 3,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: palette.surface,
  },
  errorText: {
    color: '#FFB4B4',
    fontSize: 12,
    lineHeight: 18,
  },
});
