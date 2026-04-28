import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { BOOKING_GET_DIRECTIONS } from '@/constants/booking.constants';

interface BookingVenueCardProps {
  venueName: string;
  venueAddress: string;
}

export function BookingVenueCard({ venueName, venueAddress }: BookingVenueCardProps) {
  const openMaps = () => {
    const query = encodeURIComponent(`${venueName} ${venueAddress}`);
    const url = Platform.OS === 'ios'
      ? `maps:?q=${query}`
      : `geo:0,0?q=${query}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    });
  };

  return (
    <View className="mx-4 rounded-xl overflow-hidden bg-card">
      <View className="px-4 py-4 flex-row items-start gap-3">
        <MapPin size={20} color={THEME.dark.mutedForeground} />
        <View className="flex-1">
          <Text className="text-foreground text-base font-primary-bold">{venueName}</Text>
          <Text className="text-sm mt-1 text-muted-foreground">{venueAddress}</Text>
          <TouchableOpacity className="mt-2 flex-row items-center gap-1" onPress={openMaps}>
            <Text className="text-base font-primary-semibold text-primary">{BOOKING_GET_DIRECTIONS}</Text>
            <ChevronRight size={16} color={THEME.dark.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
