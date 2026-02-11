import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { AppScreen } from '@/src/presentation/components/app-screen';
import { useVoiceAnalysisUiData } from '@/src/presentation/hooks/use-voice-analysis-ui-data';
import { palette } from '@/src/presentation/theme/palette';

function iconForStep(icon: 'voice' | 'qr' | 'insight') {
  switch (icon) {
    case 'voice':
      return 'record-voice-over';
    case 'qr':
      return 'qr-code-2';
    case 'insight':
      return 'insights';
    default:
      return 'circle';
  }
}

export function OnboardingScreen() {
  const router = useRouter();
  const { onboardingSteps } = useVoiceAnalysisUiData();
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = useMemo(() => onboardingSteps[stepIndex], [onboardingSteps, stepIndex]);
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      router.replace('/host-setup');
      return;
    }

    setStepIndex((currentIndex) => currentIndex + 1);
  };

  return (
    <AppScreen contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.replace('/host-setup')}>
          <Text style={styles.skipLabel}>スキップ</Text>
        </Pressable>
      </View>

      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <MaterialIcons name={iconForStep(currentStep.icon)} size={96} color={palette.primary} />
        </View>

        <Text style={styles.stepText}>STEP 0{currentStep.id}</Text>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.stepIndicators}>
          {onboardingSteps.map((step, index) => (
            <View
              key={step.id}
              style={[styles.stepIndicator, index === stepIndex && styles.stepIndicatorActive]}
            />
          ))}
        </View>

        <PrimaryButton label={isLastStep ? 'はじめる' : '次へ'} onPress={handleNext} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  topRow: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  skipLabel: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(43, 238, 108, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(43, 238, 108, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepText: {
    color: palette.primary,
    letterSpacing: 3,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: palette.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 310,
  },
  footer: {
    gap: 22,
    paddingBottom: 12,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepIndicatorActive: {
    width: 26,
    backgroundColor: palette.primary,
  },
});
