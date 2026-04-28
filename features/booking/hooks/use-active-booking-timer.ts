import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { bookingSession } from '@/services/booking.service';

/**
 * Returns live secondsLeft driven by the session's persisted timerEndTime.
 * Returns 0 when no active booking timer exists.
 * Reactive — picks up timerEndTime the moment it is written to the session,
 * even if that happens after this hook first mounts.
 */
function getSecondsLeft() {
  const endTime = bookingSession.get().timerEndTime;
  if (!endTime) return 0;
  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

function isExpired(endTime: number | undefined) {
  if (!endTime) return false;
  return Date.now() >= endTime;
}

export function useActiveBookingTimer(): { secondsLeft: number; isExpired: boolean } {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft());
  const [expired, setExpired] = useState(isExpired(bookingSession.get().timerEndTime));

  useEffect(() => {
    const tick = () => {
      const session = bookingSession.get();
      setSecondsLeft(getSecondsLeft());
      setExpired(isExpired(session.timerEndTime));
    };

    tick();
    const id = setInterval(tick, 500);

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        tick();
      }
    });

    return () => {
      clearInterval(id);
      subscription.remove();
    };
  }, []);

  return { secondsLeft, isExpired: expired };
}
