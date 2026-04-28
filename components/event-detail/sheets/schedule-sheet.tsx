import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { EventDetailMultiDayScheduleDay, ScheduleSheetProps } from '@/interfaces/event-detail.interface';
import { ED_SCHEDULE_TITLE } from '@/constants/event-detail.constants';

function ScheduleTimeline({ items }: { items: EventDetailMultiDayScheduleDay['items'] }) {
  return (
    <View className="gap-0 mt-3">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={`${item.label}-${index}`} className="flex-row gap-4">
            <View className="items-center" style={{ width: 20 }}>
              <View
                className="w-4 h-4 rounded-full border-2 mt-0.5"
                style={{
                  borderColor: THEME.dark.primary,
                  backgroundColor: THEME.dark.card,
                }}
              />
              {!isLast && (
                <View
                  className="flex-1 w-0.5"
                  style={{ backgroundColor: THEME.dark.border, minHeight: 32 }}
                />
              )}
            </View>
            <View className="flex-1 flex-row justify-between pb-8">
              <Text className="text-foreground text-sm font-primary-medium">{item.label}</Text>
              <Text className="text-sm font-primary-semibold" style={{ color: THEME.dark.primary }}>
                {item.time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function ScheduleSheet({ isVisible, onClose, schedule, multiDaySchedule }: ScheduleSheetProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({ [multiDaySchedule?.[0]?.date ?? ''] : true });

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (multiDaySchedule && multiDaySchedule.length > 0) {
    const firstDay = multiDaySchedule[0];
    const lastDay = multiDaySchedule[multiDaySchedule.length - 1];

    return (
      <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_SCHEDULE_TITLE}>
        {/* Date range header */}
        <View className="flex-row items-center gap-2 mb-5">
          <CalendarDays size={18} color={THEME.dark.primary} />
          <Text className="text-foreground text-sm font-primary-semibold">
            {firstDay.label} – {lastDay.label}
          </Text>
        </View>

        {/* Collapsible day sections */}
        <View className="gap-2">
          {multiDaySchedule.map((day) => {
            const isExpanded = !!expandedDays[day.date];
            return (
              <View key={day.date}>
                <Pressable
                  onPress={() => toggleDay(day.date)}
                  className="flex-row items-center justify-between py-3">
                  <Text className="text-foreground text-sm font-primary-bold">{day.label}</Text>
                  {isExpanded
                    ? <ChevronUp size={16} color={THEME.dark.mutedForeground} />
                    : <ChevronDown size={16} color={THEME.dark.mutedForeground} />
                  }
                </Pressable>
                {isExpanded && <ScheduleTimeline items={day.items} />}
                <View className="h-px" style={{ backgroundColor: THEME.dark.border }} />
              </View>
            );
          })}
        </View>
      </DetailSheetModal>
    );
  }

  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_SCHEDULE_TITLE}>
      {/* Date header */}
      <View className="flex-row items-center gap-2 mb-5">
        <CalendarDays size={18} color={THEME.dark.primary} />
        <Text className="text-foreground text-sm font-primary-semibold">{schedule.date}</Text>
      </View>

      {/* Timeline */}
      <ScheduleTimeline items={schedule.items} />
    </DetailSheetModal>
  );
}
