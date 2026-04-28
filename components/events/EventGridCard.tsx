import { useState } from 'react';
import { View, Image, Pressable, Platform, type ImageSourcePropType } from 'react-native';
import { Text } from '@/components/ui/text';
import { BadgePercent } from 'lucide-react-native';
import type { EventCardData } from '@/interfaces/events.interface';
import { THEME } from '@/lib/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { formatDate, formatTime, getDateParts } from '@/lib/utils';
import { HotlistPickerSheet } from '@/components/hotlist/hotlist-picker-sheet';
import { HotlistButton } from '@/components/hotlist/hotlist-button';

interface EventGridCardProps {
  item: EventCardData;
  imageSource?: ImageSourcePropType;
}

export function EventGridCard({ item, imageSource }: EventGridCardProps) {
  const [hotlistVisible, setHotlistVisible] = useState(false);
  const { day, month, weekday } = getDateParts(item.date);
  const time = formatTime(item.time);

  return (
    <>
      <View className="flex-1 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
        <Pressable
          onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          {/* Event Image */}
          <View className="w-full relative" style={{ height: 200 }}>
            <Image
              source={imageSource ?? { uri: item.coverImage }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />

            {/* Discount Banner */}
            {item.discount_label && (
              <View className="absolute bottom-0 left-0 right-0">
                {Platform.OS === 'ios'
                  ? (
                    <View className="absolute inset-0">
                      <BlurView intensity={20} tint="dark" className="absolute inset-0" />
                    </View>
                  )
                  : <View className="absolute inset-0 bg-black/40" />
                }
                <LinearGradient
                  colors={[THEME.dark.primary, `${THEME.dark.primary}00`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row items-center gap-1.5 px-2.5 py-1.5"
                >
                  <BadgePercent size={14} color="#000" />
                  <Text className="text-primary-foreground text-[10px] font-primary-semibold flex-1" numberOfLines={1}>
                    {item.discount_label}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* HotlistButton sitting on the image */}
            <HotlistButton
              isWishlisted={item.is_wishlisted}
              onPress={() => setHotlistVisible(true)}
              containerStyle="absolute top-2 right-2"
            />
          </View>

          {/* Event Info */}
          <View className="p-3 gap-1.5">
            {/* Title */}
            <Text className="text-base text-foreground font-primary-bold leading-tight" numberOfLines={2}>
              {item.title}
            </Text>

            {/* Date Row */}
            <View className="flex-row items-center gap-1.5">
              <View
                className="w-5 h-5 rounded-full items-center justify-center"
                style={{ backgroundColor: THEME.dark.district_clone_orange }}
              >
                <Text className="text-white font-primary-bold text-[9px]">{day}</Text>
              </View>
              <Text className="text-sm text-muted-foreground font-primary-medium flex-1" numberOfLines={1}>
                {weekday}, {month}, {time}
              </Text>
            </View>

            {/* Venue */}
            <Text className="text-sm text-muted-foreground font-primary-medium" numberOfLines={1}>
              {item.venue_name}, {item.city_name}
            </Text>

            {/* Price */}
            <Text className="text-sm text-foreground font-primary-bold mt-1">
              ₹{item.price_min}/- Onwards
            </Text>
          </View>
        </Pressable>
      </View>

      <HotlistPickerSheet
        visible={hotlistVisible}
        onClose={() => setHotlistVisible(false)}
        eventTitle={item.title}
        eventId={item.id}
        eventCoverImage={item.coverImage}
      />
    </>
  );
}
