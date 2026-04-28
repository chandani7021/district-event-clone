import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getArtists } from '@/services/search.service';
import { getCurrentLocation } from '@/services/navigation.service';
import type { Artist } from '@/lib/dummy-search';

export function ArtistsSection() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      getArtists(loc.city).then(setArtists);
    });
  }, []);

  if (artists.length === 0) return null;

  return (
    <View className="gap-3">
      <Text className="text-secondary-foreground text-sm font-primary-semibold tracking-wide px-5">
        Artists in your District
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-5">
        {artists.map((artist) => (
          <Pressable
            key={artist.id}
            className="w-20 items-center gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <View className="w-20 h-20 rounded-full overflow-hidden bg-secondary">
              <Image
                source={{ uri: artist.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text
              className="text-foreground text-xs font-primary-medium text-center w-20"
              numberOfLines={2}>
              {artist.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
