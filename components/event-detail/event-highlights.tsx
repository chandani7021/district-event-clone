import { Dimensions, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventHighlightsProps } from '@/interfaces/event-detail.interface';

const CARD_WIDTH = Dimensions.get('window').width * 0.76;

export function EventHighlights({ highlights }: EventHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {highlights.map((item) => (
          <View
            key={item.id}
            className="rounded-2xl p-4"
            style={{ width: CARD_WIDTH, backgroundColor: THEME.dark.secondary }}>
            <View className='flex flex-row gap-2 items-center'>

              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              <Text className="text-foreground text-base font-primary-bold leading-snug">{item.title}</Text>
            </View>
            <Text className="text-sm" style={{ color: THEME.dark.mutedForeground }}>
              {item.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
