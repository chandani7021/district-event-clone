import { Pressable, View, FlatList, Image, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';

import { X, Bookmark, Search } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import { BottomSheet } from '@/components/ui/bottom-sheet';

interface AddItemsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function AddItemsSheet({ visible, onClose }: AddItemsSheetProps) {
  const items = DUMMY_EVENTS.map((e) => ({
    id: e.id,
    title: e.title,
    coverImage: e.coverImage,
    type: 'Event' as const,
    subtitle: e.categories?.[0] ?? 'Event',
  }));

  return (
    <BottomSheet
      isVisible={visible}
      onClose={onClose}
      coverage={0.85}
      className="bg-secondary"
    >
      {/* Drag handle */}
      <View className="items-center pt-1 pb-1">
        <View className="w-10 h-1 rounded-full bg-foreground/20" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-lg pt-sm pb-md">
        <Text className="text-foreground text-xl font-primary-bold">Add items</Text>
        <Pressable onPress={onClose} className="p-1">
          <X size={22} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View className="mx-lg mb-md flex-row items-center bg-muted rounded-full px-md gap-sm">
        <Search size={16} color={THEME.dark.mutedForeground} />
        <TextInput
          className="flex-1 text-foreground text-sm py-[12px]"
          placeholder="Search for restaurants, movies, events a..."
          placeholderTextColor={THEME.dark.mutedForeground}
        />
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center px-lg py-[10px] gap-md">
            <Image
              source={{ uri: item.coverImage }}
              className="w-14 h-14 rounded-lg bg-muted"
            />
            <View className="flex-1">
              <Text className="text-foreground text-sm font-primary-semibold" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-muted-foreground text-xs mt-[2px]">
                {item.subtitle}
              </Text>
            </View>
            <Pressable className="p-1">
              <Bookmark size={20} color={THEME.dark.mutedForeground} />
            </Pressable>
          </View>
        )}
      />
    </BottomSheet>
  );
}
