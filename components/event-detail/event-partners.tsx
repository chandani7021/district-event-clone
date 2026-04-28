import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventPartnersProps } from '@/interfaces/event-detail.interface';
import { ED_PARTNERS } from '@/constants/event-detail.constants';

export function EventPartners({ partners }: EventPartnersProps) {
  return (
    <View className="mb-6">
      <Text
        className="text-xs font-primary-bold tracking-widest mb-3 px-5"
        style={{ color: THEME.dark.mutedForeground }}>
        {ED_PARTNERS}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {partners.map((partner, index) => (
          <View
            key={`${partner.role}-${index}`}
            className="rounded-xl p-4"
            style={{ backgroundColor: THEME.dark.secondary, minWidth: 140 }}>
            <Text
              className="text-xs mb-1"
              style={{ color: THEME.dark.mutedForeground }}>
              {partner.role}
            </Text>
            <Text className="text-foreground text-base font-primary-bold">{partner.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
