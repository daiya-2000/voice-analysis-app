import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { useSessionLobbyData } from '@/src/presentation/hooks/use-session-lobby-data';
import { palette } from '@/src/presentation/theme/palette';

export function SessionLobbyScreen() {
  const router = useRouter();
  const {
    activeObserverCount,
    backendMode,
    errorMessage,
    isLoading,
    joinPassword,
    observers,
    qrPayload,
    sessionCode,
    supabaseDiagnostics,
  } = useSessionLobbyData();

  return (
    <AppScreen scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={18} color={palette.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>セッションロビー</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="settings" size={20} color={palette.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.qrArea}>
        <View style={styles.qrFrame}>
          {qrPayload ? (
            <QRCode value={qrPayload} size={160} backgroundColor="#FFFFFF" color={palette.background} />
          ) : (
            <ActivityIndicator color={palette.background} />
          )}
        </View>
        <Text style={styles.qrCaption}>QRコードをスキャンして閲覧</Text>
        <View style={styles.codeRow}>
          <Text style={styles.codeLabel}>{sessionCode || '---- ----'}</Text>
          <MaterialIcons name="content-copy" size={16} color={palette.textSecondary} />
        </View>
        <Text style={styles.passwordLabel}>参加パスワード: {joinPassword || '------'}</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>閲覧中のObserver</Text>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>{activeObserverCount}名がアクティブ</Text>
        </View>
      </View>

      <View style={styles.observerList}>
        {observers.map((observer) => (
          <View key={observer.id} style={styles.observerCard}>
            <View style={styles.observerAvatar}>
              <Text style={styles.observerAvatarLabel}>{observer.avatarLabel}</Text>
            </View>

            <View style={styles.observerInfo}>
              <Text style={styles.observerName}>{observer.displayName}</Text>
              <Text style={styles.observerRole}>
                {observer.role === 'host' ? 'セッション管理者' : 'Observer'}
              </Text>
            </View>

            <MaterialIcons
              name={observer.isActive ? 'visibility' : 'visibility-off'}
              size={19}
              color={observer.isActive ? palette.primary : palette.textSecondary}
            />
          </View>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={palette.primary} />
          <Text style={styles.loadingLabel}>セッションを初期化しています...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Text style={styles.backendHint}>
        {backendMode === 'supabase'
          ? 'Supabase Realtimeで参加者を同期中'
          : `モック表示 (${supabaseDiagnostics.missingKeys.join(', ') || 'local'})`}
      </Text>

      <View style={styles.infoBlock}>
        <MaterialIcons name="info" size={18} color={palette.primary} />
        <Text style={styles.infoText}>
          セッション開始後、Detected Speakerごとの感情傾向と反応傾向をリアルタイムでObserverへ共有します。
        </Text>
      </View>

      <PrimaryButton label="分析セッションを開始" onPress={() => router.push('/live-session')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 34,
  },
  header: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  qrArea: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCaption: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  codeLabel: {
    color: palette.primary,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },
  passwordLabel: {
    color: palette.textSecondary,
    fontSize: 11,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  listTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.2)',
    backgroundColor: 'rgba(43, 238, 108, 0.1)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.primary,
  },
  activeText: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  observerList: {
    gap: 10,
  },
  observerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surface,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  observerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  observerAvatarLabel: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  observerInfo: {
    flex: 1,
    gap: 2,
  },
  observerName: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  observerRole: {
    color: palette.textSecondary,
    fontSize: 11,
  },
  infoBlock: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.2)',
    backgroundColor: 'rgba(43, 238, 108, 0.08)',
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  infoText: {
    flex: 1,
    color: palette.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingLabel: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  errorText: {
    color: '#FF9D9D',
    fontSize: 12,
    lineHeight: 18,
  },
  backendHint: {
    color: 'rgba(43, 238, 108, 0.6)',
    fontSize: 10,
    textAlign: 'center',
  },
});
