import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { BookingReviewSkeleton } from '@/components/booking/booking-review-skeleton';
import { Stack, useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Ticket, User, ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import { bookingSession, createBooking, invoiceDetailsStorage, PAYMENT_METHODS } from '@/services/booking.service';
import type { SelectedTicket, InvoiceDetails } from '@/interfaces/booking.interface';
import { BookingTimerBanner } from '@/components/booking/booking-timer-banner';
import { BookingSectionDivider } from '@/components/booking/booking-section-divider';
import { BookingPayBar } from '@/components/booking/booking-pay-bar';
import { InvoiceEditSheet } from '@/components/booking/invoice-edit-sheet';
import { RemoveTicketSheet } from '@/components/booking/remove-ticket-sheet';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';
import {
  BOOKING_REVIEW_TITLE,
  BOOKING_PAYMENT_SUMMARY,
  BOOKING_ORDER_AMOUNT,
  BOOKING_GRAND_TOTAL,
  BOOKING_REMOVE,
  BOOKING_M_TICKET_NOTICE,
  BOOKING_INVOICE_SECTION,
  BOOKING_INVOICE_INFO_NOTE,
  BOOKING_EDIT_BTN,
  BOOKING_CURRENCY_SYMBOL,
} from '@/constants/booking.constants';
import { COMMON_BACK } from '@/constants/profile.constants';
import { formatDate, formatTime } from '@/lib/utils';

export default function BookingReviewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const insets = useSafeAreaInsets();
  const event = DUMMY_EVENTS.find((e) => e.id === eventId) ?? DUMMY_EVENTS[0];
  const { secondsLeft } = useActiveBookingTimer();
  const [tickets, setTickets] = useState<SelectedTicket[]>(
    bookingSession.get().selectedTickets ?? [
      { ticketTypeId: 'tt_general', ticketTypeName: 'General', price: event.price_min, quantity: 1 },
    ],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(
    bookingSession.get().selectedPaymentMethod ?? PAYMENT_METHODS[0],
  );

  useFocusEffect(
    useCallback(() => {
      const session = bookingSession.get();
      if (session.selectedTickets?.length) setTickets(session.selectedTickets);
      setSelectedMethod(session.selectedPaymentMethod ?? PAYMENT_METHODS[0]);
    }, []),
  );
  const [inv, setInv] = useState<InvoiceDetails | undefined>(bookingSession.get().invoiceDetails);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [removeCandidate, setRemoveCandidate] = useState<{ id: string; name: string } | null>(null);

  // Load invoice details from session (set by index.tsx before navigating here) or persistent storage
  useEffect(() => {
    const existing = bookingSession.get().invoiceDetails;
    if (existing) {
      setInv(existing);
      return;
    }
    invoiceDetailsStorage.get().then((saved) => {
      if (saved) {
        bookingSession.set({ invoiceDetails: saved });
        setInv(saved);
      }
    });
  }, []);

  const session = bookingSession.get();
  // Use selected show dates from session if available, otherwise fall back to event date range
  const selectedShowDates = session.selectedShowDates ?? [];
  const dateStr = selectedShowDates.length > 0
    ? selectedShowDates.map((d) => formatDate(d)).join(', ')
    : event.end_date
      ? `${formatDate(event.date)} - ${formatDate(event.end_date)}`
      : formatDate(event.date);
  const timeStr = session.selectedShowId
    ? undefined // time comes from show; we don't have it here — only show date
    : formatTime(event.time);

  const orderAmount = tickets.reduce((sum, t) => sum + t.price, 0);
  const totalAmount = orderAmount;

  // Group tickets by name and unit price for a cleaner display
  const displayTickets = useMemo(() => {
    const groups: Record<string, SelectedTicket> = {};
    for (const t of tickets) {
      const unitPrice = t.quantity > 0 ? t.price / t.quantity : 0;
      const key = `${t.ticketTypeName}_${unitPrice}`;
      if (!groups[key]) {
        groups[key] = { ...t, price: 0, quantity: 0 };
      }
      groups[key].quantity += t.quantity;
      groups[key].price += t.price;
    }
    return Object.values(groups);
  }, [tickets]);

  const handleConfirmRemove = () => {
    if (!removeCandidate) return;
    // When removing a group, we remove all tickets that matched that group's name
    const updated = tickets.filter((t) => t.ticketTypeName !== removeCandidate.name);
    setRemoveCandidate(null);
    setTickets(updated);
    // Sync removal back to session so seat selection reflects it on back-navigation
    bookingSession.set({ selectedTickets: updated });
    if (updated.length === 0) {
      router.back();
    }
  };

  const handleSelectPayment = () => {
    router.push({ pathname: '/booking/[eventId]/payment-methods', params: { eventId: event.id } });
  };

  const handlePayNow = async () => {
    if (isProcessing) return;
    if (!inv) return;
    setIsProcessing(true);
    try {
      const booking = await createBooking(event.id, tickets, inv, selectedMethod);
      bookingSession.clear();
      router.push({
        pathname: '/booking/[eventId]/confirm',
        params: { eventId: event.id, bookingId: booking.bookingId },
      });
    } catch {
      router.push({
        pathname: '/booking/[eventId]/retry',
        params: { eventId: event.id },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveInvoice = (updated: InvoiceDetails) => {
    bookingSession.set({ invoiceDetails: updated });
    invoiceDetailsStorage.save(updated);
    setInv(updated);
    setShowEditSheet(false);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: false,
          title: BOOKING_REVIEW_TITLE,
        }}
      />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: THEME.dark.border,
          backgroundColor: THEME.dark.background,
        }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </Pressable>
        <View className="flex-1">
          <Text
            className="font-primary-bold text-foreground"
            style={{ fontSize: 17 }}
            numberOfLines={1}>
            {BOOKING_REVIEW_TITLE}
          </Text>
        </View>
      </View>

      {secondsLeft > 0 && <BookingTimerBanner secondsLeft={secondsLeft} />}

      {!inv && <BookingReviewSkeleton />}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        style={{ opacity: inv ? 1 : 0 }}
      >
        {/* Event info */}
        <View className="flex-row items-center gap-3 px-4 mt-4">
          <Image
            source={{ uri: event.coverImage }}
            className="w-20 h-20 rounded-[10px]"
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
          {/* Date/time */}
          <View className="px-4 py-4 border-b border-border">
            <Text className="text-foreground text-base font-primary-bold">
              {dateStr}
              {timeStr ? (
                <>
                  {'  '}
                  <Text className="text-muted-foreground">|</Text>
                  {'  '}
                  {timeStr}
                </>
              ) : null}
            </Text>
          </View>

          {/* Tickets */}
          {displayTickets.map((ticket, idx) => (
            <View key={`${ticket.ticketTypeName}-${idx}`} className="px-4 py-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground text-base font-primary-semibold">
                  {ticket.quantity} x {ticket.ticketTypeName}
                </Text>
                <Text className="text-foreground text-base font-primary-semibold">
                  {ticket.price === 0
                    ? '₹0'
                    : `${BOOKING_CURRENCY_SYMBOL}${ticket.price.toLocaleString('en-IN')}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setRemoveCandidate({ id: ticket.ticketTypeId, name: ticket.ticketTypeName })}
                className="mt-1 self-end"
              >
                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.mutedForeground, paddingBottom: 1.5 }}>
                  <Text className="text-sm font-primary-semibold text-muted-foreground">
                    {BOOKING_REMOVE}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          {/* M-Ticket notice */}
          <View className="px-4 py-4 flex-row items-center gap-3">
            <Ticket size={20} color={THEME.dark.mutedForeground} />
            <Text className="text-sm flex-1 text-muted-foreground">
              {BOOKING_M_TICKET_NOTICE}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <BookingSectionDivider label={BOOKING_PAYMENT_SUMMARY} />
        <View className="mx-4 rounded-xl overflow-hidden bg-card">
          <View className="px-4 py-4 border-b border-border flex-row justify-between">
            <Text className="text-foreground text-base">{BOOKING_ORDER_AMOUNT}</Text>
            <Text className="text-foreground text-base font-primary-semibold">
              {BOOKING_CURRENCY_SYMBOL}{orderAmount.toLocaleString('en-IN')}
            </Text>
          </View>
          <View className="px-4 py-4 flex-row justify-between">
            <Text className="text-foreground text-base font-primary-bold">{BOOKING_GRAND_TOTAL}</Text>
            <Text className="text-foreground text-base font-primary-bold">
              {BOOKING_CURRENCY_SYMBOL}{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Invoice details */}
        <BookingSectionDivider label={BOOKING_INVOICE_SECTION} />
        {inv ? (
          <View className="mx-4 rounded-xl overflow-hidden bg-card">
            <View className="px-4 py-4 border-b border-border">
              <View className="flex-row items-start justify-between">
                <View className="flex-row gap-3 flex-1">
                  <User size={20} color={THEME.dark.mutedForeground} />
                  <View className="flex-1 flex flex-col gap-1.5">
                    <Text className="text-foreground text-base font-primary-bold">{inv.name || "User"}</Text>
                    <Text className="text-sm text-muted-foreground">{inv.phone}</Text>
                    {inv.email && (
                      <Text className="text-sm text-muted-foreground">{inv.email}</Text>
                    )}
                    {inv.state && (
                      <Text className="text-sm text-muted-foreground">{inv.state}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowEditSheet(true)}>
                  <Text className="text-base text-muted-foreground">{BOOKING_EDIT_BTN}</Text>
                  <ChevronRight size={16} color={THEME.dark.mutedForeground} />

                </TouchableOpacity>
              </View>
            </View>
            <View className="px-4 py-3">
              <Text className="text-xs text-muted-foreground">{BOOKING_INVOICE_INFO_NOTE}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <BookingPayBar
        paymentMethodName={selectedMethod.name}
        totalAmount={totalAmount}
        isProcessing={isProcessing}
        disabled={tickets.length === 0}
        bottomInset={insets.bottom}
        onSelectPayment={handleSelectPayment}
        onPayNow={handlePayNow}
      />

      {inv && (
        <InvoiceEditSheet
          isVisible={showEditSheet}
          invoiceDetails={inv}
          onClose={() => setShowEditSheet(false)}
          onSave={handleSaveInvoice}
        />
      )}

      {removeCandidate && (
        <RemoveTicketSheet
          ticketName={removeCandidate.name}
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemoveCandidate(null)}
        />
      )}

    </View>
  );
}
