import { Image, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import type { EventCardData } from '@/interfaces/events.interface';
import { getEventStatusLabel } from '@/lib/event-utils';
import { BOOK_TICKETS_LABEL } from '@/constants/events.constants';
import { router } from 'expo-router';

export function FeaturedCard({ item }: { item: EventCardData }) {
  return (
    <View className="flex-1 rounded-[20px] overflow-hidden">
      <Image source={{ uri: item.coverImage }} className="w-full h-full" resizeMode="cover" />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={{ position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 20 }}>

        {/* Status Badge (Glass Effect) */}
        <View className="absolute left-4 top-4">
          <View className="elevation-4 rounded-full border border-border bg-accent bg-t px-3 py-1">
            <Text className="text-sm font-primary-bold tracking-wide text-district_clone_orange">{getEventStatusLabel(item)}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="gap-3 items-center">
          <Text className="text-white text-2xl font-primary-bold text-center" numberOfLines={2}>
            {item.title}
          </Text>

          {/* Category pills */}
          {item.categories?.length > 0 && (
            <View className="flex-row flex-wrap justify-center gap-2">
              {item.categories.map((cat) => (
                <View key={cat} className="bg-white/20 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-primary-medium">{cat}</Text>
                </View>
              ))}
            </View>
          )}

          {item.description && (
            <Text className="text-white/70 text-sm text-center" numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <TouchableOpacity
            className="bg-primary rounded-full px-8 py-3 mt-1"
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}>
            <Text className="text-primary-foreground text-sm font-primary-bold">{BOOK_TICKETS_LABEL}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
