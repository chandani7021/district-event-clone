import { useEffect, useState } from 'react';
import { View, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { fetchPopularCities, type City } from '@/lib/api/location';
import { LocationBottomSheetSkeleton } from '@/components/skeltons/location-bottom-sheet-skeleton';

interface LocationBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCity?: (city: Pick<City, 'id' | 'name'>) => void;
}

export function LocationBottomSheet({ isVisible, onClose, onSelectCity }: LocationBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isVisible) return;
    setLoading(true);
    fetchPopularCities()
      .then(setCities)
      .finally(() => setLoading(false));
  }, [isVisible]);

  const handleSelectCity = (city: Pick<City, 'id' | 'name'>) => {
    onSelectCity?.(city);
    onClose();
  };

  const filtered = searchQuery.trim()
    ? cities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cities;

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      {loading ? (
        <LocationBottomSheetSkeleton />
      ) : (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

          {/* ── Header ───────────────────────────────────────────── */}
          <View className="flex-row items-center px-lg pt-md pb-3 gap-md">
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-secondary items-center justify-center"
              hitSlop={8}
            >
              <ChevronDown size={20} color={THEME.dark.foreground} />
            </Pressable>
            <Text className="text-foreground text-xl font-primary-bold">Location</Text>
          </View>

          {/* ── Search bar ───────────────────────────────────────── */}
          <View className="px-lg mb-8 pt-sm">
            <View className="flex-row items-center bg-secondary rounded-full px-lg h-12 gap-sm">
              <Search size={18} color={THEME.dark.mutedForeground} />
              <TextInput
                className="flex-1 text-foreground text-base"
                placeholder="Search city, area or locality"
                placeholderTextColor={THEME.dark.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>
          </View>

          {/* ── Scrollable content ───────────────────────────────── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          >
            {filtered.length === 0 && searchQuery.trim() ? (
              <Text className="text-muted-foreground text-base text-center mt-8">
                No cities found for "{searchQuery}"
              </Text>
            ) : (
            <>
              <Text className="text-foreground text-lg font-primary-bold mb-lg">Popular cities</Text>
              <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                {filtered.map(({ id, name, Icon }) => (
                  <Pressable
                    key={id}
                    onPress={() => handleSelectCity({ id, name })}
                    className="bg-secondary rounded-2xl items-center justify-center py-xl"
                    style={{ width: '30.5%' }}
                  >
                    <View
                      className="items-center justify-center mb-md"
                      style={{ width: 52, height: 52 }}
                    >
                      <Icon size={36} color={THEME.dark.brandMedium} strokeWidth={1.2} />
                    </View>
                    <Text className="text-foreground text-sm font-primary-medium text-center" numberOfLines={2}>
                      {name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
            )}
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
