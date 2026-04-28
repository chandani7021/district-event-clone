import { useCallback, useEffect, useRef, useState } from 'react';
import { bookingSession, invoiceDetailsStorage } from '@/services/booking.service';
import { TIMER_INITIAL_SECONDS } from '@/constants/booking.constants';
import type { SelectedTicket as SessionTicket } from '@/interfaces/booking.interface';
import {
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useBooking } from '@/features/booking/hooks/use-booking';
import { DateTimePicker } from '@/features/booking/components/date-time-picker';
import { TicketSelectionStep } from '@/features/booking/components/ticket-selection-step';
import { SeatSelectionStep } from '@/features/booking/components/seat-selection-step';
import { BookingSummaryStep } from '@/features/booking/components/booking-summary-step';
import type { BookingEventData, Show, SelectedSeat, TicketType } from '@/features/booking/types/booking.types';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';
import { BookingTimerBanner } from '@/components/booking/booking-timer-banner';
import { ReplaceTicketsSheet } from '@/components/booking/replace-tickets-sheet';
import { BookingScreenSkeleton } from '@/components/booking/booking-screen-skeleton';
import { checkSession } from '@/services/auth.service';
import { GuestPanel } from '@/components/auth/guest-panel';
import { LoginPanel } from '@/components/auth/login-panel';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { DEFAULT_COUNTRY } from '@/constants/countries';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { TermsFooter } from '@/components/auth/terms-footer';

export default function BookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    eventId: string;
    title: string;
    subtitle: string;
    seating_type: 'seated' | 'non_seated';
    price_min: string;
    price_max: string;
    currency: string;
  }>();

  const event: BookingEventData = {
    id: params.eventId ?? '',
    title: params.title ?? '',
    seating_type: params.seating_type ?? 'non_seated',
    price_min: Number(params.price_min ?? 0),
    price_max: Number(params.price_max ?? 0),
    currency: params.currency ?? '₹',
  };

  const {
    state,
    loadShows,
    selectDate,
    selectShow,
    clearAllSelections,
    restoreSelection,
    addSeat,
    removeSeat,
    setTicketQty,
    confirmBooking,
    goBack,
    canGoBack,
  } = useBooking(event);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoginPanelVisible, setIsLoginPanelVisible] = useState(false);
  const [loginKey, setLoginKey] = useState(0);
  const [panelAutoFocus, setPanelAutoFocus] = useState(false);

  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const HIDDEN_Y = SCREEN_HEIGHT;

  const loginTranslateY = useSharedValue(SCREEN_HEIGHT);
  const loginTopRadius = useSharedValue(24);

  const loginAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: loginTranslateY.value }],
    borderTopLeftRadius: loginTopRadius.value,
    borderTopRightRadius: loginTopRadius.value,
  }));

  useFocusEffect(
    useCallback(() => {
      checkSession().then((res) => setIsAuthenticated(res.isAuthenticated));
    }, [])
  );

 

  const showLoginSheet = () => {
    setPanelAutoFocus(false);
    setIsLoginPanelVisible(true);
    loginTranslateY.value = withSpring(SCREEN_HEIGHT * 0.4, { damping: 25, stiffness: 200 });
    loginTopRadius.value = withSpring(24, { damping: 25, stiffness: 200 });
  };

  const hideLoginSheet = () => {
    Keyboard.dismiss();
    setIsLoginPanelVisible(false);
    setPanelAutoFocus(false);
    loginTopRadius.value = withSpring(24, { damping: 25, stiffness: 200 });
    loginTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 25, stiffness: 200 });
  };

  const handlePhoneFocus = () => {
    setPanelAutoFocus(true);
    setIsLoginPanelVisible(true);
    // Use fast timing for guaranteed zero-position expansion
    loginTranslateY.value = withTiming(0, { duration: 250 });
    loginTopRadius.value = withTiming(0, { duration: 250 });
  };
  const handleSelectDate = (date: string) => {
    selectDate(date, state.step);
  };

  const handleSelectShow = (show: Show) => {
    selectShow(show, state.step);
  };

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  const { secondsLeft } = useActiveBookingTimer();

  const isSeated = event.seating_type === 'seated';

  // Restore selected show+date from session after shows load (handles back-navigation state loss)
  const hasRestoredShowRef = useRef(false);
  useEffect(() => {
    if (state.shows.length === 0 || hasRestoredShowRef.current) return;
    hasRestoredShowRef.current = true;
    const session = bookingSession.get();
    if (session.eventId !== event.id || !session.selectedShowId) return;
    const savedShow = state.shows.find((s) => s.id === session.selectedShowId);
    if (savedShow) restoreSelection(savedShow, session.selectedDate ?? savedShow.date);
  }, [state.shows, event.id, restoreSelection]);

  // Restore tickets/seats from session after shows load (handles back-navigation state loss)
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (state.shows.length === 0 || hasRestoredRef.current) return;
    if (!isSeated && state.ticketTypes.length === 0) return;

    // Lock immediately — before any session checks — so that any dep change
    // (e.g. addSeat changing when user switches show) never triggers a second restore.
    hasRestoredRef.current = true;

    const session = bookingSession.get();
    if (session.eventId !== event.id) return;

    const sessionTickets = session.selectedTickets;
    if (!sessionTickets?.length) return;

    if (isSeated) {
      // Pass selectedShowId explicitly — state.selectedShow may not be set yet in this render cycle
      const restoredShowId = session.selectedShowId;
      for (const st of sessionTickets) {
        addSeat({
          id: st.ticketTypeId,
          label: st.ticketTypeName,
          category: { label: 'Seat' },
          pricing: { price: st.price, formattedPrice: `\u20B9${st.price.toLocaleString('en-IN')}` }
        }, restoredShowId);
      }
    } else {
      for (const st of sessionTickets) {
        const ticketType = state.ticketTypes.find((tt) => tt.id === st.ticketTypeId);
        if (ticketType && st.quantity > 0) setTicketQty(ticketType, st.quantity);
      }
    }
  }, [state.shows, state.ticketTypes, isSeated, event.id, addSeat, setTicketQty]);
  // Sync seats/tickets removed on the review screen back to this screen's state.
  // Use a ref for selectedSeats so the effect only runs on focus, not on every seat change.
  const [seatsToDeselect, setSeatsToDeselect] = useState<string[]>([]);
  const selectedSeatsRef = useRef(state.selectedSeats);
  selectedSeatsRef.current = state.selectedSeats;
  const selectedTicketsRef = useRef(state.selectedTickets);
  selectedTicketsRef.current = state.selectedTickets;
  useFocusEffect(
    useCallback(() => {
      const session = bookingSession.get();
      if (session.eventId !== event.id) return;
      const sessionIds = new Set((session.selectedTickets ?? []).map((t) => t.ticketTypeId));

      if (isSeated) {
        const removedIds = selectedSeatsRef.current.filter((s) => !sessionIds.has(s.id)).map((s) => s.id);
        if (removedIds.length > 0) {
          setSeatsToDeselect(removedIds);
          for (const id of removedIds) removeSeat(id);
        }
      } else {
        // For non-seated events, zero out any ticket types removed on the review screen
        for (const t of selectedTicketsRef.current) {
          if (!sessionIds.has(t.type.id)) {
            setTicketQty(t.type, 0);
          }
        }
      }
    }, [isSeated, event.id, removeSeat, setTicketQty]),
  );

  const totalTickets = state.selectedTickets.reduce((s, t) => s + t.quantity, 0);
  const totalSeats = state.selectedSeats.length;
  const totalAmount = isSeated
    ? state.selectedSeats.reduce((s, seat) => s + (seat.pricing?.price ?? 0), 0)
    : state.selectedTickets.reduce((s, t) => s + t.type.price * t.quantity, 0);

  const canProceed = isSeated
    ? (state.step === 'seats' ? totalSeats > 0 : state.selectedShow !== null)
    : (totalTickets > 0 && state.selectedShow !== null);

  const navigateToReview = async (pendingSeats?: SelectedSeat[]) => {
    // Eagerly flush current selection to session before navigating so review always reads fresh data.
    // For zone-based seated flows, onContinue is called in the same synchronous tick as the seat
    // dispatches, so state.selectedSeats is still the pre-add snapshot. pendingSeats carries those
    // newly added seats so the session is written correctly.
    const allSeats = pendingSeats
      ? [...state.selectedSeats, ...pendingSeats]
      : state.selectedSeats;

    const sessionTickets: SessionTicket[] = isSeated
      ? allSeats.map((seat) => ({
        ticketTypeId: seat.id,
        ticketTypeName: seat.label ?? 'Seat',
        price: seat.pricing?.price ?? event.price_min,
        quantity: 1,
      }))
      : state.selectedTickets.map((t) => ({
        ticketTypeId: t.type.id,
        ticketTypeName: t.type.name,
        price: t.type.price * t.quantity,
        quantity: t.quantity,
      }));

    if (sessionTickets.length > 0) {
      const existing = bookingSession.get();
      const selectedShowDates = isSeated
        ? Object.values(state.selectedShows).map((s) => s.date).sort()
        : state.selectedDate
          ? [state.selectedDate]
          : [];
      bookingSession.set({
        eventId: event.id,
        eventTitle: event.title,
        selectedTickets: sessionTickets,
        selectedShowId: state.selectedShow?.id,
        selectedDate: state.selectedDate ?? undefined,
        selectedShowDates: selectedShowDates.length > 0 ? selectedShowDates : undefined,
        timerEndTime: existing.timerEndTime ?? Date.now() + TIMER_INITIAL_SECONDS * 1000,
      });
    }
    // If invoice details are already saved, go straight to review; otherwise collect them first.
    const savedInvoice = await invoiceDetailsStorage.get();
    if (savedInvoice) {
      bookingSession.set({ invoiceDetails: savedInvoice });
      router.push({ pathname: '/booking/[eventId]/review', params: { eventId: params.eventId ?? event.id } });
    } else {
      router.push({ pathname: '/booking/[eventId]/invoice-details', params: { eventId: params.eventId ?? event.id } });
    }
  };

  const [showReplacePrompt, setShowReplacePrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const existingSessionEventTitle = useRef<string | null>(null);

   useEffect(() => {
    if (isAuthenticated && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [isAuthenticated, pendingAction]);

  const checkAndPromptReplace = (action: () => void) => {
    const session = bookingSession.get();
    const isOtherEventActive =
      session.eventId &&
      session.eventId !== event.id &&
      session.timerEndTime !== undefined &&
      session.timerEndTime > Date.now();

    if (isOtherEventActive) {
      existingSessionEventTitle.current = session.eventTitle ?? 'another event';
      setPendingAction(() => action);
      setShowReplacePrompt(true);
      return true;
    }
    return false;
  };

  const handleAddSeat = (seat: SelectedSeat) => {
    if (!isAuthenticated) {
      setPendingAction(() => () => handleAddSeat(seat));
      setShowLoginPrompt(true);
      return;
    }
    if (!checkAndPromptReplace(() => addSeat(seat))) {
      addSeat(seat);
    }
  };

  const handleSetTicketQty = (ticketType: TicketType, quantity: number) => {
    if (!isAuthenticated) {
      setPendingAction(() => () => handleSetTicketQty(ticketType, quantity));
      setShowLoginPrompt(true);
      return;
    }
    // Only prompt if increasing quantity
    const currentQty = state.selectedTickets.find((t) => t.type.id === ticketType.id)?.quantity ?? 0;
    if (quantity > currentQty) {
      if (!checkAndPromptReplace(() => setTicketQty(ticketType, quantity))) {
        setTicketQty(ticketType, quantity);
      }
    } else {
      setTicketQty(ticketType, quantity);
    }
  };

  const handleContinue = (pendingSeats?: SelectedSeat[]) => {
    if (state.step === 'summary') {
      confirmBooking();
    } else {
      if (!checkAndPromptReplace(() => navigateToReview(pendingSeats))) {
        navigateToReview(pendingSeats);
      }
    }
  };

  const seatBackHandlerRef = useRef<(() => void) | null>(null);

  const handleBack = () => {
    if (seatBackHandlerRef.current) {
      seatBackHandlerRef.current();
      return;
    }
    if (canGoBack) goBack();
    else router.back();
  };

  // ── Success ───────────────────────────────────────────────
  if (state.isSuccess) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.dark.background }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-8">
          <CheckCircle2 size={72} color="#22c55e" />
          <Text className="text-2xl font-primary-bold text-foreground text-center mt-5">
            Booking Confirmed!
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: THEME.dark.mutedForeground }}>
            Your booking has been confirmed.
          </Text>
          {state.bookingId && (
            <View
              className="mt-4 px-5 py-3 rounded-2xl items-center"
              style={{ backgroundColor: THEME.dark.muted }}>
              <Text className="text-xs mb-1" style={{ color: THEME.dark.mutedForeground }}>
                Booking ID
              </Text>
              <Text className="text-lg font-primary-bold text-foreground">{state.bookingId}</Text>
            </View>
          )}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              marginTop: 36,
              backgroundColor: pressed ? '#e5e5e5' : THEME.dark.foreground,
              borderRadius: 14,
              paddingVertical: 16,
              paddingHorizontal: 48,
            })}>
            <Text className="font-primary-bold text-base" style={{ color: THEME.dark.background }}>
              Done
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: THEME.dark.background, position: 'relative' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: THEME.dark.border,
        }}>
        <Pressable
          onPress={handleBack}
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
            {event.title}
          </Text>
          {params.subtitle ? (
            <Text
              className="text-sm mt-0.5"
              style={{ color: THEME.dark.mutedForeground }}
              numberOfLines={1}>
              {params.subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {secondsLeft > 0 && bookingSession.get().eventId === event.id && <BookingTimerBanner secondsLeft={secondsLeft} />}

      {/* Loading */}
      {state.isLoadingShows && <BookingScreenSkeleton />}

      {/* Error */}
      {!state.isLoadingShows && state.error && (
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text
            className="text-sm text-center"
            style={{ color: THEME.dark.mutedForeground }}>
            {state.error}
          </Text>
          <Pressable
            onPress={loadShows}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#e5e5e5' : THEME.dark.foreground,
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 24,
            })}>
            <Text className="font-primary-semibold" style={{ color: THEME.dark.background }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      )}

      {/* Main content */}
      {!state.isLoadingShows && !state.error && (
        <View style={{ flex: 1 }}>
          {/* Summary step */}
          {state.step === 'summary' && state.selectedShow ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 120,
              }}>
              <BookingSummaryStep
                event={event}
                show={state.selectedShow}
                selectedSeats={state.selectedSeats}
                selectedTickets={state.selectedTickets}
                isBooking={state.isBooking}
                onConfirm={confirmBooking}
              />
            </ScrollView>
          ) : (
            /* Seats step (seated events) */
            state.step === 'seats' && state.selectedShow ? (
              <View style={{ flex: 1 }}>
                <SeatSelectionStep
                  show={state.selectedShow}
                  selectedSeats={state.selectedSeats}
                  onSeatAdded={handleAddSeat}
                  onSeatRemoved={removeSeat}
                  onContinue={handleContinue}
                  onRegisterBackHandler={(handler) => { seatBackHandlerRef.current = handler; }}
                  pricePerSeat={event.price_min || undefined}
                  seatsToDeselect={seatsToDeselect}
                  hasPreviousSeats={
                    state.selectedSeats.length > 0 &&
                    !!state.selectedSeatsShowId &&
                    state.selectedSeatsShowId !== state.selectedShow?.id
                  }
                  onClearSeats={clearAllSelections}
                />
              </View>
            ) : (
              /* Main single-page: date/time + tickets */
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 20,
                  paddingBottom: 120,
                  gap: 28,
                }}>

                {/* Date & time picker */}
                {(state.availableDates.length > 0 || state.shows.length > 0) && (
                  <DateTimePicker
                    shows={state.shows}
                    availableDates={state.availableDates}
                    selectedDate={state.selectedDate}
                    selectedShow={state.selectedShow}
                    onSelectDate={handleSelectDate}
                    onSelectShow={handleSelectShow}
                  />
                )}



                {/* Divider */}
                {!isSeated && state.ticketTypes.length > 0 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: THEME.dark.border,
                      marginHorizontal: -20,
                    }}
                  />
                )}

                {/* Ticket selection (non-seated only) */}
                {!isSeated && state.ticketTypes.length > 0 && (
                  <TicketSelectionStep
                    ticketTypes={state.ticketTypes}
                    selectedTickets={state.selectedTickets}
                    onSetQuantity={handleSetTicketQty}
                  />
                )}
              </ScrollView>
            )
          )}

          {/* Sticky footer — only show when user can actually proceed */}
          {state.step !== 'summary' && state.step !== 'seats' && canProceed && (
            <View
              className='absolute bottom-0 left-0 right-0 px-5 pt-3.5 border-t border-border bg-background'
              style={{ paddingBottom: Math.max(insets.bottom + 8, 20) }}

            >
              <View className="flex-row items-center justify-between gap-3">
                <View>
                  <Text style={{ color: THEME.dark.mutedForeground, fontSize: 12 }}>
                    {isSeated
                      ? `${totalSeats} seat${totalSeats !== 1 ? 's' : ''}`
                      : `${totalTickets} ticket${totalTickets !== 1 ? 's' : ''}`}
                  </Text>
                  {totalAmount > 0 && (
                    <Text className="text-xl font-primary-bold text-foreground">
                      {'\u20B9'}{totalAmount.toLocaleString('en-IN')}
                    </Text>
                  )}
                </View>
                <Pressable
                  onPress={() => handleContinue()}
                  disabled={state.isBooking}
                  className="w-1/2 rounded-xl p-4 items-center justify-between bg-foreground">
                  <Text className="font-primary-bold text-base text-background">
                    Checkout
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {showReplacePrompt && existingSessionEventTitle.current && (
        <ReplaceTicketsSheet
          newEventTitle={event.title}
          existingEventTitle={existingSessionEventTitle.current}
          onProceed={() => {
            bookingSession.clear();
            setShowReplacePrompt(false);
            if (pendingAction) {
              pendingAction();
              setPendingAction(null);
            }
          }}
          onCancel={() => {
            setShowReplacePrompt(false);
            setPendingAction(null);
          }}
        />
      )}
      {/* Login Prompt Sheet (Guest Panel) */}
      {showLoginPrompt && !isLoginPanelVisible && (
        <Pressable
          className="absolute inset-0 bg-black/60 z-[35]"
          style={{ top: -insets.top }}
          onPress={() => setShowLoginPrompt(false)}
        />
      )}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
        <BottomSheet
          isVisible={showLoginPrompt && !isLoginPanelVisible}
          onClose={() => setShowLoginPrompt(false)}
          coverage={0.5}
          isInline
          style={{ zIndex: 40 }}
          footer={<TermsFooter />}>
          <GuestPanel
            onUseAnotherLogin={showLoginSheet}
            selectedCountry={DEFAULT_COUNTRY}
            onPhoneFocus={handlePhoneFocus}
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              setShowLoginPrompt(false);
            }}
          />
        </BottomSheet>
      </View>

      {isLoginPanelVisible && (
        <Pressable
          className="absolute inset-0 bg-black/60 z-[45]"
          style={{ top: -insets.top }}
          onPress={hideLoginSheet}
        />
      )}

      {isLoginPanelVisible && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              backgroundColor: THEME.dark.card,
              overflow: 'hidden',
              height: SCREEN_HEIGHT,
              zIndex: 50,
            },
            loginAnimatedStyle,
          ]}
          pointerEvents="auto"
        >
          <ScrollView
            className="flex-1"
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: panelAutoFocus ? Math.max(24, insets.top) : 24,
              paddingBottom: Math.max(32, insets.bottom + 16),
            }}
          >
            <LoginPanel
              selectedCountry={DEFAULT_COUNTRY}
              onPhoneFocus={handlePhoneFocus}
              onBack={hideLoginSheet}
              insetTop={0}
              autoFocus={false}
              returnTo="back"
              onOtpSent={() => {
                hideLoginSheet();
                setShowLoginPrompt(false);
              }}
            />
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
