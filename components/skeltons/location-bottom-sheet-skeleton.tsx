import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/ui/skeleton';

function CityCardSkeleton() {
  return (
    <View
      className="bg-secondary rounded-2xl items-center justify-center py-xl"
      style={{ width: '30.5%' }}
    >
      <Skeleton width={52} height={52} borderRadius={999} style={{ marginBottom: 10 }} />
      <Skeleton width={60} height={13} borderRadius={5} />
    </View>
  );
}

export function LocationBottomSheetSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Platform.OS === 'ios' ? insets.top : 0 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-lg pt-md pb-3 gap-md">
        <Skeleton width={36} height={36} borderRadius={999} />
        <Skeleton width={100} height={22} borderRadius={6} />
      </View>

      {/* Search bar */}
      <View className="px-lg mb-8 pt-sm">
        <Skeleton height={48} borderRadius={999} />
      </View>

      {/* Popular cities grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        <Skeleton width={140} height={20} borderRadius={6} style={{ marginBottom: 16 }} />

        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <CityCardSkeleton key={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
