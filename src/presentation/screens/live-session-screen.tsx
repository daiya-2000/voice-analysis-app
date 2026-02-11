import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { WaveBars } from '@/src/presentation/components/wave-bars';
import { useVoiceAnalysisUiData } from '@/src/presentation/hooks/use-voice-analysis-ui-data';
import { palette } from '@/src/presentation/theme/palette';

const LIVE_WAVE_BARS = [16, 28, 48, 72, 96, 68, 88, 58, 72, 34, 20];

export function LiveSessionScreen() {
  const router = useRouter();
  const { liveSession } = useVoiceAnalysisUiData();

  return (
    <AppScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.roundIcon} onPress={() => router.back()}>
          <MaterialIcons name="close" size={20} color={palette.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>Live Analysis</Text>
          <View style={styles.headerStatusRow}>
            <View style={styles.headerPulse} />
            <Text style={styles.headerTitle}>録音セッション中</Text>
          </View>
        </View>

        <Pressable style={styles.roundIcon}>
          <MaterialIcons name="more-horiz" size={22} color={palette.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.engagementChip}>
        <MaterialIcons name="auto-awesome" size={16} color={palette.primary} />
        <Text style={styles.engagementText}>{liveSession.engagementEstimate}</Text>
      </View>

      <View style={styles.liveWaveArea}>
        <WaveBars heights={LIVE_WAVE_BARS} activeFrom={2} barWidth={6} />
      </View>

      <View style={styles.elapsedArea}>
        <Text style={styles.elapsedTime}>{liveSession.elapsedTimeLabel}</Text>
        <Text style={styles.elapsedCaption}>会話の流れを分析中...</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>トーン</Text>
          <Text style={styles.metricValue}>{liveSession.toneEstimate}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ペース</Text>
          <Text style={styles.metricValue}>{liveSession.paceEstimate}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <ActionIcon label="ミュート" iconName="mic-off" />
        <ActionIcon label="タグ付け" iconName="bookmark-border" />
        <ActionIcon
          label="データ表示"
          iconName="equalizer"
          onPress={() => router.push('/insights')}
          isPrimary
        />
      </View>

      <PrimaryButton label="セッションを終了して保存" onPress={() => router.replace('/home')} />
    </AppScreen>
  );
}

interface ActionIconProps {
  iconName: 'mic-off' | 'bookmark-border' | 'equalizer';
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
  liveWaveArea: {
    marginTop: 18,
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
    justifyContent: 'space-around',
    marginTop: 14,
    marginBottom: 10,
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
    letterSpacing: 1,
  },
  actionLabelPrimary: {
    color: palette.primary,
  },
});
