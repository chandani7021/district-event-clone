import { checkSession } from '@/services/auth.service';
import { THEME } from '@/lib/theme';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      // Run session check and minimum 2-second display in parallel
      const [{ isAuthenticated }] = await Promise.all([
        checkSession(),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (cancelled) return;
      router.replace(isAuthenticated ? '/home' : '/auth/guest-screen');
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background px-10">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo placeholder — swap with <Image> when asset is ready */}
      <Text
        className="text-5xl font-primary-bold tracking-[10px] text-foreground"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        district-clone
      </Text>

      <ActivityIndicator className="mt-8" size="large" color={THEME.dark.primary} />
    </View>
  );
}
