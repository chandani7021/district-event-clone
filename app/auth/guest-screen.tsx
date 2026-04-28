import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Pressable, useWindowDimensions, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { GuestHero } from '@/components/auth/guest-hero';
import { GuestPanel } from '@/components/auth/guest-panel';
import { LoginPanel } from '@/components/auth/login-panel';
import { TermsFooter } from '@/components/auth/terms-footer';
import { DEFAULT_COUNTRY } from '@/constants/countries';
import { THEME } from '@/lib/theme';

export default function GuestScreen() {
  const params = useLocalSearchParams<{ dialCode?: string; flag?: string }>();
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const HIDDEN_Y = SCREEN_HEIGHT;

  const [selectedCountry, setSelectedCountry] = useState({
    dialCode: DEFAULT_COUNTRY.dialCode,
    flag: DEFAULT_COUNTRY.flag,
  });

  // Increment to force LoginPanel remount (resets its internal phone/error state)
  const [loginKey, setLoginKey] = useState(0);

  // images replace the inline icons.
  const [isHeroReady, setIsHeroReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setIsHeroReady(true);
    }, 0);

    // If we land here and we're already logged in, get out.
    // This prevents "back and back" from hitting the guest screen while signed in.
    import('@/services/auth.service').then(({ checkSession }) => {
      checkSession().then(({ isAuthenticated }) => {
        if (!cancelled && isAuthenticated) {
          router.replace('/home');
        }
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const loginTop = useSharedValue(HIDDEN_Y);
  const loginTopRadius = useSharedValue(24);

  const loginAnimatedStyle = useAnimatedStyle(() => ({
    top: loginTop.value,
    borderTopLeftRadius: loginTopRadius.value,
    borderTopRightRadius: loginTopRadius.value,
  }));

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [loginMounted, setLoginMounted] = useState(false);
  const [panelAutoFocus, setPanelAutoFocus] = useState(false);

  useEffect(() => {
    if (params.dialCode) {
      setSelectedCountry({
        dialCode: params.dialCode,
        flag: params.flag || DEFAULT_COUNTRY.flag,
      });
      setLoginMounted(true);
      setIsLoginVisible(true);
      loginTop.value = withSpring(0);
      loginTopRadius.value = withSpring(0);
    }
  }, [params.dialCode, params.flag, SCREEN_HEIGHT, loginTop, loginTopRadius]);

  const showLoginSheet = () => {
    setLoginMounted(true);
    setIsLoginVisible(true);
    setLoginKey((k) => k + 1);
    setPanelAutoFocus(false);
    loginTop.value = withSpring(SCREEN_HEIGHT * 0.5);
    loginTopRadius.value = withSpring(24);
  };

  const hideLoginSheet = () => {
    Keyboard.dismiss();
    setIsLoginVisible(false);
    setPanelAutoFocus(false);
    // Animate out first, then unmount — this prevents the sheet from ever
    // being visible (even as a sliver) while in the "hidden" state.
    loginTopRadius.value = withSpring(24);
    loginTop.value = withSpring(HIDDEN_Y, {}, (finished) => {
      if (finished) runOnJS(setLoginMounted)(false);
    });
  };

  const handlePhoneFocus = () => {
    // If already in login view and focus is already tracked, don't remount or re-scroll to prevent loops.
    // Use stable boolean state instead of loginTop.value which is animated and takes time to reach 0.
    if (isLoginVisible && panelAutoFocus) return;

    // We don't want to increment loginKey here because that would remount the LoginPanel
    // while the keyboard is trying to open, causing a focus loop.
    setLoginMounted(true);
    setPanelAutoFocus(true);
    setIsLoginVisible(true);
    loginTop.value = withSpring(0);
    loginTopRadius.value = withSpring(0);
  };

  return (
    <View className="flex-1 bg-zinc-800">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1">
        {/* ── Hero ─────────────── */}
        <View className="h-1/2" style={{ paddingTop: insets.top }}>
          <GuestHero
            isHeroReady={isHeroReady}
            onSkip={() => router.replace('/home')}
          />
        </View>

        {/* ── Guest bottom sheet ────────────────── */}
        {!isLoginVisible && (
          // TermsFooter is a child (not footer prop) so it scrolls with content
          <BottomSheet isInline coverage={0.5} disableSwipe>
            <GuestPanel
              onUseAnotherLogin={showLoginSheet}
              selectedCountry={selectedCountry}
              onPhoneFocus={handlePhoneFocus}
            />
            <TermsFooter />
          </BottomSheet>
        )}
      </View>

      {/* ── Overlay behind login sheet ───────────────────────────────────── */}
      {isLoginVisible && (
        <Pressable
          className="absolute inset-0 bg-black/60"
          style={{ zIndex: 9 }}
          onPress={hideLoginSheet}
        />
      )}

      {/* ── Login bottom sheet — only mounted when needed, unmounted after
           hide-animation completes, so it never bleeds under the guest sheet */}
      {loginMounted && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: THEME.dark.card,
              overflow: 'hidden',
            },
            loginAnimatedStyle,
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            pointerEvents="box-none"
          >
            <ScrollView
              className="flex-1"
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: panelAutoFocus ? Math.max(24, insets.top) : 24,
                paddingBottom: Math.max(32, insets.bottom + 16),
              }}
            >
              <LoginPanel
                key={loginKey}
                selectedCountry={selectedCountry}
                onPhoneFocus={handlePhoneFocus}
                onBack={hideLoginSheet}
                insetTop={0}
                autoFocus={panelAutoFocus}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}
