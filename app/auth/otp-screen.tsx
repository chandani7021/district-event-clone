import { verifyOtp } from '@/services/auth.service';
import { addOrUpdateAccount } from '@/services/accounts.service';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CircleAlert } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { AppState, ActivityIndicator, Keyboard, Pressable, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestOtp } from '@/services/auth.service';

import { OtpEntry, OTP_LENGTH, type OtpInputRef } from '@/components/auth/otp-box';
import { OTP_NOT_RECEIVED, OTP_RESEND_IN, OTP_RESEND_LABEL, OTP_RESEND_SECONDS_SUFFIX, OTP_SENT_MESSAGE, OTP_VERIFICATION_FAILED, OTP_VERIFY_BUTTON, OTP_ENTER_COMPLETE_ERROR } from '@/constants/auth.constants';

export default function OtpScreen() {
  const { phone, dialCode, returnTo } = useLocalSearchParams<{
    phone: string;
    dialCode: string;
    flag: string;
    returnTo?: string;
  }>();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Resend countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRef = useRef<OtpInputRef>(null);
  const canResendRef = useRef(false);
  // Wall-clock expiry so backgrounding the app doesn't pause the timer
  const expiresAtRef = useRef(Date.now() + 60 * 1000);

  // Keep ref in sync so the clipboard effect reads the latest value
  useEffect(() => { canResendRef.current = canResend; }, [canResend]);

  // Clipboard: poll every 500ms until a 6-digit code is found or countdown expires.
  // Also re-checks when the app returns to foreground (user copies code from SMS app).
  useEffect(() => {
    let stopped = false;

    const fillFromClipboard = async () => {
      if (stopped || canResendRef.current) return;
      const text = await Clipboard.getStringAsync();
      const clean = text.trim();
      if (/^\d{6}$/.test(clean)) {
        stopped = true;
        otpRef.current?.setValue(clean);
        setOtp(clean);
        Clipboard.setStringAsync('');
      }
    };

    // Poll every 500ms until filled; stops once `stopped` is set
    const interval = setInterval(fillFromClipboard, 500);

    // Also check immediately when app comes back to foreground (e.g. user copies from SMS app)
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fillFromClipboard();
    });

    return () => { stopped = true; clearInterval(interval); sub.remove(); };
  }, []);

  // Countdown timer — wall-clock based so backgrounding the app counts against the timer
  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAtRef.current - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) setCanResend(true);
    };

    tick(); // run immediately on mount
    const interval = setInterval(tick, 500); // poll at 500ms to stay accurate

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick(); // recalculate the moment app returns to foreground
    });

    return () => { clearInterval(interval); sub.remove(); };
  }, []);

  const isComplete = otp.length === OTP_LENGTH;

  const submitOtp = async (otpValue: string) => {
    if (otpValue.length !== OTP_LENGTH) {
      setError(OTP_ENTER_COMPLETE_ERROR);
      return;
    }
    setIsVerifying(true);
    setError('');

    const result = await verifyOtp(phone ?? '', dialCode ?? '', otpValue);
    setIsVerifying(false);

    if (result.success) {
      await addOrUpdateAccount(phone ?? '', dialCode ?? '');
      if (returnTo === 'back') {
        router.back();
      } else {
        // Pop all previous auth/guest screens and reset to home
        router.dismissAll();
        router.replace('/home');
      }
    } else {
      setError(result.message ?? OTP_VERIFICATION_FAILED);
      setOtp('');
      otpRef.current?.clear();
    }
  };

  const handleSubmit = () => submitOtp(otp);

  const handleResend = async () => {
    if (!canResend) return;
    expiresAtRef.current = Date.now() + 60 * 1000;
    setCanResend(false);
    setCountdown(60);
    setOtp('');
    setError('');
    otpRef.current?.clear();

    await requestOtp(phone ?? '', dialCode ?? '');
  };

  const maskedPhone = ` ${dialCode ?? ''}${phone ? ` •••• ${phone.slice(-4)}` : ''}`;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 px-6 pt-4">
        {/* Back */}
        <TouchableOpacity
          id="auth-otp-back"
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          onPress={() => router.back()}
          hitSlop={8}>
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </TouchableOpacity>

        {/* Heading */}
        <View className="mt-10 gap-2">
          <Text className="text-muted-foreground text-base">
            {OTP_SENT_MESSAGE}{' '}
            <Text className="text-foreground font-primary-medium">{maskedPhone}</Text>
          </Text>
        </View>

        {/* OTP input */}
        <View className="mt-10">
          <OtpEntry
            ref={otpRef}
            hasError={!!error}
            onTextChange={(text) => { setOtp(text); setError(''); }}
            onFilled={submitOtp}
          />
        </View>

        {/* Error message */}
        {error ? (
          <View className="flex-row items-center gap-2 mt-4">
            <CircleAlert size={16} color={THEME.dark.destructive} />
            <Text className="text-destructive text-sm flex-1">{error}</Text>
          </View>
        ) : null}

        {/* Resend */}
        <View className="flex-row items-center justify-center mt-8 gap-1">
          <Text className="text-muted-foreground text-sm">{OTP_NOT_RECEIVED}</Text>
          {canResend ? (
            <TouchableOpacity id="auth-otp-resend" onPress={handleResend} hitSlop={8}>
              <Text className="text-primary font-primary-semibold text-sm"> {OTP_RESEND_LABEL}</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-muted-foreground text-sm">
              {' '}{OTP_RESEND_IN}{' '}
              <Text className="text-foreground font-primary-medium">{countdown}{OTP_RESEND_SECONDS_SUFFIX}</Text>
            </Text>
          )}
        </View>

        {/* Submit */}
        <View className="mt-8">
          <Button
            id="auth-otp-verify"
            className="w-full rounded-2xl bg-primary"
            disabled={!isComplete || isVerifying}
            onPress={handleSubmit}>
            {isVerifying ? (
              <ActivityIndicator size="small" color={THEME.dark.primaryForeground} />
            ) : (
              <Text className="text-primary-foreground font-primary-semibold text-md">{OTP_VERIFY_BUTTON}</Text>
            )}
          </Button>
        </View>
      </View>
    </Pressable>
    </SafeAreaView>
  );
}
