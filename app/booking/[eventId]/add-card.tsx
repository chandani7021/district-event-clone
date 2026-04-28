import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { CardNicknameChip } from '@/components/booking/card-nickname-chip';
import { THEME } from '@/lib/theme';
import { COMMON_BACK } from '@/constants/profile.constants';
import type { CardNicknameType } from '@/interfaces/payment.interface';
import { bookingSession } from '@/services/booking.service';
import { BookingTimerBanner } from '@/components/booking/booking-timer-banner';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';
import {
  BOOKING_ADD_CARD_TITLE,
  BOOKING_ADD_CARD_DESC,
  BOOKING_CARD_NAME_PLACEHOLDER,
  BOOKING_CARD_NUMBER_PLACEHOLDER,
  BOOKING_CARD_EXPIRY_PLACEHOLDER,
  BOOKING_CARD_NICKNAME_PLACEHOLDER,
  BOOKING_CARD_NICK_PERSONAL,
  BOOKING_CARD_NICK_BUSINESS,
  BOOKING_CARD_NICK_OTHER,
  BOOKING_MAKE_PAYMENT_BTN,
} from '@/constants/booking.constants';
import { formatCardExpiry, formatCardNumber } from '@/lib/utils';

const NICKNAME_OPTIONS: { label: string; value: CardNicknameType }[] = [
  { label: BOOKING_CARD_NICK_PERSONAL, value: 'personal' },
  { label: BOOKING_CARD_NICK_BUSINESS, value: 'business' },
  { label: BOOKING_CARD_NICK_OTHER, value: 'other' },
];

export default function AddCardScreen() {
  const insets = useSafeAreaInsets();
  const { secondsLeft } = useActiveBookingTimer();

  const existing = bookingSession.get().savedCard;

  const [nameOnCard, setNameOnCard] = useState(existing?.nameOnCard ?? '');
  const [cardNumber, setCardNumber] = useState(existing?.cardNumber ?? '');
  const [expiryDate, setExpiryDate] = useState(existing?.expiryDate ?? '');
  const [nicknameType, setNicknameType] = useState<CardNicknameType | null>(
    existing?.nicknameType ?? null,
  );

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    setExpiryDate(formatCardExpiry(text));
  };

  const isFormValid =
    nameOnCard.trim().length > 0 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    nicknameType !== null;

  const handleMakePayment = () => {
    if (!isFormValid || nicknameType === null) return;

    bookingSession.set({
      savedCard: { nameOnCard, cardNumber, expiryDate, nickname: nicknameType, nicknameType },
      selectedPaymentMethod: { id: 'card', name: nameOnCard, group: 'cards' },
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: BOOKING_ADD_CARD_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',

        }}
      />

      {secondsLeft > 0 && <BookingTimerBanner secondsLeft={secondsLeft} />}

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Description */}
        <View className="flex-row items-center gap-2">
          <Lock size={16} color={THEME.dark.mutedForeground} />
          <Text className="text-sm text-muted-foreground flex-1">{BOOKING_ADD_CARD_DESC}</Text>
        </View>

        {/* Card inputs */}
        <View className="gap-3">
          <Input
            placeholder={BOOKING_CARD_NAME_PLACEHOLDER}
            value={nameOnCard}
            onChangeText={setNameOnCard}
            placeholderTextColor={THEME.dark.mutedForeground}
            className="h-14 text-base px-4"
            autoCapitalize="words"
          />

          <Input
            placeholder={BOOKING_CARD_NUMBER_PLACEHOLDER}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholderTextColor={THEME.dark.mutedForeground}
            className="h-14 text-base px-4"
            keyboardType="numeric"
            maxLength={19}
          />

          <Input
            placeholder={BOOKING_CARD_EXPIRY_PLACEHOLDER}
            value={expiryDate}
            onChangeText={handleExpiryChange}
            placeholderTextColor={THEME.dark.mutedForeground}
            className="h-14 text-base px-4"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        {/* Nickname chips — selecting one acts as the card label */}
        <View className="gap-3">
          <Text className="text-sm font-primary-medium text-muted-foreground">
            {BOOKING_CARD_NICKNAME_PLACEHOLDER}
          </Text>
          <View className="flex-row gap-3">
            {NICKNAME_OPTIONS.map((option) => (
              <CardNicknameChip
                key={option.value}
                label={option.label}
                value={option.value}
                selected={nicknameType === option.value}
                onPress={setNicknameType}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="px-4 pt-3 border-t border-border bg-background"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center bg-foreground"
          style={{ opacity: isFormValid ? 1 : 0.4 }}
          onPress={handleMakePayment}
          disabled={!isFormValid}
        >
          <Text className="text-background text-base font-primary-bold">{BOOKING_MAKE_PAYMENT_BTN}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
