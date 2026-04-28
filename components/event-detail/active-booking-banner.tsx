import { View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';

export interface ActiveBookingBannerProps {
  activeTicketsCount: number;
  secondsLeft: number;
  bottomInset: number;
  onPress: () => void;
}

export function ActiveBookingBanner({
  activeTicketsCount,
  secondsLeft,
  bottomInset,
  onPress,
}: ActiveBookingBannerProps) {
  if (activeTicketsCount <= 0 || secondsLeft <= 0) return null;

  return (
    <View
      className="absolute left-0 right-0 bottom-0"
      style={{ paddingBottom: Math.max(16, bottomInset + 8), paddingHorizontal: 20 }}
    >
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 rounded-xl shadow-sm"
        style={{ backgroundColor: THEME.dark.foreground }}
        onPress={onPress}
      >
        <View>
          <Text className="text-base font-primary-bold" style={{ color: THEME.dark.background }}>
            {activeTicketsCount} ticket{activeTicketsCount !== 1 ? 's' : ''} added
          </Text>
          <Text className="mt-1 text-sm font-primary-medium" style={{ color: THEME.dark.muted }}>
            Complete your booking in {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
            {String(secondsLeft % 60).padStart(2, '0')} min
          </Text>
        </View>
        <ChevronRight size={20} color={THEME.dark.background} />
      </TouchableOpacity>
    </View>
  );
}
