import { Image, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import type { EventCardData } from '@/interfaces/events.interface';
import { getEventStatusLabel } from '@/lib/event-utils';
import { BOOK_TICKETS_LABEL } from '@/constants/events.constants';

interface EventCardProps {
  item: EventCardData;
}

export function EventCard({ item }: EventCardProps) {
  const categories = item.categories ?? [];

  return (
    <View className="flex-1 overflow-hidden rounded-3xl">
      {/* Background Image */}
      <Image source={{ uri: item.coverImage }} className="absolute inset-0" resizeMode="cover" />

      {/* Smooth Dark Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.95)']}
        locations={[0.15, 1]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
        }}
      />

      {/* Status Badge (Glass Effect) */}
      <View className="absolute right-4 top-4">
        <View className="elevation-4 rounded-full border border-foreground/30 bg-background/30 px-3 py-1">
          <Text className="text-sm font-primary-bold tracking-wide text-foreground">{getEventStatusLabel(item)}</Text>
        </View>
      </View>

      {/* Bottom Content */}
      <View className="absolute bottom-0 left-0 right-0 gap-3 p-6">
        {/* Title */}
        <Text
          numberOfLines={2}
          className="text-center text-3=2xl font-primary-bold leading-8 text-foreground">
          {item.title}
        </Text>

        {/* Category Chips */}
        {categories.length > 0 && (
          <View className="flex-row flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <View
                key={`${category}-${index}`}
                className="rounded-full border border-foreground/30 bg-foreground/15 px-3 py-1">
                <Text className="text-sm text-foreground">{category}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        <Text numberOfLines={2} className="text-center text-sm leading-5 text-secondary-foreground">
          {item.description}
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-2 self-center rounded-full bg-foreground px-6 py-2.5">
          <Text className="text-base font-primary-semibold text-primary-foreground">{BOOK_TICKETS_LABEL}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
