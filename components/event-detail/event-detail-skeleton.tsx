import { Dimensions, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME } from '@/lib/theme';

const { height } = Dimensions.get('window');
const SNAP_COLLAPSED = height * 0.6;

export function EventDetailSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* Media background placeholder */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SNAP_COLLAPSED }}
        className="bg-muted"
      />

      {/* Sheet placeholder */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SNAP_COLLAPSED,
          bottom: 0,
          backgroundColor: THEME.dark.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
        {/* Drag handle */}
        <View className="items-center py-3">
          <View
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
        </View>

        <View className="px-5 gap-5 pt-2">
          {/* Category pills */}
          <View className="flex-row gap-2">
            <Skeleton width={70} height={24} borderRadius={20} />
            <Skeleton width={90} height={24} borderRadius={20} />
          </View>

          {/* Title */}
          <View className="gap-2">
            <Skeleton height={24} borderRadius={6} />
            <Skeleton width={220} height={24} borderRadius={6} />
          </View>

          {/* Date / time */}
          <Skeleton width={160} height={16} borderRadius={6} />

          {/* Location row */}
          <View
            className="flex-row items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: THEME.dark.secondary }}>
            <Skeleton width={36} height={36} borderRadius={8} />
            <View className="flex-1 gap-2">
              <Skeleton width={160} height={14} borderRadius={5} />
              <Skeleton width={100} height={12} borderRadius={5} />
            </View>
            <Skeleton width={20} height={20} borderRadius={4} />
          </View>

          {/* Schedule row */}
          <View
            className="flex-row items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: THEME.dark.secondary }}>
            <Skeleton width={36} height={36} borderRadius={8} />
            <View className="flex-1 gap-2">
              <Skeleton width={130} height={14} borderRadius={5} />
              <Skeleton width={90} height={12} borderRadius={5} />
            </View>
            <Skeleton width={20} height={20} borderRadius={4} />
          </View>

          {/* Artist section */}
          <View className="gap-3">
            <Skeleton width={80} height={16} borderRadius={5} />
            <View className="flex-row gap-3">
              {[0, 1, 2].map((i) => (
                <View key={i} className="items-center gap-2">
                  <Skeleton width={64} height={64} borderRadius={32} />
                  <Skeleton width={56} height={12} borderRadius={4} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Booking bar placeholder */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ backgroundColor: THEME.dark.card }}>
        <View className="flex-row items-center justify-between">
          <View className="gap-2">
            <Skeleton width={60} height={12} borderRadius={4} />
            <Skeleton width={100} height={22} borderRadius={5} />
          </View>
          <Skeleton width={140} height={48} borderRadius={24} />
        </View>
      </View>
    </View>
  );
}
