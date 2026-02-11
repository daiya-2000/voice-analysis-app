import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '@/src/presentation/screens/onboarding-screen';
import { useHostProfileBootstrap } from '@/src/presentation/hooks/use-host-profile-bootstrap';
import { palette } from '@/src/presentation/theme/palette';

export default function IndexRoute() {
  const router = useRouter();
  const { hasHostProfile, isLoading } = useHostProfileBootstrap();

  useEffect(() => {
    if (isLoading || !hasHostProfile) {
      return;
    }

    router.replace('/home');
  }, [hasHostProfile, isLoading, router]);

  if (isLoading || hasHostProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={palette.primary} />
        <Text style={styles.loadingText}>プロフィールを確認しています...</Text>
      </View>
    );
  }

  return <OnboardingScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: palette.textSecondary,
    fontSize: 13,
  },
});
