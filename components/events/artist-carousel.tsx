import { View, Image, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import type { Artist, ArtistCarouselProps } from '@/interfaces/artist.interface';
import { ARTISTS_SECTION_TITLE } from '@/constants/events.constants';
import { HotlistButton } from '@/components/hotlist/hotlist-button';

export const ArtistCarousel = ({ artists, onArtistPress, onHotlistPress }: ArtistCarouselProps) => {
  if (!artists || artists.length === 0) return null;

  const half = Math.ceil(artists.length / 2);
  const topRow = artists.slice(0, half);
  const bottomRow = artists.slice(half);

  const renderArtist = (artist: Artist) => (
    <View key={artist.id} className="items-center gap-2">
      {/* Image area — Pressable for navigation, HotlistButton as sibling (no nesting) */}
      <View style={{ width: 160, height: 160 }}>
        <Pressable
          onPress={() => onArtistPress?.(artist)}
          accessibilityRole="button"
          accessibilityLabel={`View artist ${artist.name}`}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, width: 160, height: 160 })}>
          <View className="w-full h-full overflow-hidden rounded-lg">
            <Image
              source={artist.image_url}
              className="w-full h-full"
              resizeMode="cover"
              accessibilityLabel={`Photo of ${artist.name}`}
            />
          </View>
        </Pressable>

        {/* HotlistButton is a sibling — not nested inside Pressable */}
        <HotlistButton
          isWishlisted={artist.is_wishlisted}
          onPress={() => onHotlistPress?.(artist)}
          containerStyle="absolute bottom-0 right-0"
          style={{ width: 24, height: 28 }}
        />
      </View>

      <Text
        className="text-left text-sm font-primary-medium text-foreground"
        style={{ width: 160 }}
        numberOfLines={2}
      >
        {artist.name}
      </Text>
    </View>
  );

  return (
    <View
      className="mx-auto w-full gap-6 overflow-hidden px-0 max-w-1440"
      accessibilityRole="summary"
      accessibilityLabel="Artists in your District">
      <Text className="text-2xl font-primary-bold text-foreground">{ARTISTS_SECTION_TITLE}</Text>

      <View className="w-full overflow-hidden">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel="Artists list">
          <View className="gap-6">
            <View className="flex-row gap-3">{topRow.map(renderArtist)}</View>
            <View className="flex-row gap-3">{bottomRow.map(renderArtist)}</View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
