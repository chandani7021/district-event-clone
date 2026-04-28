import { Pressable, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { formatTime } from '@/lib/utils';
import { LOW_STOCK_THRESHOLD, FILLING_FAST_BADGE } from '../constants';
import type { Show } from '../types/booking.types';

interface TimeSelectionStepProps {
  shows: Show[];
  onSelectShow: (show: Show) => void;
}

export function TimeSelectionStep({ shows, onSelectShow }: TimeSelectionStepProps) {
  return (
    <View className="flex-1">
      <Text className="text-sm mb-4" style={{ color: THEME.dark.mutedForeground }}>
        Select a show time
      </Text>
      <View className="gap-3">
        {shows.map((show) => (
          <Pressable
            key={show.id}
            disabled={show.is_sold_out}
            onPress={() => onSelectShow(show)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: pressed ? THEME.dark.foreground : THEME.dark.border,
              backgroundColor: pressed ? THEME.dark.accent : THEME.dark.card,
              paddingHorizontal: 20,
              paddingVertical: 16,
              opacity: show.is_sold_out ? 0.5 : pressed ? 0.85 : 1,
            })}>
            <View className="flex-row items-center gap-3">
              <View
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: THEME.dark.muted }}>
                <Clock size={16} color={THEME.dark.mutedForeground} />
              </View>
              <View>
                <Text className="font-primary-semibold text-foreground">
                  {formatTime(show.start_time)}
                  {show.end_time && (
                    <Text className="font-normal text-sm" style={{ color: THEME.dark.mutedForeground }}>
                      {' – '}{formatTime(show.end_time)}
                    </Text>
                  )}
                </Text>
                {show.available_tickets !== undefined && !show.is_sold_out && (
                  <Text className="text-xs mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
                    {show.available_tickets < LOW_STOCK_THRESHOLD
                      ? `Only ${show.available_tickets} left`
                      : `${show.available_tickets} available`}
                  </Text>
                )}
              </View>
            </View>

            {show.is_sold_out ? (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: THEME.dark.muted }}>
                <Text className="text-xs font-primary-semibold" style={{ color: THEME.dark.mutedForeground }}>
                  Sold Out
                </Text>
              </View>
            ) : show.available_tickets !== undefined && show.available_tickets < LOW_STOCK_THRESHOLD ? (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: FILLING_FAST_BADGE.background, borderWidth: 1, borderColor: FILLING_FAST_BADGE.border }}>
                <Text className="text-xs font-primary-semibold" style={{ color: FILLING_FAST_BADGE.text }}>
                  Filling Fast
                </Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
