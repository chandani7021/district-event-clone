import { type ComponentType, useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { Bookmark, ChevronDown, Home, MapPin, Search, User } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import type { NavLocation, NavMenuItem } from '@/interfaces/navigation.interface';
import { getCurrentLocation, getNavMenus } from '@/services/navigation.service';

const MENU_ICONS: Partial<Record<string, ComponentType<{ size: number; color: string }>>> = {
  home: Home,
};

const LOCATION_ROW_H = 60;

// ── Props ─────────────────────────────────────────────────────────────────────

interface NavbarProps {
  scrollY?: Animated.Value;
  onLocationPress?: () => void;
  onBookmarkPress?: () => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;
  onMenuSelect?: (id: string) => void;
  showBookmark?: boolean;
}

export function Navbar({
  scrollY,
  onLocationPress,
  onBookmarkPress,
  onProfilePress,
  onSearchPress,
  onMenuSelect,
  showBookmark = true,
}: NavbarProps) {
  const [location, setLocation] = useState<NavLocation | null>(null);
  const [menus, setMenus] = useState<NavMenuItem[]>([]);

  // Fetch location and menus from service on mount
  useEffect(() => {
    getCurrentLocation().then(setLocation);
    getNavMenus().then(setMenus);
  }, []);

  const visibleMenus = menus.filter((m) => m.visible);

  const handleMenuSelect = (id: string) => {
    setMenus((prev) => prev.map((m) => ({ ...m, isActive: m.id === id })));
    onMenuSelect?.(id);
  };

  // Animate the location row height + opacity out as the user scrolls
  const locationRowAnimated: object | undefined = scrollY
    ? {
        height: scrollY.interpolate({
          inputRange: [0, LOCATION_ROW_H],
          outputRange: [LOCATION_ROW_H, 0],
          extrapolate: 'clamp',
        }),
        opacity: scrollY.interpolate({
          inputRange: [0, LOCATION_ROW_H * 0.6],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
        overflow: 'hidden',
      }
    : undefined;

  return (
    <View className="bg-background px-lg pt-sm">
      {/* ── Row 1: Location + actions (scrolls away) ─────────────── */}
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: LOCATION_ROW_H,
            overflow: 'hidden',
          },
          locationRowAnimated,
        ]}
      >
        <Pressable className="flex-row items-center gap-sm flex-1 mr-lg" onPress={onLocationPress} hitSlop={6}>
          <MapPin size={20} color={THEME.dark.foreground} />
          <View>
            <View className="flex-row items-center gap-xs">
              <Text className="text-foreground text-md font-primary-bold" numberOfLines={1}>
                {location?.name ?? '—'}
              </Text>
              <ChevronDown size={15} color={THEME.dark.foreground} />
            </View>
            <Text className="text-muted-foreground text-sm mt-[1px]">
              {location ? `${location.area}, ${location.city}` : ''}
            </Text>
          </View>
        </Pressable>

        <View className="flex-row items-center gap-lg">
          {showBookmark && (
            <Pressable onPress={onBookmarkPress} hitSlop={8}>
              <Bookmark size={22} color={THEME.dark.foreground} strokeWidth={1.5} />
            </Pressable>
          )}
          <Pressable
            className="w-[36px] h-[36px] rounded-full bg-secondary items-center justify-center"
            onPress={onProfilePress}
            hitSlop={8}
          >
            <User size={20} color={THEME.dark.input} />
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Row 2: Search bar (navigates to search screen) ──────── */}
      <Pressable
        className="flex-row items-center bg-secondary rounded-full px-lg h-[46px] gap-sm mb-xs"
        onPress={onSearchPress}>
        <Search size={18} color={THEME.dark.mutedForeground} />
        <Text className="flex-1 text-sm" style={{ color: THEME.dark.mutedForeground }}>
          Search for events, artists, and more
        </Text>
      </Pressable>
      {/* [TODO]: for now no need of menu tabs, can be added later when we have more than 1 menu */}
      {/* ── Row 3: Menu tabs (sticky) ────────────────────────────── */}
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="items-center pb-[2px]"
      >
        {visibleMenus.map((item) => {
          const Icon = MENU_ICONS[item.id];
          return (
            <Pressable
              key={item.id}
              className="flex-row items-center relative px-md py-[10px] gap-[5px]"
              onPress={() => handleMenuSelect(item.id)}
            >
              {Icon && (
                <Icon
                  size={15}
                  color={item.isActive ? THEME.dark.foreground : THEME.dark.mutedForeground}
                />
              )}
              <Text
                className={`text-base font-primary-medium ${item.isActive ? 'text-foreground font-primary-bold' : 'text-muted-foreground'}`}
              >
                {item.label}
              </Text>
              {item.isActive && (
                <View className="absolute bottom-0 left-md right-md h-[2px] bg-primary rounded-[4px]" />
              )}
            </Pressable>
          );
        })}
      </ScrollView> */}
    </View>
  );
}
