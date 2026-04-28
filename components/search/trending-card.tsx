import { Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import type { TrendingEvent } from '@/interfaces/search.interface';

interface TrendingCardProps {
  item: TrendingEvent;
}

export function TrendingCard({ item }: TrendingCardProps) {
  return (
    <Pressable
      className="flex-1 flex-row items-center gap-3"
      onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <Image
        source={item.image}
        className="w-16 h-16 rounded-sm"
        resizeMode="cover"
      />
      <View className="flex-1 gap-1">
        <Text className="text-foreground text-sm font-primary-semibold leading-tight" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-secondary-foreground text-xs">{item.category}</Text>
      </View>
    </Pressable>
  );
}
