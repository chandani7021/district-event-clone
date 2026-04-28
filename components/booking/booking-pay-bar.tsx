import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  BOOKING_PAY_NOW_BTN,
  BOOKING_PAY_USING,
  BOOKING_CURRENCY_SYMBOL,
} from '@/constants/booking.constants';

interface BookingPayBarProps {
  paymentMethodName: string;
  totalAmount: number;
  isProcessing: boolean;
  disabled: boolean;
  bottomInset: number;
  onSelectPayment: () => void;
  onPayNow: () => void;
}

export function BookingPayBar({
  paymentMethodName,
  totalAmount,
  isProcessing,
  disabled,
  bottomInset,
  onSelectPayment,
  onPayNow,
}: BookingPayBarProps) {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center px-4 pt-3 border-t border-border bg-card"
      style={{ paddingBottom: Math.max(bottomInset, 16) }}
    >
      <TouchableOpacity className="flex-col" onPress={onSelectPayment}>
        <Text className="text-xs text-muted-foreground">{BOOKING_PAY_USING}</Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Text className="text-foreground text-sm font-primary-semibold">{paymentMethodName}</Text>
          <ChevronDown size={14} color={THEME.dark.foreground} />
        </View>
      </TouchableOpacity>

      <View className="flex-1" />

      <TouchableOpacity
        className={`rounded-2xl px-4 py-3 items-center flex-row gap-3 bg-foreground ${disabled ? 'opacity-50' : ''}`}
        onPress={onPayNow}
        disabled={isProcessing || disabled}
      >
        {isProcessing ? (
          <ActivityIndicator color={THEME.dark.background} size="small" />
        ) : (
          <>
            <View className="flex-col items-start">
              <Text className="text-sm font-primary-bold text-background">
                {BOOKING_CURRENCY_SYMBOL}{totalAmount.toLocaleString('en-IN')}
              </Text>
              <Text className="text-xs text-background opacity-60">Total</Text>
            </View>
            <View className="w-px h-full bg-background opacity-20" />
            <View className="flex-row items-center gap-0.5">
              <Text className="text-base font-primary-bold text-background">
                {BOOKING_PAY_NOW_BTN}
              </Text>
              <ChevronRight size={16} color={THEME.dark.background} />
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
