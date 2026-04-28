import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { CalendarDays, Clock, Ticket } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { formatBookingDate, formatTime } from '@/lib/utils';
import type { BookingEventData, SelectedSeat, SelectedTicket, Show } from '../types/booking.types';

interface BookingSummaryStepProps {
  event: BookingEventData;
  show: Show;
  selectedSeats: SelectedSeat[];
  selectedTickets: SelectedTicket[];
  isBooking: boolean;
  onConfirm: () => void;
}

export function BookingSummaryStep({
  show,
  selectedSeats,
  selectedTickets,
  isBooking,
  onConfirm,
}: BookingSummaryStepProps) {
  const isSeated = selectedSeats.length > 0;
  const totalAmount = isSeated
    ? selectedSeats.reduce((sum, s) => sum + (s.pricing?.price ?? 0), 0)
    : selectedTickets.reduce((sum, t) => sum + t.type.price * t.quantity, 0);

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Event date/time info */}
        <View
          className="rounded-xl p-4 gap-3 mb-4"
          style={{ backgroundColor: THEME.dark.muted, borderWidth: 1, borderColor: THEME.dark.border }}>
          <View className="flex-row items-start gap-3">
            <CalendarDays size={16} color={THEME.dark.mutedForeground} style={{ marginTop: 2 }} />
            <View>
              <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>Date</Text>
              <Text className="text-sm font-primary-medium text-foreground">{formatBookingDate(show.date)}</Text>
            </View>
          </View>
          <View className="flex-row items-start gap-3">
            <Clock size={16} color={THEME.dark.mutedForeground} style={{ marginTop: 2 }} />
            <View>
              <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>Time</Text>
              <Text className="text-sm font-primary-medium text-foreground">
                {formatTime(show.start_time)}
                {show.end_time ? ` – ${formatTime(show.end_time)}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: THEME.dark.border, marginBottom: 16 }} />

        {/* Seats or tickets */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Ticket size={16} color={THEME.dark.mutedForeground} />
            <Text className="text-sm font-primary-semibold text-foreground">
              {isSeated ? 'Selected Seats' : 'Tickets'}
            </Text>
          </View>

          {isSeated ? (
            <View className="gap-2">
              {selectedSeats.map((seat) => (
                <View key={seat.id} className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-primary-medium text-foreground">{seat.label}</Text>
                    <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                      {seat.category?.label}
                    </Text>
                  </View>
                  {seat.pricing && (
                    <Text className="text-sm font-primary-semibold text-foreground">
                      ₹{seat.pricing.price.toLocaleString('en-IN')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="gap-2">
              {selectedTickets.map((st) => (
                <View key={st.type.id} className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-primary-medium text-foreground">{st.type.name}</Text>
                    <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                      {st.quantity} × ₹{st.type.price.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <Text className="text-sm font-primary-semibold text-foreground">
                    ₹{(st.type.price * st.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {totalAmount > 0 && (
          <>
            <View style={{ height: 1, backgroundColor: THEME.dark.border, marginVertical: 16 }} />
            <View className="flex-row items-center justify-between">
              <Text className="font-primary-semibold text-foreground">Total</Text>
              <Text className="text-lg font-primary-bold text-foreground">
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Confirm button */}
      <View className="mt-4" style={{ borderTopWidth: 1, borderTopColor: THEME.dark.border, paddingTop: 16 }}>
        <Pressable
          onPress={onConfirm}
          disabled={isBooking}
          style={({ pressed }) => ({
            backgroundColor: isBooking || pressed ? THEME.dark.secondaryForeground : THEME.dark.foreground,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          })}>
          {isBooking && <ActivityIndicator size="small" color={THEME.dark.background} />}
          <Text
            className="font-primary-semibold text-base"
            style={{ color: THEME.dark.background }}>
            {isBooking ? 'Confirming…' : 'Confirm Booking'}
          </Text>
        </Pressable>
        <Text
          className="text-xs text-center mt-2"
          style={{ color: THEME.dark.mutedForeground }}>
          By confirming you agree to our terms & conditions
        </Text>
      </View>
    </View>
  );
}
