import { View, TouchableOpacity, Pressable, Modal } from 'react-native';
import { AlarmClockOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import {
  BOOKING_TIMES_UP_TITLE,
  BOOKING_TIMES_UP_SUBTITLE,
  BOOKING_BUY_AGAIN_BTN,
} from '@/constants/booking.constants';

interface BuyAgainSheetProps {
  onBuyAgain: () => void;
  onDismiss: () => void;
}

export function BuyAgainSheet({ onBuyAgain, onDismiss }: BuyAgainSheetProps) {
  return (
    <BottomSheet
      isVisible={true}
      onClose={onDismiss}
      coverage={0.45}
      footer={
        <TouchableOpacity
          onPress={onBuyAgain}
          className="bg-foreground rounded-2xl py-4 items-center"
        >
          <Text className="text-background text-base font-primary-bold">{BOOKING_BUY_AGAIN_BTN}</Text>
        </TouchableOpacity>
      }
    >
      <View className="items-center gap-4 pt-2">
        <View className="w-16 h-16 rounded-2xl items-center justify-center bg-secondary">
          <AlarmClockOff size={32} color={THEME.dark.mutedForeground} />
        </View>
        <Text className="text-foreground text-xl font-primary-bold text-center">
          {BOOKING_TIMES_UP_TITLE}
        </Text>
        <Text className="text-muted-foreground text-sm text-center leading-5">
          {BOOKING_TIMES_UP_SUBTITLE}
        </Text>
      </View>
    </BottomSheet>
  );
}
