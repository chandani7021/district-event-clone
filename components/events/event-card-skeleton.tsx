import { Skeleton } from '@/components/ui/skeleton';
import { View } from 'react-native';

export function EventCardSkeleton() {
  return (
    <View className="rounded-2xl border border-border overflow-hidden p-4 gap-3">
      {/* Event image */}
      <Skeleton height={160} borderRadius={12} />
      {/* Title */}
      <Skeleton width={220} height={20} borderRadius={6} />
      {/* Subtitle / date */}
      <Skeleton width={150} height={14} borderRadius={6} />
      {/* Tag chips */}
      <View className="flex-row gap-2">
        <Skeleton width={72} height={28} borderRadius={20} />
        <Skeleton width={72} height={28} borderRadius={20} />
      </View>
    </View>
  );
}
