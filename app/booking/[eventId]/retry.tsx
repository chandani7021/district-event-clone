import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import { bookingSession } from '@/services/booking.service';
import { BookingSectionDivider } from '@/components/booking/booking-section-divider';
import { BookingHelpSection } from '@/components/booking/booking-help-section';
import { BookingOrderDetails } from '@/components/booking/booking-order-details';
import {
  BOOKING_PAYMENT_FAILED_TITLE,
  BOOKING_PAYMENT_FAILED_SUBTITLE,
  BOOKING_ORDER_DETAILS_SECTION,
  BOOKING_NEED_HELP_SECTION,
  BOOKING_RETRY_BTN,
  BOOKING_CURRENCY_SYMBOL,
} from '@/constants/booking.constants';
import { formatDate, formatTime } from '@/lib/utils';

/** Orange circle with "!" error indicator */
function PaymentFailedIcon() {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', lineHeight: 44 }}>!</Text>
    </View>
  );
}

export default function BookingRetryScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const insets = useSafeAreaInsets();
  const event = DUMMY_EVENTS.find((e) => e.id === eventId) ?? DUMMY_EVENTS[0];
  const session = bookingSession.get();
  const tickets = session.selectedTickets ?? [];
  const inv = session.invoiceDetails;

  const dateStr = event.end_date
    ? `${formatDate(event.date)} - ${formatDate(event.end_date)}`
    : formatDate(event.date);

  const totalAmount = tickets.reduce((sum, t) => sum + t.price * t.quantity, 0);

  const handleRetry = () => {
    router.dismissAll();
    router.push({ pathname: '/events/[id]', params: { id: event.id } });
  };

  const handleBack = () => router.back();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 80, 96) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient header — error state */}
        <LinearGradient
          colors={['#0d3d1c', '#050e07']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-5 pb-10"
          style={{ paddingTop: insets.top + 12 }}
        >
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>

          <View className="items-center mt-6">
            <PaymentFailedIcon />
            <Text className="text-white text-2xl font-primary-bold text-center">
              {BOOKING_PAYMENT_FAILED_TITLE}
            </Text>
            <Text
              className="text-sm text-center mt-3 leading-5"
              style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 300 }}
            >
              {BOOKING_PAYMENT_FAILED_SUBTITLE}
            </Text>

            {/* Retry button inside gradient */}
            <TouchableOpacity
              onPress={handleRetry}
              className="mt-6 bg-white rounded-2xl py-4 px-10 items-center"
            >
              <Text className="text-background text-base font-primary-bold">{BOOKING_RETRY_BTN}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Event info */}
        <View className="flex-row items-center gap-3 px-4 mt-5">
          <Image
            source={{ uri: event.coverImage }}
            className="w-20 h-20 rounded-md"
          />
          <View className="flex-1">
            <Text className="text-foreground text-lg font-primary-bold">{event.title}</Text>
            <Text className="text-sm mt-1 text-muted-foreground">
              {event.venue_name}, {event.city_name}
            </Text>
          </View>
        </View>

        {/* Booking details card */}
        <View className="mx-4 mt-4 rounded-xl overflow-hidden bg-card">
          <View className="px-4 py-4 border-b border-border">
            <Text className="text-foreground text-base font-primary-bold">
              {dateStr}
              {'  '}
              <Text className="text-muted-foreground">|</Text>
              {'  '}
              {formatTime(event.time)}
            </Text>
          </View>
          {tickets.map((ticket) => (
            <View key={ticket.ticketTypeId} className="px-4 py-4 border-b border-border">
              <Text className="text-foreground text-base font-primary-semibold">
                {ticket.quantity} x {ticket.ticketTypeName}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Details */}
        <BookingSectionDivider label={BOOKING_ORDER_DETAILS_SECTION} />
        {inv ? (
          <BookingOrderDetails
            totalAmount={totalAmount}
            invoiceDetails={inv}
            tickets={tickets}
          />
        ) : (
          <View className="mx-4 rounded-xl overflow-hidden bg-card px-4 py-4 flex-row items-center justify-between">
            <Text className="text-foreground text-base font-primary-semibold">Total</Text>
            <Text className="text-foreground text-base font-primary-semibold">
              {BOOKING_CURRENCY_SYMBOL}{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        {/* Need Help */}
        <BookingSectionDivider label={BOOKING_NEED_HELP_SECTION} />
        <BookingHelpSection />
      </ScrollView>
    </View>
  );
}
