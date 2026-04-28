import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventBookingBarProps } from '@/interfaces/event-detail.interface';
import {
  ED_BOOK_TICKETS,
  ED_ONWARDS,
  ED_SOLD_OUT,
} from '@/constants/event-detail.constants';
import { getSaleLabel } from '@/lib/utils';



export function EventBookingBar({
  priceMin,
  currency,
  saleStatus,
  onBookPress,
  onSaleLabelPress,
  hasSaleTimeline,
}: EventBookingBarProps) {
  const insets = useSafeAreaInsets();
  const saleLabel = getSaleLabel(saleStatus);
  const isSoldOut = saleStatus === 'sold_out';

  return (
    <View className="absolute left-0 right-0 bottom-0">
      

      {/* Bottom bar */}
      <View
        className="flex-row items-center justify-between px-5 py-3"
        style={{
          backgroundColor: THEME.dark.card,
          paddingBottom: Math.max(16, insets.bottom + 8),
        }}>
        {/* Price info */}
        <View>
          {hasSaleTimeline && (
            <Pressable onPress={onSaleLabelPress} hitSlop={8}>
              <Text className="text-xs font-primary-semibold" style={{ color: THEME.dark.primary }}>{saleLabel}</Text>
            </Pressable>
          )}
          <Text className="text-foreground text-base font-primary-bold">
            {currency}
            {priceMin.toLocaleString('en-IN')}{' '}
            <Text className="text-sm font-normal" style={{ color: THEME.dark.mutedForeground }}>
              {ED_ONWARDS}
            </Text>
          </Text>
        </View>

        {/* Book button */}
        <Pressable
          onPress={onBookPress}
          disabled={isSoldOut}
          className="px-6 py-3 rounded-full"
          style={{
            backgroundColor: isSoldOut ? THEME.dark.muted : THEME.dark.foreground,
          }}>
          <Text
            className="text-sm font-primary-bold"
            style={{ color: isSoldOut ? THEME.dark.mutedForeground : THEME.dark.background }}>
            {isSoldOut ? ED_SOLD_OUT : ED_BOOK_TICKETS}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
