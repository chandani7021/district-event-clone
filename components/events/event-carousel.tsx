import * as React from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Carousel, { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { EventCardSkeleton } from '../skeltons/event-card-skeleton';


const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 40; // px-5 on both sides
const CAROUSEL_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;
const DEFAULT_CARD_HEIGHT = 460;
const SKELETON_COUNT = 3;

interface EventCarouselProps<T> {
  data?: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title?: string;
  cardHeight?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loading?: boolean;
}

export function EventCarousel<T>({
  data = [],
  renderItem,
  title = 'IN THE SPOTLIGHT',
  cardHeight = DEFAULT_CARD_HEIGHT,
  autoPlay = true,
  autoPlayInterval = 4500,
  loading = false,
}: EventCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const carouselData = loading ? (Array.from({ length: SKELETON_COUNT }) as unknown as T[]) : data;

  if (!loading && (!data || data.length === 0)) return null;

  return (
    <View>
      {/* ─── Title ─── */}
      {title ? (
        <View className="mb-2 flex-row items-center px-5">
          <View className="h-px flex-1 bg-muted-foreground" />
          <Text className="mx-3 text-sm font-primary-bold tracking-[2.5px] text-muted-foreground">{title}</Text>
          <View className="h-px flex-1 bg-muted-foreground" />
        </View>
      ) : null}

      {/* Carousel */}
      <View className="items-center">
        <Carousel
          ref={carouselRef}
          loop={!loading}
          autoPlay={!loading && autoPlay}
          autoPlayInterval={autoPlayInterval}
          width={CAROUSEL_WIDTH}
          height={cardHeight}
          data={carouselData}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.92,
            parallaxScrollingOffset: 10,
          }}
          pagingEnabled
          snapEnabled
          onProgressChange={(_offset, absoluteProgress) => {
            if (!loading) {
              progress.value = absoluteProgress;
              setActiveIndex(Math.round(absoluteProgress) % data.length);
            }
          }}
          renderItem={({ item, index }: { item: T; index: number }) => (
            <View className="flex-1">
              {loading ? <EventCardSkeleton /> : renderItem(item, index)}
            </View>
          )}
        />
      </View>

      {/* Pagination Dots */}
      <View className="flex-row items-center justify-center pb-4">
        {carouselData.map((_, i) => {
          const isActive = !loading && i === activeIndex;

          return (
            <TouchableOpacity
              key={i}
              disabled={loading}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}>
              <View
                className={`mx-1 rounded-full ${loading ? 'bg-muted-foreground' : isActive ? 'bg-foreground' : 'bg-muted-foreground'
                  }`}
                style={{
                  width: isActive ? 22 : 6,
                  height: 6,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
