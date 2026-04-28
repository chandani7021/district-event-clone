import { View, TouchableOpacity } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { CardDetails } from '@/interfaces/payment.interface';
import { BOOKING_CARD_EDIT_BTN } from '@/constants/booking.constants';

interface SavedCardRowProps {
  card: CardDetails;
  selected: boolean;
  onPress: () => void;
  onEdit: () => void;
}

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '');
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function SavedCardRow({ card, selected, onPress, onEdit }: SavedCardRowProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-4 border-b border-border ${selected ? 'bg-primary/5' : ''}`}
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-lg items-center justify-center mr-3 bg-secondary">
        <CreditCard size={20} color={THEME.dark.foreground} />
      </View>

      <View className="flex-1">
        <Text className="text-foreground text-base font-primary-semibold">
          {maskCardNumber(card.cardNumber)}
        </Text>
        <Text className="text-xs mt-0.5 text-muted-foreground capitalize">
          {card.nicknameType}
        </Text>
      </View>

      <TouchableOpacity onPress={onEdit} className="px-2 py-1">
        <Text className="text-sm font-primary-bold text-foreground">{BOOKING_CARD_EDIT_BTN}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
