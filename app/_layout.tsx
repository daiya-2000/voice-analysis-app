import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A1A10' },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="host-setup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="session-lobby" />
        <Stack.Screen name="observer-setup" />
        <Stack.Screen name="live-session" />
        <Stack.Screen name="insights" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
