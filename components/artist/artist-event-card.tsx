import { Image, TouchableOpacity, View, Pressable } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import type { ArtistEvent } from '@/interfaces/artist.interface';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';

interface ArtistEventCardProps {
  item: ArtistEvent;
  onPress?: () => void;
  onHotlistPress?: () => void;
}

export function ArtistEventCard({ item, onPress, onHotlistPress }: ArtistEventCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({ pathname: '/events/[id]', params: { id: item.id } });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center rounded-2xl border p-3 gap-3"
      style={({ pressed }) => ({
        backgroundColor: THEME.dark.secondary,
        borderColor: THEME.dark.border,
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }]
      })}>
      {/* Thumbnail */}
      <Image
        source={{ uri: item.image_url }}
        className="w-[90px] h-[90px] rounded-[10px]"
        resizeMode="cover"
      />

      {/* Details */}
      <View className="flex-1 gap-[3px]">
        <Text className="text-xs font-primary-bold" style={{ color: THEME.dark.primary }}>
          {item.date}, {item.time}
        </Text>
        <Text className="text-[15px] font-primary-bold leading-5" numberOfLines={2} style={{ color: THEME.dark.foreground }}>
          {item.title}
        </Text>
        <Text className="text-xs" numberOfLines={1} style={{ color: THEME.dark.mutedForeground }}>
          {item.venue}, {item.city}
        </Text>
        <Text className="text-xs font-primary-semibold mt-0.5" style={{ color: THEME.dark.secondaryForeground }}>
          {item.currency} {item.price} onwards
        </Text>
      </View>

      {/* Bookmark */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={(e) => {
          e.stopPropagation();
          onHotlistPress?.();
        }}
        className="w-9 h-9 rounded-[10px] border items-center justify-center self-start"
        style={{ backgroundColor: THEME.dark.card, borderColor: THEME.dark.border }}>
        <Bookmark size={16} color={THEME.dark.mutedForeground} />
      </TouchableOpacity>
    </Pressable>
  );
}
