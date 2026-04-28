import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventHeaderProps } from '@/interfaces/event-detail.interface';

export function EventHeader({ categories, title, date, time }: EventHeaderProps) {
  return (
    <View className="px-5 pt-4 pb-2 gap-3">
      {/* Category tags */}
      <View className="flex-row flex-wrap gap-2">
        {categories.map((c) => (
          <View key={c} className="bg-secondary rounded-full px-3 py-1">
            <Text className="text-secondary-foreground text-xs font-primary-medium">{c}</Text>
          </View>
        ))}
      </View>

      {/* Title */}
      <Text className="text-foreground text-2xl font-primary-bold leading-tight">{title}</Text>

      {/* Date + time */}
      <Text className="text-base font-primary-semibold" style={{ color: THEME.dark.primary }}>
        {date} , {time}
      </Text>
    </View>
  );
}
