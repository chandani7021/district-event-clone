import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { parseDate } from '@/lib/utils';
import { DAY_SHORT, MONTHS_SHORT } from '../constants';

interface DateSelectionStepProps {
  dates: string[]; // YYYY-MM-DD, sorted ascending
  onSelectDate: (date: string) => void;
}

export function DateSelectionStep({ dates, onSelectDate }: DateSelectionStepProps) {
  return (
    <View className="flex-1">
      <Text className="text-sm mb-4" style={{ color: THEME.dark.mutedForeground }}>
        Choose a date to see available shows
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {dates.map((date) => {
          const d = parseDate(date);
          return (
            <Pressable
              key={date}
              onPress={() => onSelectDate(date)}
              style={({ pressed }) => ({
                flex: 1,
                minWidth: '44%',
                maxWidth: '48%',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: pressed ? THEME.dark.foreground : THEME.dark.border,
                backgroundColor: pressed ? THEME.dark.accent : THEME.dark.card,
                paddingVertical: 16,
                paddingHorizontal: 12,
                opacity: pressed ? 0.85 : 1,
              })}>
              <Text
                className="text-xs font-primary-semibold uppercase tracking-widest"
                style={{ color: THEME.dark.mutedForeground }}>
                {DAY_SHORT[d.getDay()]}
              </Text>
              <Text className="text-2xl font-primary-bold mt-1 text-foreground">{d.getDate()}</Text>
              <Text className="text-sm mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
                {MONTHS_SHORT[d.getMonth()]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
