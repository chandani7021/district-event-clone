import { Dimensions, ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ListEventCardSkeleton() {
  return (
    <View className="rounded-2xl border border-border p-4 gap-3">
      <Skeleton height={160} borderRadius={12} />
      <Skeleton width={220} height={18} borderRadius={6} />
      <Skeleton width={150} height={13} borderRadius={6} />
      <View className="flex-row gap-2">
        <Skeleton width={72} height={28} borderRadius={20} />
        <Skeleton width={72} height={28} borderRadius={20} />
      </View>
    </View>
  );
}

export function CategoryScreenSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>

      {/* Hero: title + image placeholder */}
      <View className="min-h-[140px] px-5 pb-5 justify-center">
        <Skeleton width={200} height={32} borderRadius={8} />
        <View className="absolute right-4 top-0">
          <Skeleton width={140} height={140} borderRadius={12} />
        </View>
      </View>

      {/* Sub-nav tab pills */}
      <View className="mt-1 px-4 py-2 flex-row gap-2">
        {[80, 55, 80, 65, 90].map((w, i) => (
          <Skeleton key={i} width={w} height={36} borderRadius={20} />
        ))}
      </View>
      <View className="h-px bg-border" />

      {/* Featured carousel */}
      <View className="pt-6 px-5 gap-[10px]">
        <Skeleton width={90} height={13} borderRadius={5} />
        <Skeleton width={SCREEN_WIDTH - 40} height={380} borderRadius={20} />
      </View>

      {/* Events listing */}
      <View className="px-5 pt-7 gap-4">
        {[0, 1, 2].map((i) => (
          <ListEventCardSkeleton key={i} />
        ))}
      </View>
    </ScrollView>
  );
}
