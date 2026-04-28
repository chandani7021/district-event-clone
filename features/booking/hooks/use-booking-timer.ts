import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { TIMER_INITIAL_SECONDS } from '@/constants/booking.constants';

/**
 * Real-time countdown timer for the booking flow.
 * Uses Date.now() as the source of truth so it stays accurate
 * even when the app goes to the background and comes back.
 *
 * @param initialSeconds - Countdown start value (defaults to TIMER_INITIAL_SECONDS)
 * @returns secondsLeft - Remaining seconds, counts down to 0
 */
export function useBookingTimer(initialSeconds: number = TIMER_INITIAL_SECONDS): number {
  const endTimeRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    // Tick twice per second for smoother display
    const interval = setInterval(tick, 500);

    // Re-sync immediately when app comes back to foreground
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        tick();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return secondsLeft;
}
