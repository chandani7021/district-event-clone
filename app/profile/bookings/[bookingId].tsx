import { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { getBookingById } from '@/services/booking.service';
import type { BookedTicket } from '@/interfaces/booking.interface';
import { BookingConfirmedHeader } from '@/components/booking/booking-confirmed-header';
import { BookingSectionDivider } from '@/components/booking/booking-section-divider';
import { BookingTicketQR } from '@/components/booking/booking-ticket-qr';
import { BookingVenueCard } from '@/components/booking/booking-venue-card';
import { BookingOrderDetails } from '@/components/booking/booking-order-details';
import { BookingHelpSection } from '@/components/booking/booking-help-section';
import {
  BOOKING_CONFIRMED_TITLE,
  BOOKING_M_TICKETS_SECTION,
  BOOKING_VENUE_SECTION,
  BOOKING_ORDER_DETAILS_SECTION,
  BOOKING_NEED_HELP_SECTION,
} from '@/constants/booking.constants';

export default function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const insets = useSafeAreaInsets();
  const [booking, setBooking] = useState<BookedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getBookingById(bookingId).then((b) => {
      setBooking(b);
      setLoading(false);
    });
  }, [bookingId]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [80, 180],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading || !booking) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0a3d1f]">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={THEME.dark.primary} />
      </View>
    );
  }

  const totalTickets = booking.tickets.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 16, 32) }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <BookingConfirmedHeader
          booking={booking}
          topInset={insets.top}
          onClose={() => router.back()}
        />

        {/* M-TICKETS */}
        <BookingSectionDivider label={BOOKING_M_TICKETS_SECTION} />
        <View className="mx-4">
          <BookingTicketQR
            confirmationCode={booking.confirmationCode}
            ticketIndex={1}
            totalTickets={totalTickets}
          />
        </View>

        {/* VENUE */}
        <BookingSectionDivider label={BOOKING_VENUE_SECTION} />
        <BookingVenueCard
          venueName={booking.venueName}
          venueAddress={booking.venueAddress}
        />

        {/* ORDER DETAILS */}
        <BookingSectionDivider label={BOOKING_ORDER_DETAILS_SECTION} />
        <BookingOrderDetails
          totalAmount={booking.totalAmount}
          invoiceDetails={booking.invoiceDetails}
          bookingId={booking.bookingId}
          tickets={booking.tickets}
        />

        {/* NEED HELP */}
        <BookingSectionDivider label={BOOKING_NEED_HELP_SECTION} />
        <BookingHelpSection />
      </Animated.ScrollView>

      {/* Scroll-reveal header */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: headerOpacity,
            paddingTop: insets.top,
            backgroundColor: THEME.dark.background,
            borderBottomWidth: 1,
            borderBottomColor: THEME.dark.border,
          },
        ]}
        pointerEvents="box-none"
      >
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} color={THEME.dark.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-primary-bold flex-1 text-center" numberOfLines={1}>
            {BOOKING_CONFIRMED_TITLE}
          </Text>
          <View className="w-10" />
        </View>
      </Animated.View>
    </View>
  );
}
