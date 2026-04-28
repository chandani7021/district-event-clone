import { ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME } from '@/lib/theme';

export function InvoiceDetailsSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}
      scrollEnabled={false}>

      {/* Name field */}
      <View className="border border-border rounded-xl p-4 bg-card">
        <Skeleton width={160} height={18} borderRadius={5} />
      </View>

      {/* Phone field */}
      <View>
        <View className="flex-row gap-2">
          <View className="border border-border rounded-xl p-4 bg-card w-24 flex-row items-center gap-2">
            <Skeleton width={24} height={20} borderRadius={4} />
            <Skeleton width={24} height={16} borderRadius={4} />
          </View>
          <View className="flex-1 border border-border rounded-xl px-4 py-4 justify-center bg-card">
            <Skeleton width={120} height={18} borderRadius={5} />
          </View>
        </View>
        <View className="flex-row items-start gap-2 mt-2 px-1">
          <Skeleton width={13} height={13} borderRadius={4} />
          <Skeleton height={12} borderRadius={4} style={{ flex: 1 }} />
        </View>
      </View>

      {/* Email field */}
      <View>
        <View className="border border-border rounded-xl p-4 bg-card">
          <Skeleton width={180} height={18} borderRadius={5} />
        </View>
        <View className="flex-row items-start gap-2 mt-2 px-1">
          <Skeleton width={13} height={13} borderRadius={4} />
          <Skeleton height={12} borderRadius={4} style={{ flex: 1 }} />
        </View>
      </View>

      {/* State picker */}
      <View>
        <View className="border border-border rounded-xl px-4 py-4 flex-row items-center justify-between bg-card">
          <Skeleton width={100} height={18} borderRadius={5} />
          <Skeleton width={20} height={20} borderRadius={4} />
        </View>
        <View className="flex-row items-start gap-2 mt-2 px-1">
          <Skeleton width={13} height={13} borderRadius={4} />
          <Skeleton height={12} borderRadius={4} style={{ flex: 1 }} />
        </View>
      </View>

      {/* Continue button placeholder */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: THEME.dark.background, borderTopWidth: 1, borderTopColor: THEME.dark.border }}>
        <Skeleton height={56} borderRadius={12} />
      </View>
    </ScrollView>
  );
}
