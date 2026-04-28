import { ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME } from '@/lib/theme';

export function BookingScreenSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 28 }}
      scrollEnabled={false}>

      {/* Date & time section */}
      <View className="gap-4">
        {/* "Choose date and time" label */}
        <Skeleton width={180} height={22} borderRadius={6} />

        {/* Date chips row */}
        <View className="flex-row gap-3">
          {[52, 52, 52, 52].map((w, i) => (
            <View key={i} className="items-center gap-1.5">
              <Skeleton width={w} height={64} borderRadius={12} />
            </View>
          ))}
        </View>

        {/* Time chips row */}
        <View className="flex-row gap-3">
          {[90, 90, 90].map((w, i) => (
            <Skeleton key={i} width={w} height={44} borderRadius={12} />
          ))}
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: THEME.dark.border, marginHorizontal: -20 }} />

      {/* Ticket selection section */}
      <View className="gap-5">
        {/* "Choose tickets" label */}
        <Skeleton width={140} height={22} borderRadius={6} />

        {/* Ticket rows */}
        {[0, 1, 2].map((i) => (
          <View key={i} className="flex-row items-center justify-between">
            <View className="gap-2 flex-1">
              <Skeleton width={140} height={16} borderRadius={5} />
              <Skeleton width={80} height={13} borderRadius={5} />
            </View>
            {/* Stepper */}
            <View className="flex-row items-center gap-3">
              <Skeleton width={32} height={32} borderRadius={8} />
              <Skeleton width={20} height={18} borderRadius={4} />
              <Skeleton width={32} height={32} borderRadius={8} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
