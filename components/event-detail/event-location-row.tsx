import { Pressable, View } from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventLocationRowProps } from '@/interfaces/event-detail.interface';
import { ED_KM_AWAY } from '@/constants/event-detail.constants';

export function EventLocationRow({ venue, onPress }: EventLocationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-3 flex-row items-center gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: THEME.dark.secondary }}>
      {/* Icon container */}
      <View
        className="w-9 h-9 rounded-lg items-center justify-center"
        style={{ backgroundColor: THEME.dark.muted }}>
        <MapPin size={18} color={THEME.dark.primary} />
      </View>

      {/* Text */}
      <View className="flex-1">
        <Text className="text-foreground text-sm font-primary-semibold" numberOfLines={1}>
          {venue.name}
        </Text>
        <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
          {venue.distanceKm} {ED_KM_AWAY}
        </Text>
      </View>

      <ChevronRight size={18} color={THEME.dark.mutedForeground} />
    </Pressable>
  );
}
