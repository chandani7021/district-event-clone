import React from 'react';
import { View } from 'react-native';
import {
  Car,
  Info,
  Languages,
  PawPrint,
  Shield,
  ShoppingBag,
  Smile,
  Ticket,
  Users,
  Utensils,
  Wifi,
  type LucideProps,
} from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { EventDetailThingToKnow, ThingsToKnowSheetProps } from '@/interfaces/event-detail.interface';
import {
  ED_AMENITIES_LABEL,
  ED_EVENT_INFO_LABEL,
  ED_THINGS_TITLE,
} from '@/constants/event-detail.constants';

type LucideIcon = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, LucideIcon> = {
  Languages,
  Users,
  Ticket,
  SmilePlus: Smile,
  PawPrint,
  Wifi,
  ShoppingBag,
  Utensils,
  Car,
  Shield,
};

function ThingRow({ item, showDivider }: { item: EventDetailThingToKnow; showDivider: boolean }) {
  const IconComponent: LucideIcon = ICON_MAP[item.iconName] ?? Info;
  return (
    <View>
      <View className="flex-row items-center gap-3 py-3">
        <IconComponent size={18} color={THEME.dark.foreground} />
        <Text className="text-foreground text-sm flex-1">{item.label}</Text>
      </View>
      {showDivider && (
        <View className="h-px" style={{ backgroundColor: THEME.dark.border }} />
      )}
    </View>
  );
}

export function ThingsToKnowSheet({
  isVisible,
  onClose,
  infoItems,
  amenityItems,
}: ThingsToKnowSheetProps) {
  return (
    <DetailSheetModal
      isVisible={isVisible}
      onClose={onClose}
      title={ED_THINGS_TITLE}
>
      {/* Event Info section */}
      <Text
        className="text-xs font-primary-bold tracking-widest mb-2"
        style={{ color: THEME.dark.mutedForeground }}>
        {ED_EVENT_INFO_LABEL}
      </Text>
      <View
        className="rounded-xl px-4 mb-5"
        style={{ backgroundColor: THEME.dark.secondary }}>
        {infoItems.map((item, index) => (
          <ThingRow
            key={item.iconName + item.label}
            item={item}
            showDivider={index < infoItems.length - 1}
          />
        ))}
      </View>

      {/* Amenities section */}
      <Text
        className="text-xs font-primary-bold tracking-widest mb-2"
        style={{ color: THEME.dark.mutedForeground }}>
        {ED_AMENITIES_LABEL}
      </Text>
      <View
        className="rounded-xl px-4"
        style={{ backgroundColor: THEME.dark.secondary }}>
        {amenityItems.map((item, index) => (
          <ThingRow
            key={item.iconName + item.label}
            item={item}
            showDivider={index < amenityItems.length - 1}
          />
        ))}
      </View>
    </DetailSheetModal>
  );
}
