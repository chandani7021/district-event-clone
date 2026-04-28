import { type LucideIcon, Calendar, Film, UtensilsCrossed } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

import { THEME } from '@/lib/theme';
import type { BookingType } from '@/interfaces/profile.interface';
import { getBookingTypes } from '@/services/profile.service';

// Icon map — keyed by booking type id
const BOOKING_ICONS: Record<string, LucideIcon> = {
  table:  UtensilsCrossed,
  movies: Film,
  events: Calendar,
};

const FallbackIcon = Calendar;

interface BookingsSectionProps {
  onPress?: (id: string) => void;
}

export function BookingsSection({ onPress }: BookingsSectionProps) {
  const [types, setTypes] = useState<BookingType[]>([]);

  useEffect(() => {
    getBookingTypes().then(setTypes);
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-md px-lg"
    >
      {types.map(({ id, label }) => {
        const Icon = BOOKING_ICONS[id] ?? FallbackIcon;
        return (
          <Pressable
            key={id}
            className="bg-secondary rounded-xl items-start justify-between p-md w-36 min-h-24"
            onPress={() => onPress?.(id)}
          >
            <Icon size={28} color={THEME.dark.input} strokeWidth={1.5} />
            <Text className="text-foreground text-sm font-primary-semibold mt-xl">{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
