import { LocationPin } from '@/components/auth/location-pin';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { ConciergeBell, Film, Mic } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

interface GuestHeroProps {
  isHeroReady: boolean;
  onSkip: () => void;
}

export function GuestHero({ isHeroReady, onSkip }: GuestHeroProps) {
  return (
    <View className="flex-1 items-center justify-center">
      {/* Skip button */}
      <TouchableOpacity
        id="auth-guest-skip"
        className="absolute top-4 right-5 bg-card rounded-full px-5 py-2"
        onPress={onSkip}
        hitSlop={12}>
        <Text className="text-foreground text-sm font-primary-medium">Skip</Text>
      </TouchableOpacity>

      {/* Decorative glow + shadow — shown only when hero is ready */}
      {isHeroReady && (
        <>
          <View
            className="absolute w-56 h-56 rounded-full"
            style={{ backgroundColor: 'rgba(232,234,3,0.12)' }}
          />
          <View
            className="absolute bottom-7 w-60 h-5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
          />
        </>
      )}

      {/* Location pins — skeleton shown during entrance animation */}
      {isHeroReady ? (
        <View className="flex-row items-end gap-5 mb-12">
          <View className="mb-5">
            <LocationPin icon={ConciergeBell} color={THEME.dark.brandLight} size="sm" />
          </View>
          <LocationPin icon={Mic} color={THEME.dark.primary} size="lg" />
          <View className="mb-5">
            <LocationPin icon={Film} color={THEME.dark.brandMuted} size="sm" />
          </View>
        </View>
      ) : (
        <View className="flex-row items-end gap-5 mb-12">
         
          <View className="mb-5 items-center gap-0.5">
            <Skeleton width={64} height={64} borderRadius={32} />
            <Skeleton width={10} height={13} borderRadius={2} />
          </View>
          
          <View className="items-center gap-0.5">
            <Skeleton width={88} height={88} borderRadius={44} />
            <Skeleton width={14} height={18} borderRadius={2} />
          </View>
         
          <View className="mb-5 items-center gap-0.5">
            <Skeleton width={64} height={64} borderRadius={32} />
            <Skeleton width={10} height={13} borderRadius={2} />
          </View>
        </View>
      )}
    </View>
  );
}
