import { Dimensions, Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventGalleryProps } from '@/interfaces/event-detail.interface';
import { ED_GALLERY, ED_MORE_PHOTOS } from '@/constants/event-detail.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 48 - 8) / 2; // 2 per row with 8px gap, 20px padding each side

export function EventGallery({ images, onImagePress }: EventGalleryProps) {
  const displayImages = images.slice(0, 4);
  const remaining = images.length - 4;

  return (
    <View className="px-5 mb-6">
      <Text className="text-foreground text-lg font-primary-bold mb-3">{ED_GALLERY}</Text>

      <View className="flex-row flex-wrap gap-2">
        {displayImages.map((uri, index) => (
          <Pressable
            key={uri}
            onPress={() => onImagePress(index)}
            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
            <Image
              source={{ uri }}
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 12 }}
              resizeMode="cover"
            />

            {/* Overlay on 4th image if more exist */}
            {index === 3 && remaining > 0 && (
              <View
                className="absolute inset-0 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <Text className="text-foreground text-2xl font-primary-bold">+{remaining}</Text>
                <Text className="text-foreground text-sm" style={{ color: THEME.dark.mutedForeground }}>
                  {ED_MORE_PHOTOS}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
