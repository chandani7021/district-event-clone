import { useState, useEffect, useRef } from 'react';
import { View, Pressable, FlatList, Image, Share as RNShare, Alert, Platform } from 'react-native';
import { Text } from '@/components/ui/text';

import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CirclePlus, ListFilter, MoreHorizontal, Share, MoreVertical, ArrowLeft } from 'lucide-react-native';
import { getHotlistById, subscribeToHotlists, updateHotlistName, type Hotlist } from '@/store/hotlist-store';
import { HotlistIcon } from '@/components/hotlist/hotlist-icon';
import { AddItemsSheet } from '@/components/hotlist/add-items-sheet';
import { FilterBySheet } from '@/components/hotlist/filter-by-sheet';
import { ItemActionsSheet } from '@/components/hotlist/item-actions-sheet';
import { HotlistActionsSheet } from '@/components/hotlist/hotlist-actions-sheet';
import { RenameHotlistSheet } from '@/components/hotlist/rename-hotlist-sheet';
import { DeleteHotlistModal } from '@/components/hotlist/delete-hotlist-modal';
import { THEME } from '@/lib/theme';
import {
  HOTLIST_ITEMS_LABEL,
  HOTLIST_EMPTY_TITLE,
  HOTLIST_ADD_ITEMS,
} from '@/constants/hotlist.constants';

export default function HotlistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [hotlist, setHotlist] = useState<Hotlist | undefined>(getHotlistById(id));
  const [addItemsVisible, setAddItemsVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [hotlistActionsVisible, setHotlistActionsVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const triggerRefs = useRef<{ [key: string]: View | null }>({});

  useEffect(() => {
    return subscribeToHotlists(() => setHotlist(getHotlistById(id)));
  }, [id]);

  const handleShare = async () => {
    if (!hotlist) return;
    try {
      await RNShare.share({
        message: `Check out my district-clone hotlist: ${hotlist.name} (${hotlist.itemCount} items)`,
        title: hotlist.name,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleItemShare = async (itemId: string) => {
    const item = hotlist?.items?.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await RNShare.share({
        message: `Check out this event from my district-clone hotlist: ${item.title}`,
        title: item.title,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteConfirm = () => {
    console.log('Final Delete confirm for hotlist:', id);
    setDeleteVisible(false);
    // Logic for actual delete was removed per user request
  };

  if (!hotlist) return null;

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Absolute Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4"
        style={{ paddingTop: insets.top, height: insets.top + 56 }}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </Pressable>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleShare}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          >
            <Share size={20} color={THEME.dark.foreground} />
          </Pressable>
          <Pressable
            onPress={() => setHotlistActionsVisible(true)}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          >
            <MoreVertical size={20} color={THEME.dark.foreground} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={hotlist.itemCount > 0 ? hotlist.items : []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            className="items-center px-lg gap-sm pb-md"
            style={{ paddingTop: insets.top + 80 }}
          >
            {/* Cover Art */}
            <LinearGradient
              colors={hotlist.gradientColors as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-hotlist-icon h-hotlist-icon items-center justify-center mb-sm"
              style={{ borderRadius: 16, height: 120, width: 120, alignItems: 'center', justifyContent: 'center' }}
            >
              <HotlistIcon iconType={hotlist.iconType} size={72} />
            </LinearGradient>

            {/* Name & Count */}
            <Text className="text-foreground text-2xl font-primary-bold text-center">{hotlist.name}</Text>
            <Text className="text-muted-foreground text-sm">
              {hotlist.itemCount} {HOTLIST_ITEMS_LABEL}
            </Text>

            {/* Filter / Sort Row */}
            {hotlist.itemCount > 0 && (
              <View className="w-full flex-row items-center gap-md mt-lg px-2">
                <View className="flex-row items-center gap-sm">
                  <ListFilter size={18} color={THEME.dark.foreground} />
                  <Text className="text-foreground text-base font-primary-bold">Sort By:</Text>
                </View>
                <Pressable
                  className="bg-card px-md py-[10px] rounded-xl border border-white/10"
                  onPress={() => setFilterVisible(true)}
                >
                  <Text className="text-foreground text-sm">Select an option</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-lg mt-xl">
            <Text className="text-foreground text-base font-primary-bold text-center px-xl">
              {HOTLIST_EMPTY_TITLE}
            </Text>
            <Pressable
              className="flex-row items-center gap-sm bg-foreground rounded-full px-xl py-[14px]"
              onPress={() => setAddItemsVisible(true)}
            >
              <CirclePlus size={20} color={THEME.dark.background} />
              <Text className="text-background text-base font-primary-semibold">{HOTLIST_ADD_ITEMS}</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
            className="mx-lg mb-lg bg-card rounded-3xl overflow-hidden border border-white/5"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <View className="p-md flex-row gap-lg">
              <Image source={{ uri: item.coverImage }} className="w-24 h-24 rounded-2xl bg-muted" />
              <View className="flex-1 py-1">
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 text-foreground text-base font-primary-bold leading-5 pr-sm" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Pressable
                    ref={(el) => (triggerRefs.current[item.id] = el as any)}
                    className="p-1"
                    onPress={(e) => {
                      e.stopPropagation();
                      triggerRefs.current[item.id]?.measure((x, y, width, height, pageX, pageY) => {
                        setSelectedItem(item.id);
                        setMenuPosition({ x: pageX, y: pageY + height });
                        setActionsVisible(true);
                      });
                    }}
                  >
                    <MoreHorizontal size={20} color={THEME.dark.mutedForeground} />
                  </Pressable>
                </View>
                <Text className="text-muted-foreground text-xs mt-1" numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <AddItemsSheet
        visible={addItemsVisible}
        onClose={() => setAddItemsVisible(false)}
      />

      <FilterBySheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />

      <ItemActionsSheet
        visible={actionsVisible}
        position={menuPosition}
        onClose={() => {
          setActionsVisible(false);
          setSelectedItem(null);
          setMenuPosition(null);
        }}
        onRemove={() => {
          console.log('Remove item:', selectedItem);
        }}
        onAddToList={() => {
          console.log('Add to another list:', selectedItem);
        }}

        onShare={() => {
          if (selectedItem) handleItemShare(selectedItem);
        }}
      />

      <HotlistActionsSheet
        visible={hotlistActionsVisible}
        onClose={() => setHotlistActionsVisible(false)}
        onEdit={() => setRenameVisible(true)}
        onDelete={() => setDeleteVisible(true)}
      />

      <RenameHotlistSheet
        visible={renameVisible}
        onClose={() => setRenameVisible(false)}
        currentName={hotlist.name}
      />

      <DeleteHotlistModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={handleDeleteConfirm}
        hotlistName={hotlist.name}
      />

      {hotlist.itemCount > 0 && (
        <View
          className="absolute left-0 right-0 items-center"
          style={{ bottom: insets.bottom + 20 }}
          pointerEvents="box-none"
        >
          <Pressable
            className="flex-row items-center gap-sm bg-white rounded-full px-lg py-3 shadow-lg"
            onPress={() => setAddItemsVisible(true)}
          >
            <CirclePlus size={20} color={THEME.dark.background} />
            <Text className="text-background text-base font-primary-bold">Add items</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
