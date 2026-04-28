import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Info, ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { InvoiceDetails } from '@/interfaces/booking.interface';
import { bookingSession, invoiceDetailsStorage } from '@/services/booking.service';
import { getSavedAccounts } from '@/services/accounts.service';
import { InvoiceDetailsSkeleton } from '@/components/booking/invoice-details-skeleton';
import {
  BOOKING_INVOICE_SECTION,
  BOOKING_ENTER_NAME,
  BOOKING_EMAIL_ADDRESS,
  BOOKING_SELECT_STATE,
  BOOKING_PHONE_NOTE,
  BOOKING_EMAIL_NOTE,
  BOOKING_STATE_NOTE,
  INDIAN_STATES,
} from '@/constants/booking.constants';
import { InvoiceForm, isValidEmail } from '@/components/booking/invoice-form';

export default function InvoiceDetailsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Pre-fill from saved accounts (phone number)
  useEffect(() => {
    getSavedAccounts().then((accounts) => {
      const active = accounts[0];
      if (active?.phone) {
        const digits = active.phone.replace(/^\+91/, '').replace(/^91/, '').trim();
        setPhone(digits);
      }
      if (active?.name) setName(active.name);
      if (active?.email) setEmail(active.email);
      setIsLoading(false);
    });
  }, []);

  const canSave = 
    name.trim().length > 0 && 
    isValidEmail(email) && 
    state.length > 0;

  const handleSave = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    if (!canSave) return;
    const details: InvoiceDetails = {
      name: name.trim(),
      phone: `+91${phone}`,
      email: email.trim(),
      state,
    };
    // Persist for future checkouts
    await invoiceDetailsStorage.save(details);
    // Also set in current session
    bookingSession.set({ invoiceDetails: details });
    router.replace({ pathname: '/booking/[eventId]/review', params: { eventId } });
  };

  const screenOptions = (
    <Stack.Screen
      options={{
        headerShown: false,
        title: BOOKING_INVOICE_SECTION,
      }}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        {screenOptions}
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
              {BOOKING_INVOICE_SECTION}
            </Text>
          </View>
        </View>
        <InvoiceDetailsSkeleton />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {screenOptions}

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
            {BOOKING_INVOICE_SECTION}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <InvoiceForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          state={state}
          setState={setState}
          emailError={emailError}
          setEmailError={setEmailError}
          showStatePicker={showStatePicker}
          setShowStatePicker={setShowStatePicker}
          containerClassName="gap-4"
          statePickerMaxHeight={260}
        />
      </ScrollView>

      {/* Save button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom + 8, 20),
          borderTopWidth: 1,
          borderTopColor: THEME.dark.border,
          backgroundColor: THEME.dark.background,
        }}>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className="w-full rounded-xl h-14 items-center justify-center"
          style={{ backgroundColor: canSave ? THEME.dark.foreground : THEME.dark.muted }}>
          <Text
            className="text-base font-primary-semibold"
            style={{ color: canSave ? THEME.dark.background : THEME.dark.mutedForeground }}>
            Continue
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
