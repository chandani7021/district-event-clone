import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  type ViewToken,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { GalleryFullscreenProps } from '@/interfaces/event-detail.interface';
import { ED_GALLERY } from '@/constants/event-detail.constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMBNAIL_SIZE = 64;

export function GalleryFullscreen({
  isVisible,
  onClose,
  images,
  initialIndex,
  eventTitle,
}: GalleryFullscreenProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const mainListRef = useRef<FlatList>(null);
  const thumbListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        const idx = viewableItems[0].index;
        setCurrentIndex(idx);
        thumbListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
      }
    }
  ).current;

  const goTo = (index: number) => {
    if (index < 0 || index >= images.length) return;
    mainListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1" style={{ backgroundColor: THEME.dark.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-5 pb-3"
          style={{ paddingTop: insets.top + 12 }}>
          <View className="flex-1">
            <Text
              className="text-foreground text-sm font-primary-semibold"
              numberOfLines={1}
              style={{ maxWidth: SCREEN_WIDTH - 120 }}>
              {eventTitle}
            </Text>
            <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
              {ED_GALLERY}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Text className="text-sm" style={{ color: THEME.dark.mutedForeground }}>
              {currentIndex + 1}/{images.length}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: THEME.dark.secondary }}>
              <X size={18} color={THEME.dark.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Main image carousel */}
        <View className="flex-1 relative">
          <FlatList
            ref={mainListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}-${index}`}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={({ item }) => (
              <View style={{ width: SCREEN_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: item }}
                  style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.6 }}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {/* Left / right navigation */}
          {currentIndex > 0 && (
            <Pressable
              onPress={() => goTo(currentIndex - 1)}
              className="absolute left-3 top-1/2 w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -20 }}>
              <ChevronLeft size={22} color={THEME.dark.foreground} />
            </Pressable>
          )}

          {currentIndex < images.length - 1 && (
            <Pressable
              onPress={() => goTo(currentIndex + 1)}
              className="absolute right-3 top-1/2 w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', marginTop: -20 }}>
              <ChevronRight size={22} color={THEME.dark.foreground} />
            </Pressable>
          )}
        </View>

        {/* Thumbnail strip */}
        <View style={{ paddingBottom: insets.bottom + 16, paddingTop: 12 }}>
          <FlatList
            ref={thumbListRef}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `thumb-${item}-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            getItemLayout={(_, index) => ({
              length: THUMBNAIL_SIZE + 8,
              offset: (THUMBNAIL_SIZE + 8) * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => goTo(index)}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: THUMBNAIL_SIZE,
                    height: THUMBNAIL_SIZE,
                    borderRadius: 8,
                    borderWidth: index === currentIndex ? 2 : 0,
                    borderColor: THEME.dark.primary,
                    opacity: index === currentIndex ? 1 : 0.5,
                  }}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
