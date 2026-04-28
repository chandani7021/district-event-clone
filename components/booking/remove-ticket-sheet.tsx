import { View, TouchableOpacity, Pressable, Modal } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import {
  BOOKING_REMOVE_CONFIRM_TITLE,
  BOOKING_REMOVE_CONFIRM_SUBTITLE,
  BOOKING_REMOVE_CONFIRM_BTN,
  BOOKING_REMOVE_CANCEL_BTN,
} from '@/constants/booking.constants';

interface RemoveTicketSheetProps {
  ticketName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemoveTicketSheet({ ticketName, onConfirm, onCancel }: RemoveTicketSheetProps) {
  return (
    <BottomSheet
      isVisible={true}
      onClose={onCancel}
      coverage={0.48}
      footer={
        <View className="gap-3">
          <TouchableOpacity
            onPress={onConfirm}
            className="bg-foreground rounded-2xl py-4 items-center"
          >
            <Text className="text-background text-base font-primary-bold">
              {BOOKING_REMOVE_CONFIRM_BTN}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="py-3 items-center">
            <View style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.mutedForeground, paddingBottom: 2 }}>
              <Text
                className="text-base font-primary-bold"
                style={{ color: THEME.dark.mutedForeground }}>
                {BOOKING_REMOVE_CANCEL_BTN}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      }
    >
      <View className="items-center gap-4 pt-2">
        <View className="w-16 h-16 rounded-2xl items-center justify-center bg-secondary">
          <ShoppingCart size={32} color="#F97316" />
        </View>
        <Text className="text-foreground text-xl font-primary-bold text-center">
          {BOOKING_REMOVE_CONFIRM_TITLE}
        </Text>
        <Text className="text-muted-foreground text-sm text-center leading-5">
          {BOOKING_REMOVE_CONFIRM_SUBTITLE(ticketName)}
        </Text>
      </View>
    </BottomSheet>
  );
}
