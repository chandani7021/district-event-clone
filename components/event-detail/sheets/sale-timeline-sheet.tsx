import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { SaleTimelineSheetProps } from '@/interfaces/event-detail.interface';
import { ED_SALE_LIVE_BADGE, ED_SALE_TIMELINE_TITLE } from '@/constants/event-detail.constants';

const MUTED_CIRCLE = THEME.dark.border;

export function SaleTimelineSheet({ isVisible, onClose, entries }: SaleTimelineSheetProps) {
  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_SALE_TIMELINE_TITLE}>
      <View className="gap-0">
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          const isCompleted = entry.status === 'completed';
          const isActive = entry.status === 'active';

          return (
            <View key={entry.id} className="flex-row gap-4">
              {/* Timeline indicator */}
              <View className="items-center" style={{ width: 24 }}>
                {/* Circle */}
                {isCompleted ? (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: THEME.dark.primary }}>
                    <Check size={14} color={THEME.dark.primaryForeground} strokeWidth={3} />
                  </View>
                ) : (
                  <View
                    className="w-6 h-6 rounded-full border-2"
                    style={{
                      backgroundColor: isActive ? THEME.dark.primary : 'transparent',
                      borderColor: isActive ? THEME.dark.primary : MUTED_CIRCLE,
                    }}
                  />
                )}
                {/* Connecting line */}
                {!isLast && (
                  <View
                    className="flex-1 w-0.5 my-1"
                    style={{ backgroundColor: isCompleted ? THEME.dark.primary : MUTED_CIRCLE, minHeight: 28 }}
                  />
                )}
              </View>

              {/* Content */}
              <View className="flex-1 flex-row justify-between pb-6">
                <View className="gap-0.5">
                  <Text
                    className="text-sm font-primary-semibold"
                    style={{ color: isActive || isCompleted ? THEME.dark.foreground : THEME.dark.mutedForeground }}>
                    {entry.label}
                  </Text>
                  <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                    {entry.dateRange}
                  </Text>
                </View>
                {isActive && (
                  <View className="px-2 py-0.5 rounded-md self-start" style={{ backgroundColor: THEME.dark.primary }}>
                    <Text className="text-xs font-primary-bold text-primary-foreground">
                      {ED_SALE_LIVE_BADGE}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </DetailSheetModal>
  );
}
