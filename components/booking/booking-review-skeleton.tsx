import { ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME } from '@/lib/theme';

export function BookingReviewSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      scrollEnabled={false}>

      {/* Event info row */}
      <View className="flex-row items-center gap-3 px-4 mt-4">
        <Skeleton width={80} height={80} borderRadius={10} />
        <View className="flex-1 gap-2">
          <Skeleton height={20} borderRadius={6} />
          <Skeleton width={160} height={14} borderRadius={5} />
        </View>
      </View>

      {/* Booking details card */}
      <View
        className="mx-4 mt-4 rounded-xl overflow-hidden"
        style={{ backgroundColor: THEME.dark.card }}>
        {/* Date/time row */}
        <View className="px-4 py-4" style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.border }}>
          <Skeleton width={220} height={18} borderRadius={6} />
        </View>

        {/* Ticket rows */}
        {[0, 1].map((i) => (
          <View
            key={i}
            className="px-4 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.border }}>
            <View className="flex-row items-center justify-between">
              <Skeleton width={160} height={16} borderRadius={5} />
              <Skeleton width={60} height={16} borderRadius={5} />
            </View>
            <View className="mt-2 self-end">
              <Skeleton width={50} height={13} borderRadius={4} />
            </View>
          </View>
        ))}

        {/* M-ticket notice */}
        <View className="px-4 py-4 flex-row items-center gap-3">
          <Skeleton width={20} height={20} borderRadius={4} />
          <Skeleton height={13} borderRadius={4} style={{ flex: 1 }} />
        </View>
      </View>

      {/* Payment summary divider + card */}
      <View className="mx-4 mt-6 mb-1">
        <Skeleton width={140} height={13} borderRadius={4} />
      </View>
      <View
        className="mx-4 mt-3 rounded-xl overflow-hidden"
        style={{ backgroundColor: THEME.dark.card }}>
        <View className="px-4 py-4 flex-row justify-between" style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.border }}>
          <Skeleton width={100} height={16} borderRadius={5} />
          <Skeleton width={70} height={16} borderRadius={5} />
        </View>
        <View className="px-4 py-4 flex-row justify-between">
          <Skeleton width={90} height={16} borderRadius={5} />
          <Skeleton width={80} height={16} borderRadius={5} />
        </View>
      </View>

      {/* Invoice section divider + card */}
      <View className="mx-4 mt-6 mb-1">
        <Skeleton width={120} height={13} borderRadius={4} />
      </View>
      <View
        className="mx-4 mt-3 rounded-xl overflow-hidden"
        style={{ backgroundColor: THEME.dark.card }}>
        <View className="px-4 py-4 flex-row items-start gap-3" style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.border }}>
          <Skeleton width={20} height={20} borderRadius={4} />
          <View className="flex-1 gap-2">
            <Skeleton width={140} height={16} borderRadius={5} />
            <Skeleton width={110} height={13} borderRadius={4} />
            <Skeleton width={170} height={13} borderRadius={4} />
          </View>
        </View>
        <View className="px-4 py-3">
          <Skeleton height={12} borderRadius={4} />
        </View>
      </View>
    </ScrollView>
  );
}
