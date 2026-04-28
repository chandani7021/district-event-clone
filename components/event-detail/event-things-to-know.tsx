import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Car,
  ChevronRight,
  Languages,
  PawPrint,
  Shield,
  ShoppingBag,
  Smile,
  Ticket,
  Users,
  Utensils,
  Wifi,
  Info,
  type LucideProps,
} from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventDetailThingToKnow, EventThingsToKnowProps } from '@/interfaces/event-detail.interface';
import { ED_SEE_ALL, ED_THINGS_TO_KNOW } from '@/constants/event-detail.constants';

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

function ThingToKnowIcon({ iconName }: { iconName: string }) {
  const IconComponent: LucideIcon = ICON_MAP[iconName] ?? Info;
  return <IconComponent size={18} color={THEME.dark.foreground} />;
}

export function EventThingsToKnow({ infoItems, onSeeAllPress }: EventThingsToKnowProps) {
  const displayItems = infoItems.slice(0, 4);

  return (
    <View className="px-5 mb-6">
      <Text className="text-foreground text-lg font-primary-bold mb-3">{ED_THINGS_TO_KNOW}</Text>

      <View className="rounded-xl overflow-hidden" style={{ backgroundColor: THEME.dark.secondary }}>
        {displayItems.map((item, index) => (
          <View key={item.iconName + item.label}>
            <View className="flex-row items-center gap-3 px-4 py-3">
              <ThingToKnowIcon iconName={item.iconName} />
              <Text className="text-foreground text-sm flex-1">{item.label}</Text>
            </View>
            {index < displayItems.length - 1 && (
              <View className="mx-4 h-px" style={{ backgroundColor: THEME.dark.border }} />
            )}
          </View>
        ))}
      </View>

      <Pressable onPress={onSeeAllPress} hitSlop={8} className="mt-2">
        <View className="flex-row items-center">
          <Text className="text-sm font-primary-semibold" style={{ color: THEME.dark.primary }}>
            {ED_SEE_ALL}
          </Text>
          <ChevronRight size={14} color={THEME.dark.primary} />
        </View>
      </Pressable>
    </View>
  );
}
