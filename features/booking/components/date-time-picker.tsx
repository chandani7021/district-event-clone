import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { parseDate, formatTimeCompact } from '@/lib/utils';
import { DAY_SHORT, MONTHS_SHORT, LOW_STOCK_THRESHOLD } from '../constants';
import type { Show } from '../types/booking.types';

interface DateTimePickerProps {
  shows: Show[];
  availableDates: string[];
  selectedDate: string | null;
  selectedShow: Show | null;
  onSelectDate: (date: string) => void;
  onSelectShow: (show: Show) => void;
}

export function DateTimePicker({
  shows,
  availableDates,
  selectedDate,
  selectedShow,
  onSelectDate,
  onSelectShow,
}: DateTimePickerProps) {
  const activeDate = selectedDate ?? availableDates[0] ?? null;
  const showsOnDate = shows.filter((s) => s.date === activeDate);
  const hasMultipleDates = availableDates.length > 1;

  const monthLabel = activeDate ? MONTHS_SHORT[parseDate(activeDate).getMonth()] : '';

  return (
    <View>
      <Text className="text-lg font-primary-bold text-foreground mb-4">Choose date and time</Text>

      {/* Date pills row */}
      {hasMultipleDates && (
        <View className="flex-row items-center mb-4">
          {/* Rotated month label */}
          <View className="items-center justify-center mr-2.5" style={{ width: 24, height: 72 }}>
            <View
              style={{
                transform: [{ rotate: '-90deg' }],
                width: 72,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                className="font-primary-bold uppercase"
                style={{
                  color: THEME.dark.mutedForeground,
                  fontSize: 10,
                  letterSpacing: 2,
                }}>
                {monthLabel}
              </Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {availableDates.map((date) => {
              const d = parseDate(date);
              const isSelected = date === activeDate;
              const dateShows = shows.filter((s) => s.date === date);
              const allSoldOut = dateShows.length > 0 && dateShows.every((s) => s.is_sold_out);

              return (
                <Pressable
                  key={date}
                  onPress={() => onSelectDate(date)}
                  className="items-center justify-center rounded-xl px-2"
                  style={{
                    minWidth: 56,
                    height: 72,
                    borderWidth: 2,
                    borderColor: isSelected ? THEME.dark.foreground : THEME.dark.border,
                    backgroundColor: isSelected ? THEME.dark.foreground : 'transparent',
                    opacity: allSoldOut ? 0.6 : 1,
                  }}>
                  <Text
                    className="font-primary-bold"
                    style={{
                      fontSize: 22,
                      lineHeight: 26,
                      color: isSelected ? THEME.dark.background : THEME.dark.foreground,
                    }}>
                    {d.getDate()}
                  </Text>
                  <Text
                    className="font-primary-medium mt-0.5"
                    style={{
                      fontSize: 11,
                      color: isSelected ? THEME.dark.background : THEME.dark.mutedForeground,
                    }}>
                    {DAY_SHORT[d.getDay()]}
                  </Text>
                  {allSoldOut && (
                    <Text
                      className="mt-0.5 text-center"
                      style={{
                        fontSize: 8,
                        color: isSelected ? THEME.dark.background : THEME.dark.foreground,
                        fontWeight: '600',
                      }}>
                      Sold out
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Time slot pills */}
      {showsOnDate.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {showsOnDate.map((show) => {
            const isSelected = selectedShow?.id === show.id;
            const lowStock = !show.is_sold_out && show.available_tickets !== undefined && show.available_tickets < LOW_STOCK_THRESHOLD;
            return (
              <Pressable
                key={show.id}
                onPress={() => !show.is_sold_out && onSelectShow(show)}
                disabled={show.is_sold_out}
                className="rounded-xl items-center justify-center"
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderWidth: 2,
                  borderColor: isSelected ? THEME.dark.foreground : THEME.dark.border,
                  backgroundColor: show.is_sold_out
                    ? THEME.dark.muted
                    : isSelected
                      ? THEME.dark.foreground
                      : 'transparent',
                }}>
                <Text
                  className="font-primary-semibold"
                  style={{
                    fontSize: 16,
                    color: show.is_sold_out
                      ? THEME.dark.mutedForeground
                      : isSelected
                        ? THEME.dark.background
                        : THEME.dark.foreground,
                  }}>
                  {formatTimeCompact(show.start_time)}
                </Text>
                {(show.is_sold_out || lowStock) && (
                  <Text
                    className="mt-0.5"
                    style={{
                      fontSize: 10,
                      color: show.is_sold_out ? THEME.dark.foreground : THEME.dark.district_clone_orange,
                    }}>
                    {show.is_sold_out ? 'Sold out' : `Only ${show.available_tickets} left`}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {showsOnDate.length === 0 && (
        <Text className="text-[13px]" style={{ color: THEME.dark.mutedForeground }}>
          No shows available for this date.
        </Text>
      )}
    </View>
  );
}
