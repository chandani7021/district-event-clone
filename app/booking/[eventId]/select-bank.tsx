import { useState, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { BankListItem } from '@/components/booking/bank-list-item';
import { PopularBankItem } from '@/components/booking/popular-bank-item';
import { THEME } from '@/lib/theme';
import { POPULAR_BANKS, ALL_BANKS, bookingSession, PAYMENT_METHODS } from '@/services/booking.service';
import { BookingTimerBanner } from '@/components/booking/booking-timer-banner';
import { useActiveBookingTimer } from '@/features/booking/hooks/use-active-booking-timer';
import { COMMON_BACK } from '@/constants/profile.constants';
import type { BankOption } from '@/interfaces/payment.interface';
import {
  BOOKING_SELECT_BANK_TITLE,
  BOOKING_SEARCH_BANK_PLACEHOLDER,
  BOOKING_POPULAR_BANKS_LABEL,
  BOOKING_ALL_BANKS_LABEL,
} from '@/constants/booking.constants';

export default function SelectBankScreen() {
  const { secondsLeft } = useActiveBookingTimer();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return ALL_BANKS;
    const query = searchQuery.toLowerCase();
    return ALL_BANKS.filter((bank) => bank.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const showPopular = searchQuery.trim().length === 0;

  const handleBankSelect = (bank: BankOption) => {
    const netbankingMethod = PAYMENT_METHODS.find((m) => m.id === 'netbanking');
    if (netbankingMethod) {
      bookingSession.set({
        selectedPaymentMethod: { ...netbankingMethod, name: bank.name, subtext: 'Netbanking' },
      });
    }
    router.back();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: BOOKING_SELECT_BANK_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      {secondsLeft > 0 && <BookingTimerBanner secondsLeft={secondsLeft} />}

      {/* Search bar */}
      <View className="px-4 py-3 border-b border-border">
        <View className="flex-row items-center bg-card rounded-xl px-3 gap-2">
          <Search size={18} color={THEME.dark.mutedForeground} />
          <Input
            placeholder={BOOKING_SEARCH_BANK_PLACEHOLDER}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={THEME.dark.mutedForeground}
            className="flex-1 h-12 border-0 bg-transparent shadow-none"
          />
        </View>
      </View>

      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showPopular ? (
            <View>
              {/* Popular banks */}
              <Text className="text-base font-primary-semibold text-foreground px-4 pt-4 pb-3">
                {BOOKING_POPULAR_BANKS_LABEL}
              </Text>
              <View className="flex-row justify-between px-4 pb-4">
                {POPULAR_BANKS.map((bank) => (
                  <PopularBankItem key={bank.id} bank={bank} onPress={handleBankSelect} />
                ))}
              </View>
              <View className="h-px bg-border mx-4 mb-2" />
              <Text className="text-base font-primary-semibold text-foreground px-4 pt-2 pb-3">
                {BOOKING_ALL_BANKS_LABEL}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <BankListItem bank={item} onPress={handleBankSelect} />
        )}
      />
    </SafeAreaView>
  );
}
