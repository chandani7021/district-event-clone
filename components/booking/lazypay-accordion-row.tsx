import { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { PaymentMethodIcon } from '@/components/booking/payment-method-icon';
import { THEME } from '@/lib/theme';
import type { PaymentMethodOption } from '@/interfaces/booking.interface';
import {
  BOOKING_LAZYPAY_MOBILE_PLACEHOLDER,
  BOOKING_LAZYPAY_LINK_BTN,
  BOOKING_ADD_BTN,
} from '@/constants/booking.constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LazyPayAccordionRowProps {
  method: PaymentMethodOption;
  onLink?: (mobile: string) => void;
}

export function LazyPayAccordionRow({ method, onLink }: LazyPayAccordionRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [mobile, setMobile] = useState('');

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleLink = () => {
    if (mobile.length === 10) {
      onLink?.(mobile);
    }
  };

  return (
    <View className="border-b border-border">
      <TouchableOpacity
        className="flex-row items-center px-4 py-4"
        onPress={handleToggle}
      >
        <View className="mr-3">
          <PaymentMethodIcon methodId={method.id} size={40} />
        </View>

        <View className="flex-1">
          <Text className="text-foreground text-base font-primary-semibold">{method.name}</Text>
          {method.subtext ? (
            <Text className="text-xs mt-0.5 text-muted-foreground">{method.subtext}</Text>
          ) : null}
        </View>

        {expanded ? (
          <ChevronUp size={18} color={THEME.dark.mutedForeground} />
        ) : (
          <Text className="text-sm font-primary-bold text-foreground">
            {BOOKING_ADD_BTN}
          </Text>
        )}
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 pb-4 gap-3">
          <Input
            placeholder={BOOKING_LAZYPAY_MOBILE_PLACEHOLDER}
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor={THEME.dark.mutedForeground}
            className="h-14 text-base px-4"
            keyboardType="phone-pad"
            maxLength={10}
            autoFocus
          />
          <TouchableOpacity
            className={`h-14 rounded-xl items-center justify-center ${mobile.length === 10 ? 'bg-foreground' : 'bg-muted opacity-50'}`}
            onPress={handleLink}
            disabled={mobile.length !== 10}
          >
            <Text className="text-background text-base font-primary-bold">{BOOKING_LAZYPAY_LINK_BTN}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
