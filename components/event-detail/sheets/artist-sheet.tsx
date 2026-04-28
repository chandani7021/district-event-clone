import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Bookmark, Instagram, Youtube } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import { HotlistPickerSheet } from '@/components/hotlist/hotlist-picker-sheet';
import type { ArtistSheetProps } from '@/interfaces/event-detail.interface';
import {
  ED_ADD_TO_HOTLIST,
  ED_NEVER_MISS,
  ED_SHOW_LESS,
  ED_SHOW_MORE,
  ED_VIEW_DETAILS,
} from '@/constants/event-detail.constants';

export function ArtistSheet({ isVisible, onClose, artist }: ArtistSheetProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [hotlistPickerVisible, setHotlistPickerVisible] = useState(false);

  if (!artist) return null;

  return (
    <>
      <DetailSheetModal isVisible={isVisible} onClose={onClose} title={artist.name}>
        {/* Artist photo + social stats */}
        <View className="items-center mb-4">
          <Image
            source={{ uri: artist.image }}
            className="rounded-full mb-3"
            style={{ width: 96, height: 96 }}
            resizeMode="cover"
          />
          <Text className="text-foreground text-xl font-primary-bold">{artist.name}</Text>
          <Text className="text-xs text-center mt-1" style={{ color: THEME.dark.mutedForeground }}>
            {artist.role}
          </Text>
        </View>

        {/* Social stats row */}
        {(artist.instagramFollowers || artist.youtubeSubscribers) && (
          <View
            className="flex-row rounded-xl overflow-hidden mb-4"
            style={{ backgroundColor: THEME.dark.secondary }}>
            {artist.instagramFollowers && (
              <View className="flex-1 items-center py-3 gap-1">
                <Instagram size={18} color={THEME.dark.foreground} />
                <Text className="text-foreground text-sm font-primary-bold">
                  {artist.instagramFollowers}
                </Text>
                <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                  Followers
                </Text>
              </View>
            )}
            {artist.instagramFollowers && artist.youtubeSubscribers && (
              <View className="w-px self-stretch" style={{ backgroundColor: THEME.dark.border }} />
            )}
            {artist.youtubeSubscribers && (
              <View className="flex-1 items-center py-3 gap-1">
                <Youtube size={18} color={THEME.dark.foreground} />
                <Text className="text-foreground text-sm font-primary-bold">
                  {artist.youtubeSubscribers}
                </Text>
                <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                  Subscribers
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Never miss + hotlist */}
        <View
          className="flex-row items-center justify-between rounded-xl p-3 mb-4 gap-3"
          style={{ backgroundColor: THEME.dark.secondary }}>
          <Text className="text-xs flex-1 leading-4" style={{ color: THEME.dark.mutedForeground }}>
            {ED_NEVER_MISS}
          </Text>
          <Pressable
            onPress={() => setHotlistPickerVisible(true)}
            hitSlop={8}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border"
            style={{ borderColor: THEME.dark.border }}>
            <Bookmark size={14} color={THEME.dark.foreground} />
            <Text className="text-foreground text-xs font-primary-semibold">{ED_ADD_TO_HOTLIST}</Text>
          </Pressable>
        </View>

        {/* Bio with show more/less */}
        <View className="mb-4">
          <Text
            className="text-sm leading-6"
            style={{ color: THEME.dark.mutedForeground }}
            numberOfLines={bioExpanded ? undefined : 3}>
            {artist.bio}
          </Text>
          <Pressable onPress={() => setBioExpanded((v) => !v)} hitSlop={8} className="mt-1">
            <Text className="text-sm font-primary-semibold" style={{ color: THEME.dark.primary }}>
              {bioExpanded ? ED_SHOW_LESS : ED_SHOW_MORE}
            </Text>
          </Pressable>
        </View>

        {/* View details button */}
        <Pressable
          onPress={() => { onClose(); router.push(`/artist/${artist.id}`); }}
          className="mt-4 rounded-full py-3 items-center"
          style={{ backgroundColor: THEME.dark.foreground }}>
          <Text className="font-primary-bold" style={{ color: THEME.dark.background }}>
            {ED_VIEW_DETAILS}
          </Text>
        </Pressable>
      </DetailSheetModal>

      <HotlistPickerSheet
        visible={hotlistPickerVisible}
        onClose={() => setHotlistPickerVisible(false)}
        eventTitle={artist.name}
        eventId={artist.id}
      />
    </>
  );
}
