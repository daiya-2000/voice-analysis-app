import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ParseSessionJoinLinkUseCase } from '@/src/application/usecases/parse-session-join-link.usecase';
import { PrimaryButton } from '@/src/presentation/components/primary-button';
import { palette } from '@/src/presentation/theme/palette';

export function QrScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanningLocked, setIsScanningLocked] = useState(false);
  const [scanErrorMessage, setScanErrorMessage] = useState<string | null>(null);

  const parseSessionJoinLinkUseCase = useMemo(() => new ParseSessionJoinLinkUseCase(), []);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (isScanningLocked) {
        return;
      }

      const parsedLink = parseSessionJoinLinkUseCase.execute(result.data);

      if (!parsedLink) {
        setScanErrorMessage('有効なセッションQRではありません。もう一度読み取ってください。');
        setIsScanningLocked(true);
        return;
      }

      setIsScanningLocked(true);
      setScanErrorMessage(null);

      router.replace({
        pathname: '/observer-session-auth',
        params: {
          sessionCode: parsedLink.sessionCode,
        },
      });
    },
    [isScanningLocked, parseSessionJoinLinkUseCase, router]
  );

  const handleRetry = useCallback(() => {
    setScanErrorMessage(null);
    setIsScanningLocked(false);
  }, []);

  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.infoText}>カメラ権限を確認しています...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>QRコードを読み取るためにカメラ権限が必要です</Text>
        <Text style={styles.infoText}>Observer参加のため、QRコードをスキャンします。</Text>
        <PrimaryButton label="カメラを許可" onPress={requestPermission} />
        <Pressable style={styles.backButtonInline} onPress={() => router.back()}>
          <Text style={styles.backLabel}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={18} color={palette.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>QRコードをスキャン</Text>
          <View style={styles.headerButtonPlaceholder} />
        </View>

        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>セッションロビーのQRコードを枠内に合わせてください</Text>
        </View>

        {scanErrorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{scanErrorMessage}</Text>
            <PrimaryButton label="再スキャン" onPress={handleRetry} />
          </View>
        ) : (
          <View style={styles.footerSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  scanFrameContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: palette.primary,
    backgroundColor: 'transparent',
  },
  scanHint: {
    color: palette.textPrimary,
    fontSize: 13,
    textAlign: 'center',
  },
  errorContainer: {
    gap: 10,
  },
  errorText: {
    color: '#FFD1D1',
    textAlign: 'center',
    fontSize: 12,
  },
  footerSpacer: {
    height: 54,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoText: {
    color: palette.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButtonInline: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backLabel: {
    color: palette.textSecondary,
    fontSize: 13,
  },
});
