import { Dimensions, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME } from '@/lib/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.55;

function ArtistEventCardSkeleton() {
  return (
    <View
      className="flex-row items-center rounded-2xl border p-3 gap-3"
      style={{ backgroundColor: THEME.dark.secondary, borderColor: THEME.dark.border }}>
      {/* Thumbnail */}
      <Skeleton width={90} height={90} borderRadius={10} />

      {/* Details */}
      <View className="flex-1 gap-2">
        <Skeleton width={120} height={12} borderRadius={4} />
        <Skeleton height={15} borderRadius={4} />
        <Skeleton width={160} height={12} borderRadius={4} />
        <Skeleton width={100} height={12} borderRadius={4} />
      </View>

      {/* Bookmark placeholder */}
      <Skeleton width={36} height={36} borderRadius={10} style={{ alignSelf: 'flex-start' }} />
    </View>
  );
}

export function ArtistDetailSkeleton({ topInset = 0 }: { topInset?: number }) {
  return (
    <View className="flex-1" style={{ backgroundColor: THEME.dark.background }}>
      {/* Hero */}
      <View style={{ height: HERO_HEIGHT }}>
        <Skeleton height={HERO_HEIGHT} borderRadius={0} />

        {/* Top bar buttons */}
        <View
          className="absolute left-0 right-0 flex-row justify-between px-4"
          style={{ top: topInset + 8 }}>
          <Skeleton width={38} height={38} borderRadius={19} />
          <Skeleton width={38} height={38} borderRadius={19} />
        </View>
      </View>

      {/* Content */}
      <View className="px-5 pt-2 gap-4">
        {/* Name + hotlist button */}
        <View className="flex-row items-center justify-between gap-3">
          <Skeleton width={200} height={32} borderRadius={6} />
          <Skeleton width={130} height={38} borderRadius={22} />
        </View>

        {/* Bio lines */}
        <View className="gap-2">
          <Skeleton height={14} borderRadius={4} />
          <Skeleton height={14} borderRadius={4} />
          <Skeleton width={220} height={14} borderRadius={4} />
        </View>

        {/* All events heading */}
        <Skeleton width={120} height={22} borderRadius={6} style={{ marginTop: 8 }} />

        {/* Section divider */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px" style={{ backgroundColor: THEME.dark.border }} />
          <Skeleton width={60} height={11} borderRadius={4} />
          <View className="flex-1 h-px" style={{ backgroundColor: THEME.dark.border }} />
        </View>

        {/* Event cards */}
        <ArtistEventCardSkeleton />
        <ArtistEventCardSkeleton />
      </View>
    </View>
  );
}
