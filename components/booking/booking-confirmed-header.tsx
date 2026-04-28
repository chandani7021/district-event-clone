import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Ticket } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import type { BookedTicket } from '@/interfaces/booking.interface';
import {
  BOOKING_CONFIRMED_TITLE,
  BOOKING_M_TICKET_SHOW,
  BOOKING_ONWARDS_LABEL,
} from '@/constants/booking.constants';
import { formatDate, formatTime } from '@/lib/utils';

interface BookingConfirmedHeaderProps {
  booking: BookedTicket;
  topInset: number;
  onClose: () => void;
}

export function BookingConfirmedHeader({ booking, topInset, onClose }: BookingConfirmedHeaderProps) {
  const dateStr = booking.eventEndDate
    ? `${formatDate(booking.eventDate)} - ${formatDate(booking.eventEndDate)}`
    : formatDate(booking.eventDate);

  return (
    <LinearGradient
      colors={['#0d3d1c', '#050e07']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="px-5 pb-8"
      style={{ paddingTop: topInset + 16 }}
    >


      <View className="items-center">
        <View className="w-20 h-20 rounded-full items-center justify-center bg-[#22c55e]">
          <Text className="text-4xl text-white font-primary-bold leading-10 pb-">✓</Text>
        </View>
        <Text className="text-white text-xl font-primary-bold text-center">
          {BOOKING_CONFIRMED_TITLE}
        </Text>
      </View>

      <View className="flex-row items-center gap-3 mx-4">
        <Image
          source={{ uri: booking.coverImage }}
          className="w-16 h-16 rounded-lg"
        />
        <View className="flex-1">
          <Text className="text-white text-base font-primary-bold" numberOfLines={2}>
            {booking.eventTitle}
          </Text>
        </View>
      </View>

      <View className="mt-4 rounded-xl overflow-hidden mx-4 bg-white/[0.07]">
        <View className="px-4 py-4 border-b border-white/10">
          <Text className="text-white text-base font-primary-bold">
            {dateStr}{'  '}|{'  '}{formatTime(booking.eventTime)} {BOOKING_ONWARDS_LABEL}
          </Text>
        </View>
        {booking.tickets.map((t) => (
          <View key={t.ticketTypeId} className="px-4 py-4 border-b border-white/10">
            <Text className="text-white text-base font-primary-semibold">
              {t.quantity} x {t.ticketTypeName}
            </Text>
          </View>
        ))}
        <View className="px-4 py-4 flex-row items-start gap-3">
          <Ticket size={20} color="rgba(255,255,255,0.5)" />
          <Text className="text-white/50 text-sm flex-1">
            <Text className="text-white font-primary-bold">M-Ticket:</Text>{' '}
            {BOOKING_M_TICKET_SHOW.replace('M-Ticket: ', '')}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
