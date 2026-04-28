import { Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import type { EventDetailArtist, EventArtistSectionProps } from '@/interfaces/event-detail.interface';
import { ED_KNOW_MORE, ED_TAKING_STAGE } from '@/constants/event-detail.constants';

export function EventArtistSection({ artists, onKnowMorePress }: EventArtistSectionProps) {
  return (
    <View className="px-5 mb-6">
      <Text className="text-foreground text-lg font-primary-bold mb-3">{ED_TAKING_STAGE}</Text>

      <View className="gap-3">
        {artists.map((artist) => (
          <View
            key={artist.id}
            className="flex-row items-center gap-3 rounded-xl p-3"
            style={{ backgroundColor: THEME.dark.secondary }}>
            {/* Artist image */}
            <Image
              source={{ uri: artist.image }}
              className="rounded-xl"
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />

            {/* Info */}
            <View className="flex-1 gap-1">
              <Text className="text-foreground text-base font-primary-bold">{artist.name}</Text>
              <Text
                className="text-xs leading-4"
                style={{ color: THEME.dark.mutedForeground }}
                numberOfLines={2}>
                {artist.role}
              </Text>
              <Pressable onPress={() => onKnowMorePress(artist)} hitSlop={8}>
                <View className="flex-row items-center">
                  <Text className="text-sm font-primary-semibold" style={{ color: THEME.dark.primary }}>
                    {ED_KNOW_MORE}
                  </Text>
                  <ChevronRight size={12} color={THEME.dark.primary} />
                </View>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
