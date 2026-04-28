import { Text } from '@/components/ui/text';
import { ChevronDown } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { LoginForm } from './login-form';
import { COMMON_BACK } from '@/constants/profile.constants';

interface LoginPanelProps {
  selectedCountry: { dialCode: string; flag: string };
  /** phone input is focused — parent uses this to expand the sheet */
  onPhoneFocus: () => void;
  onBack: () => void;
  /** top inset passed from parent so the back button clears the status bar */
  insetTop: number;
  autoFocus?: boolean;
  onOtpSent?: (phone: string) => void;
  returnTo?: string;
}

export function LoginPanel({ selectedCountry, onPhoneFocus, onBack, insetTop, autoFocus, onOtpSent, returnTo }: LoginPanelProps) {
  return (
    <View className="gap-5 " style={{ paddingTop: insetTop }}>
      <TouchableOpacity
        id="auth-guest-login-back"
        onPress={onBack}
        className="flex-row items-center gap-2">
        <ChevronDown size={20} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
        <Text className="text-foreground font-primary-medium">{COMMON_BACK}</Text>
      </TouchableOpacity>

      <LoginForm 
        selectedCountry={selectedCountry} 
        onPhoneFocus={onPhoneFocus} 
        autoFocus={autoFocus} 
        onOtpSent={onOtpSent} 
        returnTo={returnTo} 
      />
    </View>
  );
}
