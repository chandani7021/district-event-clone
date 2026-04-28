import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import type { EventAboutSectionProps } from '@/interfaces/event-detail.interface';
import { ED_ABOUT_EVENT, ED_READ_MORE } from '@/constants/event-detail.constants';

export function EventAboutSection({ about, onReadMorePress }: EventAboutSectionProps) {
  return (
    <View className="px-5 mb-6">
      <Text className="text-foreground text-lg font-primary-bold mb-3">{ED_ABOUT_EVENT}</Text>

      <Text
        className="text-sm leading-6"
        style={{ color: THEME.dark.mutedForeground }}
        numberOfLines={3}>
        {about}
      </Text>

      <Pressable onPress={onReadMorePress} hitSlop={8} className="mt-1">
        <View className="flex-row items-center">
          <Text className="text-sm font-primary-semibold" style={{ color: THEME.dark.primary }}>
            {ED_READ_MORE}
          </Text>
          <ChevronRight size={14} color={THEME.dark.primary} />
        </View>
      </Pressable>
    </View>
  );
}
