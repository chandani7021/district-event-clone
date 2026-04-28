import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  BOOKING_TICKET_LABEL,
  BOOKING_CONFIRMATION_CODE_LABEL,
} from '@/constants/booking.constants';

interface BookingTicketQRProps {
  confirmationCode: string;
  ticketIndex: number;
  totalTickets: number;
}

export function BookingTicketQR({ confirmationCode, ticketIndex, totalTickets }: BookingTicketQRProps) {
  return (
    <View className="rounded-xl overflow-hidden bg-card">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground text-sm font-primary-semibold text-center">
          {BOOKING_TICKET_LABEL} {ticketIndex} / {totalTickets}
        </Text>
      </View>
      <View className="items-center px-4 py-6">
        <View className="w-48 h-48 rounded-xl border-4 border-primary bg-white items-center justify-center">
          <Text className="text-[56px]">📱</Text>
        </View>
        <Text className="text-sm mt-4 text-muted-foreground">
          {BOOKING_CONFIRMATION_CODE_LABEL}{' '}
          <Text className="font-primary-bold text-primary">
            {confirmationCode}
          </Text>
        </Text>
      </View>
    </View>
  );
}
