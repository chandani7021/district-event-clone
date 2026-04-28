import { CarouselCard } from '@/components/events/carousel-card';
import { EventCarousel } from '@/components/events/event-carousel';
import { CategoriesListing } from '@/components/events/categories-listing';
import { EventCardSkeleton } from '@/components/events/event-card-skeleton';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { EventCardData } from '@/interfaces/events.interface';
import { router, Stack } from 'expo-router';
import { MoonStarIcon, SunIcon, User, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { FilterBottomSheet, type FilterState } from '@/components/events/filter-bottom-sheet';
import { ListFilter } from 'lucide-react-native';
import { fetchCarouselEvents } from '@/lib/api/events';
import { ALL_EVENTS_TITLE, DATE_CHIPS, DEFAULT_SORT_BY, EVENTS_SCREEN_SUBTITLE, EVENTS_SCREEN_TITLE, FILTER_BUTTON_LABEL, GENRE_CHIPS, MORE_EVENTS_COMING_SOON, NO_EVENTS_SUBTITLE, NO_EVENTS_TITLE } from '@/constants/events.constants';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}

export default function EventsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    sortBy: DEFAULT_SORT_BY,
    genres: [],
  });
  const [selectedDateChips, setSelectedDateChips] = useState<string[]>([]);
  const [selectedGenreChips, setSelectedGenreChips] = useState<string[]>([]);
  const [carouselEvents, setCarouselEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCarouselEvents(5).then((data) => {
      if (!cancelled) {
        setCarouselEvents(data);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Text className="text-2xl font-primary-bold text-foreground">{EVENTS_SCREEN_TITLE}</Text>
        <View className="flex-row items-center gap-2">
          <ThemeToggle />
          <Pressable
            id="events-profile-btn"
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
            onPress={() => router.push('/auth/guest-screen')}
          >
            <User size={20} color="#FFFFFF" strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 gap-4"
        showsVerticalScrollIndicator={false}>

        {isLoading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          <View className="gap-6">
            <View className="flex-row items-center justify-between px-0">
              <View className="flex-1">
                <Text className="text-2xl font-primary-bold tracking-tight text-foreground">{ALL_EVENTS_TITLE}</Text>
                <Text className="text-muted-foreground text-base">{EVENTS_SCREEN_SUBTITLE}</Text>
              </View>

              {(() => {
                const hasActiveFilters =
                  selectedDateChips.length > 0 ||
                  selectedGenreChips.length > 0 ||
                  activeFilters.genres.length > 0 ||
                  activeFilters.sortBy !== DEFAULT_SORT_BY;
                return (
                  <View className="flex-row items-center gap-3">
                    <Button
                      variant="outline"
                      className={`flex-row items-center gap-2 rounded-full px-4 h-10 bg-foreground/5 ${hasActiveFilters ? 'border-white/50' : 'border-border'}`}
                      onPress={() => setIsFilterVisible(true)}
                    >
                      <ListFilter size={18} color="white" />
                      <Text className="text-foreground font-primary-medium">{FILTER_BUTTON_LABEL}</Text>
                    </Button>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxWidth: 320 }}>
                      <View className="flex-row gap-2">
                        {/** Date chips */}
                        {DATE_CHIPS.map(({ key, label }) => {
                          const active = selectedDateChips.includes(key);
                          return (
                            <Button
                              key={key}
                              variant={active ? 'secondary' : 'outline'}
                              className={`rounded-full h-10 px-4 ${active ? 'bg-primary border-primary' : 'border-border bg-foreground/5'}`}
                              onPress={() => {
                                setSelectedDateChips((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
                              }}
                            >
                              <Text className="text-foreground font-primary-medium">{label}</Text>
                              {active && <X size={14} color="white" className="ml-1" />}
                            </Button>
                          );
                        })}

                        {/** Genre chips */}
                        {GENRE_CHIPS.map((g) => {
                          const active = selectedGenreChips.includes(g);
                          return (
                            <Button
                              key={g}
                              variant={active ? 'secondary' : 'outline'}
                              className={`rounded-full h-10 px-4 ${active ? 'bg-primary border-primary' : 'border-border bg-foreground/5'}`}
                              onPress={() => {
                                setSelectedGenreChips((prev) => (prev.includes(g) ? prev.filter((p) => p !== g) : [...prev, g]));
                              }}
                            >
                              <Text className="text-foreground font-primary-medium">{g}</Text>
                              {active && <X size={14} color="white" className="ml-1" />}
                            </Button>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                );
              })()}
            </View>

            {carouselEvents.length === 0 ? (
              <View className="items-center justify-center py-16 gap-2">
                <Text className="text-foreground text-lg font-primary-semibold">{NO_EVENTS_TITLE}</Text>
                <Text className="text-muted-foreground text-sm text-center">{NO_EVENTS_SUBTITLE}</Text>
              </View>
            ) : (
              <EventCarousel<EventCardData>
                data={carouselEvents}
                renderItem={(item) => <CarouselCard item={item} />}
              />
            )}

            {(() => {
              const hasActiveFilters =
                selectedDateChips.length > 0 ||
                selectedGenreChips.length > 0 ||
                activeFilters.genres.length > 0 ||
                activeFilters.sortBy !== DEFAULT_SORT_BY;
              return (
                <View className="flex-row items-center gap-3">
                  <Button
                    variant="outline"
                    className={`flex-row items-center gap-2 rounded-full px-4 h-10 bg-foreground/5 ${hasActiveFilters ? 'border-white/50' : 'border-border'}`}
                    onPress={() => setIsFilterVisible(true)}
                  >
                    <ListFilter size={18} color="white" />
                    <Text className="text-foreground font-primary-medium">{FILTER_BUTTON_LABEL}</Text>
                  </Button>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                    <View className="flex-row gap-2">
                      {/** Date chips */}
                      {DATE_CHIPS.map(({ key, label }) => {
                        const active = selectedDateChips.includes(key);
                        return (
                          <Button
                            key={key}
                            variant={active ? 'secondary' : 'outline'}
                            className={`rounded-full h-10 px-4 ${active ? 'bg-primary border-primary' : 'border-border bg-foreground/5'}`}
                            onPress={() => {
                              setSelectedDateChips((prev) =>
                                prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
                              );
                            }}
                          >
                            <Text className="text-foreground font-primary-medium">{label}</Text>
                            {active && <X size={14} color="white" className="ml-1" />}
                          </Button>
                        );
                      })}

                      {/** Genre chips */}
                      {GENRE_CHIPS.map((g) => {
                        const active = selectedGenreChips.includes(g);
                        return (
                          <Button
                            key={g}
                            variant={active ? 'secondary' : 'outline'}
                            className={`rounded-full h-10 px-4 ${active ? 'bg-primary border-primary' : 'border-border bg-foreground/5'}`}
                            onPress={() => {
                              setSelectedGenreChips((prev) =>
                                prev.includes(g) ? prev.filter((p) => p !== g) : [...prev, g]
                              );
                            }}
                          >
                            <Text className="text-foreground font-primary-medium">{g}</Text>
                            {active && <X size={14} color="white" className="ml-1" />}
                          </Button>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              );
            })()}

            <CategoriesListing />

            <View className="items-center justify-center py-10">
              <Text className="text-muted-foreground text-base text-center">{MORE_EVENTS_COMING_SOON}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <FilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          setIsFilterVisible(false);
        }}
        onClear={() => {
          setActiveFilters({ sortBy: DEFAULT_SORT_BY, genres: [] });
          setSelectedDateChips([]);
          setSelectedGenreChips([]);
          setIsFilterVisible(false);
        }}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}

