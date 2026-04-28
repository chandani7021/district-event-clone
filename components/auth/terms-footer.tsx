import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TermsFooter() {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="items-center gap-1.5 px-10"
      style={{ paddingBottom: Math.max(16, insets.bottom) }}
    >
      <Text className="text-muted-foreground text-[13px] text-center">
        By continuing, you agree to our
      </Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => router.push('/legal/terms-of-service')}
          hitSlop={8}>
          <View className="border-b border-foreground border-dotted pb-[2px]">
            <Text className="text-foreground text-[13px] font-primary-medium">
              Terms of Service
            </Text>
          </View>
        </TouchableOpacity>
        <Text className="text-muted-foreground text-[13px] mx-1.5">and</Text>
        <TouchableOpacity
          id="auth-guest-privacy"
          onPress={() => router.push('/legal/privacy-policy')}
          hitSlop={8}>
          <View className="border-b border-foreground border-dotted pb-[2px]">
            <Text className="text-foreground text-[13px] font-primary-medium">
              Privacy Policy
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
