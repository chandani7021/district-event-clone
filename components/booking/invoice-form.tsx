import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp, Info, AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  BOOKING_ENTER_NAME,
  BOOKING_EMAIL_ADDRESS,
  BOOKING_SELECT_STATE,
  BOOKING_PHONE_NOTE,
  BOOKING_EMAIL_NOTE,
  BOOKING_STATE_NOTE,
  INDIAN_STATES,
} from '@/constants/booking.constants';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (val: string) => {
  if (!val) return false;
  return EMAIL_REGEX.test(val.trim());
};

interface InvoiceFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  state: string;
  setState: (val: string) => void;
  emailError: string;
  setEmailError: (val: string) => void;
  showStatePicker: boolean;
  setShowStatePicker: (val: boolean) => void;
  containerClassName?: string;
  statePickerMaxHeight?: number;
}

export function InvoiceForm({
  name,
  setName,
  email,
  setEmail,
  phone,
  state,
  setState,
  emailError,
  setEmailError,
  showStatePicker,
  setShowStatePicker,
  statePickerMaxHeight = 220,
}: InvoiceFormProps) {
  
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('');
    } else {
      const valid = EMAIL_REGEX.test(text.trim());
      setEmailError(valid ? '' : 'Please enter a valid email address');
    }
  };

  return (
    <View className={'gap-4'}>
      {/* Name */}
      <View className="border border-border rounded-xl bg-card">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={BOOKING_ENTER_NAME}
          placeholderTextColor={THEME.dark.mutedForeground}
          className="text-foreground text-base p-4 "
        />
      </View>

      {/* Phone (read-only) */}
      <View>
        <View className="flex-row gap-2">
          <View className="border border-border rounded-xl p-2 flex-row items-center gap-2 bg-card w-24">
            <Text className="text-lg">🇮🇳</Text>
            <Text className="text-base text-foreground">91</Text>
          </View>
          <View className="flex-1 border border-border rounded-xl px-4 py-4 justify-center bg-card">
            <Text className="text-base text-foreground">{phone}</Text>
          </View>
        </View>
        <View className="flex-row items-start gap-2 mt-3 px-1">
          <Info size={13} style={{ marginTop: 3 }} color={THEME.dark.mutedForeground} />
          <Text className="text-sm flex-1 text-muted-foreground leading-normal">{BOOKING_PHONE_NOTE}</Text>
        </View>
      </View>

      {/* Email */}
      <View>
        <View
          className="border rounded-xl bg-card"
          style={{ borderColor: emailError ? THEME.dark.destructive : THEME.dark.border }}>
          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            placeholder={BOOKING_EMAIL_ADDRESS}
            placeholderTextColor={THEME.dark.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="text-foreground text-base p-4"
          />
        </View>
        {emailError ? (
          <View className="flex-row items-start gap-1.5 mt-3 px-1">
            <AlertCircle size={12} color={THEME.dark.destructive} style={{ marginTop: 3 }} />
            <Text className="text-destructive text-sm flex-1 font-primary-semibold leading-normal">
              {emailError}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-start gap-2 mt-3 px-1">
            <Info size={12} style={{ marginTop: 3 }} color={THEME.dark.mutedForeground} />
            <Text className="text-sm flex-1 text-muted-foreground leading-normal">{BOOKING_EMAIL_NOTE}</Text>
          </View>
        )}
      </View>

      {/* State picker */}
      <View>
        <TouchableOpacity
          className="border border-border rounded-xl px-4 py-4 flex-row items-center justify-between bg-card"
          onPress={() => setShowStatePicker(!showStatePicker)}>
          <Text className={`text-base ${state ? 'text-foreground' : 'text-muted-foreground'}`}>
            {state || BOOKING_SELECT_STATE}
          </Text>
          {showStatePicker
            ? <ChevronUp size={20} color={THEME.dark.mutedForeground} />
            : <ChevronDown size={20} color={THEME.dark.mutedForeground} />}
        </TouchableOpacity>

        {showStatePicker && (
          <View
            className="rounded-xl border border-border bg-card overflow-hidden mt-2"
            style={{ maxHeight: statePickerMaxHeight }}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {INDIAN_STATES.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-4 py-3 border-b border-border"
                  onPress={() => { setState(item); setShowStatePicker(false); }}>
                  <Text className={`text-base ${state === item ? 'text-primary font-primary-bold' : 'text-foreground'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="flex-row items-start gap-2 mt-3 px-1">
          <Info size={13} color={THEME.dark.mutedForeground} />
          <Text className="text-sm flex-1 text-muted-foreground">{BOOKING_STATE_NOTE}</Text>
        </View>
      </View>
    </View>
  );
}
