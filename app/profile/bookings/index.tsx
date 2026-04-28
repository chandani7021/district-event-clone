import { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation, ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { getBookingHistory } from '@/services/booking.service';
import type { BookedTicket } from '@/interfaces/booking.interface';
import {
  PROFILE_EVENT_TICKETS_TITLE,
  BOOKING_STATUS_BOOKED,
  BOOKING_VIEW_DETAILS,
  BOOKING_LOCATION_LABEL,
  BOOKING_NO_BOOKINGS_TITLE,
  BOOKING_NO_BOOKINGS_SUBTITLE,
} from '@/constants/booking.constants';
import { COMMON_BACK } from '@/constants/profile.constants';
import { formatDate, formatTime } from '@/lib/utils';

export default function EventBookingsScreen() {
  const [bookings, setBookings] = useState<BookedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getBookingHistory().then((data) => {
        setBookings(data);
        setLoading(false);
      });
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: PROFILE_EVENT_TICKETS_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={THEME.dark.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text className="text-foreground text-lg font-primary-semibold text-center">
            {BOOKING_NO_BOOKINGS_TITLE}
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            {BOOKING_NO_BOOKINGS_SUBTITLE}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-3"
          showsVerticalScrollIndicator={false}
        >
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onPress={() =>
                router.push({
                  pathname: '/profile/bookings/[bookingId]',
                  params: { bookingId: booking.bookingId },
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function BookingCard({ booking, onPress }: { booking: BookedTicket; onPress: () => void }) {
  const totalTickets = booking.tickets.reduce((sum, t) => sum + t.quantity, 0);
  const dateStr = booking.eventEndDate
    ? `${formatDate(booking.eventDate)} - ${formatDate(booking.eventEndDate)}`
    : formatDate(booking.eventDate);

  return (
    <View className="rounded-xl overflow-hidden bg-card">
      <View className="p-4">
        {/* Top row */}
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <Text className="text-foreground text-base font-primary-bold">{booking.eventTitle}</Text>
            <Text className="text-sm mt-1 text-muted-foreground">
              {dateStr} | {formatTime(booking.eventTime)}
            </Text>
            <Text className="text-sm mt-0.5 text-muted-foreground">
              {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
            </Text>
          </View>
          <Image
            source={{ uri: booking.coverImage }}
            className="w-16 h-16 rounded-lg"
          />
        </View>

        {/* Location */}
        <View className="mt-3 border-t border-border pt-3">
          <Text className="text-xs mb-1 text-muted-foreground">{BOOKING_LOCATION_LABEL}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-sm font-primary-semibold flex-1" numberOfLines={1}>
              {booking.venueName}
            </Text>
            <Navigation size={16} color={THEME.dark.mutedForeground} />
          </View>
        </View>

        {/* Footer */}
        <View className="mt-3 border-t border-border pt-3 flex-row items-center justify-between">
          <View className="px-3 py-1 rounded-md bg-[#16a34a20]">
            <Text className="text-sm font-primary-semibold text-[#16a34a]">
              {BOOKING_STATUS_BOOKED}
            </Text>
          </View>
          <TouchableOpacity onPress={onPress} className="flex-row items-center gap-1">
            <Text className="text-sm text-foreground">{BOOKING_VIEW_DETAILS}</Text>
            <ChevronRight size={14} color={THEME.dark.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
