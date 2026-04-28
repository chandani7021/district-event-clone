import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import {
  useFonts,
} from 'expo-font';
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';
import * as SystemUI from 'expo-system-ui';
import { THEME } from '@/lib/theme'
import { GlobalToast } from '@/components/ui/toast';
import { BuyAgainSheet } from '@/components/booking/buy-again-sheet';
import { bookingSession } from '@/services/booking.service';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';

let NavigationBar: typeof import('expo-navigation-bar') | null = null;
if (Platform.OS === 'android') {
  try {
    NavigationBar = require('expo-navigation-bar');
  } catch (e) {
    // Only warn if it's not a missing native module error which is expected in some dev environments
    if (!(e instanceof Error && e.message.includes('Cannot find native module'))) {
      console.warn('NavigationBar module failed to load:', e);
    }
  }
}


SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Oswald-Regular': Oswald_400Regular,
    'Oswald-Medium': Oswald_500Medium,
    'Oswald-SemiBold': Oswald_600SemiBold,
    'Oswald-Bold': Oswald_700Bold,
    'Manrope-Regular': Manrope_400Regular,
    'Manrope-Medium': Manrope_500Medium,
    'Manrope-SemiBold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(NAV_THEME[colorScheme ?? 'light'].colors.background);
      if (NavigationBar) {
        NavigationBar.setBehaviorAsync('inset-touch');
        NavigationBar.setStyle?.(colorScheme === 'dark' ? 'light' : 'dark');
      }
    }
  }, [colorScheme]);

  const router = useRouter();
  const { isExpired } = useActiveBookingTimer();
  const [sheetDismissed, setSheetDismissed] = useState(false);

  // If session is cleared by success, isExpired will be false, so this won't show incorrectly.
  const timerExpired = isExpired;

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack />
          <PortalHost />
          <GlobalToast />
          {timerExpired && !sheetDismissed && (
            <BuyAgainSheet
              onBuyAgain={() => {
                const session = bookingSession.get();
                const eventId = session.eventId;
                bookingSession.clear();
                router.dismissAll();
                if (eventId) {
                  router.push({ pathname: '/events/[id]', params: { id: eventId } });
                } else {
                  router.push('/');
                }
              }}
              onDismiss={() => setSheetDismissed(true)}
            />
          )}
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
