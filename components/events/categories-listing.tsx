import { mockCategories } from '@/lib/dummy-categories';
import type { EventCategory } from '@/interfaces/category.interface';
import { Text } from '@/components/ui/text';
import { EXPLORE_EVENTS_TITLE } from '@/constants/events.constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Image, View } from 'react-native';
import { router } from 'expo-router';

function splitIntoTwoRows(items: EventCategory[]): [EventCategory[], EventCategory[]] {
  const row1: EventCategory[] = [];
  const row2: EventCategory[] = [];

  items.forEach((item, index) => {
    (index % 2 === 0 ? row1 : row2).push(item);
  });

  return [row1, row2];
}

function CategoryCard({ item }: { item: EventCategory }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Browse ${item.title} events`}
      onPress={() => router.push(`/category/${item.slug}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
      className="w-[200px] h-[140px] rounded-lg overflow-hidden border border-border bg-card">
      <View className="flex-1">
        <Image
          source={item.image}
          className="w-full h-full"
          resizeMode="cover"
          accessibilityLabel={item.title}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: 32,
            paddingBottom: 4,
            paddingHorizontal: 12,
          }}>
          <Text className="text-white text-lg font-primary-bold text-left">{item.title}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

export function CategoriesListing() {
  const [row1, row2] = splitIntoTwoRows(mockCategories);

  return (
    <View className="gap-4">
      <Text className="text-2xl font-primary-bold text-foreground">{EXPLORE_EVENTS_TITLE}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pr-5 pb-2">
        <View className="gap-6">
          <View className="flex-row gap-4">
            {row1.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </View>

          <View className="flex-row gap-4">
            {row2.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
