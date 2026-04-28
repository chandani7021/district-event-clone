import { Pressable, View } from 'react-native';
import { CalendarClock, ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventScheduleRowProps } from '@/interfaces/event-detail.interface';
import { ED_GATES_OPEN_PREFIX, ED_VIEW_SCHEDULE } from '@/constants/event-detail.constants';

export function EventScheduleRow({ schedule, multiDaySchedule, onPress }: EventScheduleRowProps) {
  const firstDayItems = multiDaySchedule?.[0]?.items ?? schedule.items;
  const gatesOpenItem = firstDayItems.find((item) =>
    item.label.toLowerCase().includes('doors open') || item.label.toLowerCase().includes('gates open')
  );

  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-3 flex-row items-center gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: THEME.dark.secondary }}>
      {/* Icon container */}
      <View
        className="w-9 h-9 rounded-lg items-center justify-center"
        style={{ backgroundColor: THEME.dark.muted }}>
        <CalendarClock size={18} color={THEME.dark.primary} />
      </View>

      {/* Text */}
      <View className="flex-1">
        {gatesOpenItem ? (
          <Text className="text-foreground text-sm font-primary-semibold">
            {ED_GATES_OPEN_PREFIX} {gatesOpenItem.time}
          </Text>
        ) : firstDayItems[0] ? (
          <Text className="text-foreground text-sm font-primary-semibold">
            {firstDayItems[0].label} at {firstDayItems[0].time}
          </Text>
        ) : (
          <Text className="text-foreground text-sm font-primary-semibold">
            Schedule Info
          </Text>
        )}
        <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
          {ED_VIEW_SCHEDULE}
        </Text>
      </View>

      <ChevronRight size={18} color={THEME.dark.mutedForeground} />
    </Pressable>
  );
}
