import { ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

function TrendingCardSkeleton() {
  return (
    <View className="flex-1 flex-row items-center gap-3">
      <Skeleton width={64} height={64} borderRadius={8} />
      <View className="flex-1 gap-1.5">
        <Skeleton height={14} borderRadius={5} />
        <Skeleton width={60} height={12} borderRadius={5} />
      </View>
    </View>
  );
}

function ArtistItemSkeleton() {
  return (
    <View className="items-center gap-2">
      <Skeleton width={100} height={100} borderRadius={999} />
      <Skeleton width={80} height={13} borderRadius={5} />
    </View>
  );
}

function CategoryCardSkeleton() {
  return <Skeleton width={96} height={128} borderRadius={16} />;
}

export function SearchScreenSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerClassName="pb-12 pt-5 gap-7">

      {/* Trending section */}
      <View className="px-5 gap-3">
        <Skeleton width={180} height={18} borderRadius={6} />
        {[0, 1, 2].map((i) => (
          <View key={i} className="flex-row gap-4">
            <TrendingCardSkeleton />
            <TrendingCardSkeleton />
          </View>
        ))}
      </View>

      {/* Artist carousel */}
      <View className="px-5 gap-4">
        <Skeleton width={120} height={22} borderRadius={6} />
        <View className="gap-4">
          {[0, 1].map((row) => (
            <View key={row} className="flex-row gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <ArtistItemSkeleton key={i} />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Categories listing */}
      <View className="px-5 gap-4">
        <Skeleton width={150} height={22} borderRadius={6} />
        <View className="gap-4">
          {[0, 1].map((row) => (
            <View key={row} className="flex-row gap-4">
              {[0, 1, 2, 3].map((i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
