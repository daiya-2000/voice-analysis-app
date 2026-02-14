import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/src/presentation/components/app-screen';
import { useVoiceAnalysisUiData } from '@/src/presentation/hooks/use-voice-analysis-ui-data';
import { palette } from '@/src/presentation/theme/palette';

function formatPercent(value: number | null): string {
  if (value === null) {
    return '--';
  }

  return `${Math.round(value * 100)}%`;
}

export function InsightsScreen() {
  const router = useRouter();
  const { insights } = useVoiceAnalysisUiData();

  return (
    <AppScreen scroll contentContainerStyle={styles.container}>
      <View style={styles.liveRow}>
        <View style={styles.liveDot} />
        <Text style={styles.liveLabel}>Analysis Live</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>話者インサイト</Text>
        <Text style={styles.pageSubtitle}>Detected Speakerごとの推定感情と反応傾向</Text>
      </View>

      <View style={styles.cardsArea}>
        {insights.speakerCards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHead}>
              <View style={styles.speakerBadge}>
                <Text style={styles.speakerBadgeText}>{card.label.replace('話者 ', '')}</Text>
              </View>

              <View style={styles.cardHeaderTexts}>
                <Text style={styles.cardTitle}>{card.label}</Text>
                <Text style={styles.cardStatus}>{card.speakingLabel}</Text>
              </View>

              {card.isMainSpeaker ? <Text style={styles.mainTag}>メイン話者</Text> : null}
            </View>

            <View style={styles.affinityBox}>
              <MaterialIcons name="trending-flat" size={16} color={palette.primary} />
              <Text style={styles.affinityText}>
                {card.targetObserverName}（{card.targetObserverRoleLabel}） / 推定スコア{' '}
                {formatPercent(card.affinityScore)} / 信頼度 {formatPercent(card.affinityConfidence)}
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricName}>推定感情</Text>
                <Text style={styles.metricText}>{card.emotionEstimate}</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricName}>反応の傾向</Text>
                <Text style={styles.metricText}>{card.responseEstimate}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>{insights.disclaimer}</Text>

      <View style={styles.bottomNav}>
        <Pressable style={[styles.navButton, styles.navButtonActive]}>
          <MaterialIcons name="insights" size={19} color={palette.background} />
          <Text style={styles.navTextActive}>インサイト</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <MaterialIcons name="history" size={19} color={palette.textSecondary} />
          <Text style={styles.navText}>履歴</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.replace('/home')}>
          <MaterialIcons name="settings" size={19} color={palette.textSecondary} />
          <Text style={styles.navText}>設定</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 32,
  },
  liveRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
  liveLabel: {
    color: 'rgba(43, 238, 108, 0.72)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  titleBlock: {
    gap: 4,
    marginTop: 2,
  },
  pageTitle: {
    color: palette.textPrimary,
    fontSize: 30,
    fontWeight: '300',
  },
  pageSubtitle: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  cardsArea: {
    gap: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: 'rgba(22, 29, 26, 0.82)',
    padding: 14,
    gap: 10,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speakerBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.24)',
    backgroundColor: 'rgba(43, 238, 108, 0.11)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBadgeText: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  cardHeaderTexts: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  cardStatus: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  mainTag: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.24)',
    backgroundColor: 'rgba(43, 238, 108, 0.09)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  affinityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.2)',
    backgroundColor: 'rgba(43, 238, 108, 0.08)',
    padding: 10,
  },
  affinityText: {
    color: palette.textPrimary,
    fontSize: 12,
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: palette.borderSoft,
    paddingTop: 10,
  },
  metricCol: {
    flex: 1,
    gap: 4,
  },
  metricName: {
    color: 'rgba(255, 255, 255, 0.46)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricText: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.38)',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  bottomNav: {
    marginTop: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(28, 34, 30, 0.92)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 2,
  },
  navButtonActive: {
    backgroundColor: palette.primary,
  },
  navText: {
    color: palette.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  navTextActive: {
    color: palette.background,
    fontSize: 9,
    fontWeight: '800',
  },
});
