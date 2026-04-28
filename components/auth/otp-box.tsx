import { THEME } from '@/lib/theme';
import { forwardRef } from 'react';
import { Platform } from 'react-native';
import { OtpInput, type OtpInputRef } from 'react-native-otp-entry';

export type { OtpInputRef };
export const OTP_LENGTH = 6;

interface OtpEntryProps {
  hasError: boolean;
  onTextChange: (text: string) => void;
  onFilled: (text: string) => void;
}

export const OtpEntry = forwardRef<OtpInputRef, OtpEntryProps>(
  ({ hasError, onTextChange, onFilled }, ref) => (
    <OtpInput
      ref={ref}
      numberOfDigits={OTP_LENGTH}
      onTextChange={onTextChange}
      onFilled={onFilled}
      autoFocus
      textInputProps={{
        textContentType: 'oneTimeCode',
        autoComplete: Platform.OS === 'android' ? 'sms-otp' : 'one-time-code',
      }}
      theme={{
        containerStyle: { gap: 8 },
        pinCodeContainerStyle: {
          width: 48,
          height: 56,
          borderRadius: 8,
          backgroundColor: THEME.dark.secondary,
          borderWidth: 2,
          borderColor: hasError ? THEME.dark.destructive : THEME.dark.border,
        },
        focusedPinCodeContainerStyle: {
          borderColor: hasError ? THEME.dark.destructive : THEME.dark.primary,
        },
        filledPinCodeContainerStyle: {
          borderColor: hasError ? THEME.dark.destructive : 'rgba(255,255,255,0.3)',
        },
        pinCodeTextStyle: {
          color: THEME.dark.foreground,
          fontSize: 20,
          fontWeight: '700',
        },
        focusStickStyle: { display: 'none' },
      }}
    />
  )
);
