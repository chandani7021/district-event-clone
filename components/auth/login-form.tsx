import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { requestOtp } from '@/services/auth.service';
import { router } from 'expo-router';
import { ChevronDown, CircleAlert } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { validatePhoneNumber } from '@/lib/utils';
import { AUTH_GOOGLE_SIGNIN, AUTH_LOGIN_TITLE, AUTH_PHONE_PLACEHOLDER, AUTH_SEND_OTP, COMMON_OR } from '@/constants/auth.constants';
import type { LoginFormProps } from '@/interfaces/profile.interface';

export function LoginForm({ selectedCountry, onPhoneFocus, hideHeading = false, autoFocus = false, onOtpSent, returnTo }: LoginFormProps) {
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const inputRef = useRef<TextInput>(null);

    // Imperatively focus after mount with a delay so any prior keyboard
    // focus (e.g. guest panel's input) has fully released before we claim it.
    const hasFocusedOnce = useRef(false);
    useEffect(() => {
        if (!autoFocus || hasFocusedOnce.current) return;
        
        const timer = setTimeout(() => {
            // Re-check hasFocusedOnce inside the timeout in case of rapid re-renders
            if (hasFocusedOnce.current) return;
            
            if (!inputRef.current?.isFocused()) {
                hasFocusedOnce.current = true;
                inputRef.current?.focus();
            } else {
                // If it's already focused (manually by user), we mark it as handled
                hasFocusedOnce.current = true;
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [autoFocus]);

    const handleSendOtp = async () => {
        const error = validatePhoneNumber(phone);
        if (error) {
            setPhoneError(error);
            return;
        }
        setPhoneError('');
        setIsSendingOtp(true);

        const result = await requestOtp(phone, selectedCountry.dialCode);
        setIsSendingOtp(false);

        if (result.success) {
            if (onOtpSent) onOtpSent(phone);
            router.push({
                pathname: '/auth/otp-screen',
                params: { phone, dialCode: selectedCountry.dialCode, flag: selectedCountry.flag, returnTo },
            });
        } else {
            setPhoneError(result.message);
        }
    };

    return (
        <View className="gap-2">
            {!hideHeading && (
                <Text className="text-2xl font-primary-bold text-foreground text-center mb-4">{AUTH_LOGIN_TITLE}</Text>
            )}

            {/* Phone number row */}
            <Pressable
                onPress={() => {
                    onPhoneFocus?.();
                    inputRef.current?.focus();
                }}
                className={`flex-row items-center bg-secondary rounded-xl border overflow-hidden ${phoneError ? 'border-destructive' : 'border-border'}`}>
                <Pressable
                    id="auth-guest-country-code"
                    className="flex-row items-center gap-1.5 px-4 py-3.5 border-r border-border"
                    onPress={() => router.push('/auth/country-selection')}>
                    <Text className="text-foreground font-primary-medium">
                        {selectedCountry.flag} {selectedCountry.dialCode}
                    </Text>
                    <ChevronDown size={14} color="#FFFFFF" />
                </Pressable>
                <Input
                    id="auth-guest-phone-input"
                    ref={inputRef}
                    className="flex-1 border-0 bg-transparent text-foreground px-4 py-3.5 h-[52px]"
                    placeholder={AUTH_PHONE_PLACEHOLDER}
                    placeholderTextColor={THEME.dark.mutedForeground}
                    keyboardType="phone-pad"
                    value={phone}
                    onFocus={onPhoneFocus}
                    onChangeText={(t: string) => {
                        setPhone(t.replace(/\D/g, '').slice(0, 10));
                        if (phoneError) setPhoneError('');
                    }}
                    maxLength={10}
                />
            </Pressable>

            {/* Validation error */}
            {phoneError ? (
                <View className="flex-row items-center gap-1.5">
                    <CircleAlert size={14} color={THEME.dark.destructive} />
                    <Text className="text-destructive text-xs flex-1">{phoneError}</Text>
                </View>
            ) : null}

            {/* Send OTP */}
            <Button
                id="auth-guest-send-otp"
                className="bg-primary w-full rounded-xl mt-1 disabled:opacity-50 h-12"
                disabled={isSendingOtp || phone.length !== 10}
                onPress={handleSendOtp}>
                {isSendingOtp ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text className="text-primary-foreground font-primary-semibold">{AUTH_SEND_OTP}</Text>
                )}
            </Button>

            <View className="flex-row items-center gap-3">
                <View className="flex-1 h-px bg-foreground/20" />
                <Text className="text-muted-foreground text-xs">{COMMON_OR}</Text>
                <View className="flex-1 h-px bg-foreground/20" />
            </View>

            {/* Google sign-in */}
            <Button
                id="auth-guest-google-signin"
                variant="outline"
                className="bg-foreground border-0 w-full rounded-xl h-12"
                onPress={() => console.log('Google sign-in')}>
                <Text className="text-primary-foreground font-primary-semibold">{AUTH_GOOGLE_SIGNIN}</Text>
            </Button>
        </View>
    );
}
