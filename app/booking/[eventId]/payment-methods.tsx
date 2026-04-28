import { useState, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { bookingSession, PAYMENT_METHODS } from '@/services/booking.service';
import type { PaymentMethodOption } from '@/interfaces/booking.interface';
import type { CardDetails } from '@/interfaces/payment.interface';
import { PaymentMethodRow } from '@/components/booking/payment-method-row';
import { PaymentGroupSection } from '@/components/booking/payment-group-section';
import { SavedCardRow } from '@/components/booking/saved-card-row';
import { LazyPayAccordionRow } from '@/components/booking/lazypay-accordion-row';
import { BookingTimerBanner } from '@/components/booking/booking-timer-banner';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';
import {
  BOOKING_PAYMENT_TITLE,
  BOOKING_RECOMMENDED_GROUP,
  BOOKING_CARDS_GROUP,
  BOOKING_WALLETS_GROUP,
  BOOKING_PAY_LATER_GROUP,
  BOOKING_NETBANKING_GROUP,
  BOOKING_UNAVAILABLE_BALANCE,
} from '@/constants/booking.constants';
import { COMMON_BACK } from '@/constants/profile.constants';

export default function PaymentMethodsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { secondsLeft } = useActiveBookingTimer();

  const [savedCard, setSavedCard] = useState<CardDetails | undefined>(
    bookingSession.get().savedCard,
  );
  const [currentMethodId, setCurrentMethodId] = useState(
    bookingSession.get().selectedPaymentMethod?.id ?? 'gpay',
  );

  useFocusEffect(
    useCallback(() => {
      const session = bookingSession.get();
      setSavedCard(session.savedCard);
      setCurrentMethodId(session.selectedPaymentMethod?.id ?? 'gpay');
    }, []),
  );

  const handleSelect = (method: PaymentMethodOption) => {
    if (method.unavailable) return;

    if (method.id === 'card') {
      router.push(`/booking/${eventId}/add-card`);
      return;
    }

    if (method.id === 'netbanking') {
      router.push(`/booking/${eventId}/select-bank`);
      return;
    }

    bookingSession.set({ selectedPaymentMethod: method });
    router.back();
  };

  const handleSelectSavedCard = () => {
    if (!savedCard) return;
    bookingSession.set({ selectedPaymentMethod: { id: 'card', name: savedCard.nameOnCard, group: 'cards' } });
    router.back();
  };

  const handleEditCard = () => {
    router.push(`/booking/${eventId}/add-card`);
  };

  const recommended = PAYMENT_METHODS.filter((m) => m.group === 'recommended');
  const wallets = PAYMENT_METHODS.filter((m) => m.group === 'wallets');
  const payLater = PAYMENT_METHODS.filter((m) => m.group === 'pay_later');
  const netbanking = PAYMENT_METHODS.filter((m) => m.group === 'netbanking');
  const cardMethod = PAYMENT_METHODS.find((m) => m.id === 'card') ?? { id: 'card', name: 'Add credit or debit cards', group: 'cards' as const };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: BOOKING_PAYMENT_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      {secondsLeft > 0 && <BookingTimerBanner secondsLeft={secondsLeft} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recommended */}
          <PaymentGroupSection label={BOOKING_RECOMMENDED_GROUP}>
            {recommended.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                selected={currentMethodId === method.id}
                onPress={() => handleSelect(method)}
              />
            ))}
          </PaymentGroupSection>

          {/* Cards */}
          <PaymentGroupSection label={BOOKING_CARDS_GROUP}>
            {savedCard ? (
              <SavedCardRow
                card={savedCard}
                selected={currentMethodId === 'card'}
                onPress={handleSelectSavedCard}
                onEdit={handleEditCard}
              />
            ) : (
              <PaymentMethodRow
                method={cardMethod}
                selected={false}
                onPress={() => handleSelect(cardMethod)}
                showAdd
              />
            )}
          </PaymentGroupSection>

          {/* Wallets */}
          <PaymentGroupSection label={BOOKING_WALLETS_GROUP}>
            {wallets.map((method) => (
              <View key={method.id}>
                <PaymentMethodRow
                  method={method}
                  selected={currentMethodId === method.id}
                  onPress={() => handleSelect(method)}
                  showAdd={method.id === 'amazon_wallet'}
                />
                {method.unavailable && (
                  <View className="mx-4 mb-2 px-3 py-2 rounded bg-destructive/10">
                    <Text className="text-xs text-destructive">
                      {BOOKING_UNAVAILABLE_BALANCE}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </PaymentGroupSection>

          {/* Pay Later */}
          <PaymentGroupSection label={BOOKING_PAY_LATER_GROUP}>
            {payLater.map((method) =>
              method.id === 'lazypay' ? (
                <LazyPayAccordionRow
                  key={method.id}
                  method={method}
                  onLink={() => handleSelect(method)}
                />
              ) : (
                <PaymentMethodRow
                  key={method.id}
                  method={method}
                  selected={currentMethodId === method.id}
                  onPress={() => handleSelect(method)}
                />
              ),
            )}
          </PaymentGroupSection>

          {/* Netbanking */}
          <PaymentGroupSection label={BOOKING_NETBANKING_GROUP}>
            {netbanking.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                selected={currentMethodId === method.id}
                onPress={() => handleSelect(method)}
              />
            ))}
          </PaymentGroupSection>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
