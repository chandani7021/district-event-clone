import { View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { PaymentMethodIcon } from '@/components/booking/payment-method-icon';
import type { PaymentMethodOption } from '@/interfaces/booking.interface';
import { BOOKING_ADD_BTN } from '@/constants/booking.constants';

interface PaymentMethodRowProps {
  method: PaymentMethodOption;
  selected: boolean;
  onPress: () => void;
  showAdd?: boolean;
}

export function PaymentMethodRow({ method, onPress, showAdd }: PaymentMethodRowProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-4 border-b border-border ${method.unavailable ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={method.unavailable}
    >
      <View className="mr-3">
        <PaymentMethodIcon methodId={method.id} size={40} />
      </View>

      <View className="flex-1">
        <Text className="text-foreground text-base font-primary-semibold">{method.name}</Text>
        {method.subtext ? (
          <Text className="text-xs mt-0.5 text-muted-foreground">
            {method.subtext}
          </Text>
        ) : null}
      </View>

      {showAdd ? (
        <Text className="text-sm font-primary-bold text-foreground">
          {BOOKING_ADD_BTN}
        </Text>
      ) : (
        <ChevronRight size={18} color={THEME.dark.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}
