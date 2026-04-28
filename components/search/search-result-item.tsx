import { Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import type { SearchResult } from '@/interfaces/navigation.interface';

interface SearchResultItemProps {
  item: SearchResult;
}

export function SearchResultItem({ item }: SearchResultItemProps) {
  const handlePress = () => {
    router.push({ pathname: '/events/[id]', params: { id: item.id } });
  };

  return (
    <Pressable
      className="flex-row items-center gap-3 py-3"
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {item.image ? (
        <Image
          source={item.image}
          className="w-14 h-14 rounded-sm"
          resizeMode="cover"
        />
      ) : (
        <View className="w-14 h-14 rounded-lg bg-secondary" />
      )}

      <View className="flex-1 gap-0.5">
        <Text className="text-foreground text-sm font-primary-bold" numberOfLines={2}>
          {item.title}
        </Text>
        {(item.venue || item.city) && (
          <Text className="text-secondary-foreground text-xs" numberOfLines={1}>
            {[item.venue, item.city].filter(Boolean).join(' • ')}
          </Text>
        )}
        {item.date && (
          <Text className="text-secondary-foreground text-xs">{item.date}</Text>
        )}
      </View>
    </Pressable>
  );
}
