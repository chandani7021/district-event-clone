import { useState } from 'react';
import { Modal, Pressable, View, FlatList, Image } from 'react-native';
import { Text } from '@/components/ui/text';

import { LinearGradient } from 'expo-linear-gradient';
import { Check, Plus, Bookmark } from 'lucide-react-native';
import { CreateHotlistModal } from '@/components/hotlist/create-hotlist-modal';
import { HotlistIcon } from '@/components/hotlist/hotlist-icon';
import { useHotlists } from '@/hooks/use-hotlists';
import { addItemToHotlist } from '@/services/hotlist.service';
import { THEME } from '@/lib/theme';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { showToast } from '@/store/toast-store';
import { router } from 'expo-router';
import type { HotlistPickerSheetProps, HotlistRowProps } from '@/interfaces/hotlist.interface';
import {
  HOTLIST_CREATE_LINK,
  HOTLIST_DEFAULT,
  HOTLIST_ITEM_PLURAL,
  HOTLIST_ITEM_SINGULAR,
  HOTLIST_PICKER_TITLE,
  HOTLIST_SAVED,
  HOTLIST_STARTER_LABEL,
} from '@/constants/hotlist.constants';

export function HotlistPickerSheet({ visible, onClose, eventTitle, eventId, eventCoverImage }: HotlistPickerSheetProps) {
  const { hotlists, addHotlist } = useHotlists();
  const [createVisible, setCreateVisible] = useState(false);

  function handleCreateNew() {
    onClose();
    setTimeout(() => setCreateVisible(true), 300);
  }

  function handleCreateHotlist(name: string) {
    const newHotlist = addHotlist(name);

    // Automatically add the item to the new hotlist
    addItemToHotlist({
      hotlistId: newHotlist.id,
      itemId: eventId ?? '',
      itemTitle: eventTitle ?? '',
      itemCoverImage: eventCoverImage,
    });

    showToast(
      `Saved to ${name}`,
      'View Hotlist',
      () => router.push({ pathname: '/hotlist/[id]', params: { id: newHotlist.id } })
    );

    setCreateVisible(false);
  }

  return (
    <>
      <BottomSheet
        isVisible={visible}
        onClose={onClose}
        coverage={0.6}
        className="bg-secondary"
      >
        {/* Saved header */}
        <View className="flex-row items-center justify-between px-lg py-5">
          <View>
            <Text className="text-foreground text-xl font-primary-bold tracking-tight">{HOTLIST_SAVED}</Text>
            <Text className="text-muted-foreground text-sm font-primary-medium mt-[2px]">
              {eventTitle ?? HOTLIST_DEFAULT}
            </Text>
          </View>
          <View
            className="w-11 h-11 rounded-xl items-center justify-center"
            style={{ backgroundColor: THEME.dark.district_clone_orange }}
          >
            <Bookmark size={22} color="#fff" fill="#fff" />
          </View>
        </View>

        {/* Hotlists section header */}
        <View className="flex-row items-center justify-between px-lg pt-md pb-sm">
          <Text className="text-foreground text-base font-primary-semibold">{HOTLIST_PICKER_TITLE}</Text>
          <Pressable onPress={handleCreateNew} hitSlop={8}>
            <View className="border-b border-foreground pb-[2px]">
              <Text className="text-foreground text-sm font-primary-semibold">
                {HOTLIST_CREATE_LINK}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Hotlist rows */}
        <FlatList
          data={hotlists}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <HotlistRow
              hotlist={item}
              onAdd={() => addItemToHotlist({
                hotlistId: item.id,
                itemId: eventId ?? '',
                itemTitle: eventTitle ?? '',
                itemCoverImage: eventCoverImage,
              })}
              onAdded={onClose}
            />
          )}
        />
      </BottomSheet>

      <CreateHotlistModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={handleCreateHotlist}
      />
    </>
  );
}

function HotlistRow({ hotlist, onAdd, onAdded }: HotlistRowProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd();
    showToast(
      `Saved to ${hotlist.name}`,
      'View Hotlist',
      () => router.push({ pathname: '/hotlist/[id]', params: { id: hotlist.id } })
    );
    // Give a tiny delay for the check animation/state before closing
    setTimeout(onAdded, 300);
  };

  return (
    <View className="flex-row items-center px-lg py-3 gap-md">
      {/* Thumbnail */}
      <View className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
        {hotlist.items?.[0]?.coverImage ? (
          <Image
            source={{ uri: hotlist.items[0].coverImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={hotlist.gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
          >
            <HotlistIcon iconType={hotlist.iconType} size={22} />
          </LinearGradient>
        )}
      </View>

      {/* Name & subtitle */}
      <View className="flex-1">
        <Text className="text-foreground text-sm font-primary-semibold" numberOfLines={1}>
          {hotlist.name}
        </Text>
        <Text className="text-muted-foreground text-xs mt-[2px]">
          {hotlist.isStarter ? `${HOTLIST_STARTER_LABEL} • ` : ''}{hotlist.itemCount} {hotlist.itemCount === 1 ? HOTLIST_ITEM_SINGULAR : HOTLIST_ITEM_PLURAL}
        </Text>
      </View>

      {/* Add / Added button */}
      <Pressable onPress={handleAdd} disabled={added} hitSlop={8} className="p-1">
        {added ? (
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: THEME.dark.primary }}>
            <Check size={16} color={THEME.dark.background} />
          </View>
        ) : (
          <View className="w-8 h-8 rounded-full border border-foreground/40 items-center justify-center">
            <Plus size={16} color={THEME.dark.foreground} />
          </View>
        )}
      </Pressable>
    </View>
  );
}
