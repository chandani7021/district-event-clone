import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  BOOKING_COMPLETE_IN_PREFIX,
  BOOKING_COMPLETE_IN_SUFFIX,
  TIMER_WARNING_SECONDS,
  TIMER_WARNING_COLOR,
} from '@/constants/booking.constants';

interface BookingTimerBannerProps {
  secondsLeft: number;
}

/** Formats a raw seconds value into "MM:SS" */
export function formatSecondsToMMSS(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function BookingTimerBanner({ secondsLeft }: BookingTimerBannerProps) {
  const isWarning = secondsLeft < TIMER_WARNING_SECONDS;
  const timeDisplay = formatSecondsToMMSS(secondsLeft);
  const timerColor = isWarning ? TIMER_WARNING_COLOR : undefined;

  return (
    <View className="mx-4 mt-3 rounded-lg p-2 items-center bg-secondary">
      <Text className="text-foreground text-sm">
        {BOOKING_COMPLETE_IN_PREFIX}{' '}
        <Text className="font-primary-bold text-primary" style={timerColor ? { color: timerColor } : undefined}>
          {timeDisplay}
        </Text>
        {' '}{BOOKING_COMPLETE_IN_SUFFIX}
      </Text>
    </View>
  );
}
