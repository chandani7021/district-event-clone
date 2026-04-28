import { Linking, Platform, Pressable, Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, MapPin, Share as ShareIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { VenueSheetProps } from '@/interfaces/event-detail.interface';
import {
  ED_GET_DIRECTIONS,
  ED_KM_AWAY,
  ED_VENUE_TITLE,
} from '@/constants/event-detail.constants';

export function VenueSheet({ isVisible, onClose, venue }: VenueSheetProps) {
  const [copied, setCopied] = useState(false);
  function handleGetDirections() {
    const query = encodeURIComponent(venue.address);
    const url =
      Platform.OS === 'ios'
        ? `maps://?q=${query}`
        : `geo:0,0?q=${query}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    });
  }

  async function handleCopy() {
    await Clipboard.setStringAsync(venue.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    Share.share({ message: `${venue.name}\n${venue.address}` });
  }

  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_VENUE_TITLE} coverage={0.38}>
      {/* Venue name */}
      <View className="flex-row items-start gap-3 mb-3">
        <View
          className="w-9 h-9 rounded-lg items-center justify-center mt-0.5"
          style={{ backgroundColor: THEME.dark.muted }}>
          <MapPin size={18} color={THEME.dark.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-base font-primary-bold mb-1">{venue.name}</Text>
          <Text className="text-sm leading-5" style={{ color: THEME.dark.mutedForeground }}>
            {venue.address}
          </Text>
          <Text className="text-xs mt-1" style={{ color: THEME.dark.mutedForeground }}>
            {venue.distanceKm} {ED_KM_AWAY}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="mt-4 flex-row items-center gap-3">
        {/* Get directions */}
        <Pressable
          onPress={handleGetDirections}
          className="flex-1 rounded-full py-3 items-center justify-center flex-row gap-2 border border-border">
          <Text className="text-foreground font-primary-semibold">{ED_GET_DIRECTIONS}</Text>
        </Pressable>

        {/* Copy address */}
        <Pressable
          onPress={handleCopy}
          className="w-12 h-12 rounded-full items-center justify-center border border-border">
          {copied
            ? <Check size={18} color={THEME.dark.primary} />
            : <Copy size={18} color={THEME.dark.foreground} />
          }
        </Pressable>

        {/* Share */}
        <Pressable
          onPress={handleShare}
          className="w-12 h-12 rounded-full items-center justify-center border border-border">
          <ShareIcon size={18} color={THEME.dark.foreground} />
        </Pressable>
      </View>
    </DetailSheetModal>
  );
}
