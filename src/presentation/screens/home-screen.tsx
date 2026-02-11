import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { palette } from '@/src/presentation/theme/palette';

export function HomeScreen() {
  const router = useRouter();

  return (
    <AppScreen contentContainerStyle={styles.container}>
      <View style={styles.topButtons}>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="history" size={22} color={palette.primary} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="settings" size={22} color={palette.primary} />
        </Pressable>
      </View>

      <View style={styles.branding}>
        <View style={styles.brandIcon}>
          <MaterialIcons name="insights" size={34} color={palette.background} />
        </View>
        <Text style={styles.brandTitle}>SENTIENT</Text>
        <Text style={styles.brandSubtitle}>リアルタイム・ソーシャル・インテリジェンス</Text>
      </View>

      <View style={styles.centerArea}>
        <View style={styles.rippleLarge} />
        <View style={styles.rippleSmall} />
        <Pressable style={styles.startButton} onPress={() => router.push('/session-lobby')}>
          <MaterialIcons name="mic" size={62} color={palette.background} />
          <Text style={styles.startButtonLabel}>開始</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.qrButton} onPress={() => router.push('/observer-setup')}>
          <MaterialIcons name="qr-code-scanner" size={22} color={palette.primary} />
          <Text style={styles.qrButtonLabel}>QRコードで参加</Text>
        </Pressable>

        <View style={styles.readyRow}>
          <View style={styles.readyDot} />
          <Text style={styles.readyText}>Ready to Analyze</Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  topButtons: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branding: {
    alignItems: 'center',
    marginTop: 24,
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    color: palette.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandSubtitle: {
    color: 'rgba(43, 238, 108, 0.72)',
    fontSize: 11,
    marginTop: 6,
    letterSpacing: 2,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.17)',
  },
  rippleSmall: {
    position: 'absolute',
    width: 248,
    height: 248,
    borderRadius: 124,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.26)',
  },
  startButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  startButtonLabel: {
    color: palette.background,
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    gap: 20,
  },
  qrButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 42, 28, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  qrButtonLabel: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.primary,
  },
  readyText: {
    color: 'rgba(43, 238, 108, 0.42)',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
