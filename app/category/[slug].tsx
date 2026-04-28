import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { EventCarousel } from '@/components/events/event-carousel';
import { EventsListing } from '@/components/events/events-listing';
import { FilterBar } from '@/components/events/filter-bar';
import { FeaturedCard } from '@/components/category/featured-card';
import { FilterBottomSheet, type FilterState } from '@/components/events/filter-bottom-sheet';
import { fetchCategoryEvents } from '@/lib/api/events';
import type { EventCardData } from '@/interfaces/events.interface';
import { fetchCategoryDetail } from '@/services/category.service';
import type { CategoryDetail } from '@/interfaces/category.interface';
import { getCategoryMenus } from '@/services/navigation.service';
import type { NavMenuItem } from '@/interfaces/navigation.interface';
import { THEME } from '@/lib/theme';
import { slugToTitle } from '@/lib/utils';
import { CategoryScreenSkeleton } from '@/components/skeltons/category-screen-skeleton';
import {
  ALL_EVENTS_TITLE,
  DATE_CHIPS,
  DEFAULT_SORT_BY,
  DEFAULT_SUB_CATEGORY,
  FEATURED_CAROUSEL_TITLE,
  FILTER_BUTTON_LABEL,
  GENRE_CHIPS,
  SORT_OPTIONS,
} from '@/constants/events.constants';

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [menus, setMenus] = useState<NavMenuItem[]>([]);
  const [activeSubCategory, setActiveSubCategory] = useState(DEFAULT_SUB_CATEGORY);
  const [featuredEvents, setFeaturedEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state — lifted here so the filter bar can be a sticky header
  const [activeFilters, setActiveFilters] = useState<FilterState>({ sortBy: DEFAULT_SORT_BY, genres: [] });
  const [selectedDateChips, setSelectedDateChips] = useState<string[]>([]);
  const [selectedGenreChips, setSelectedGenreChips] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const isGenreSelected = activeFilters.genres.length > 0 || selectedGenreChips.length > 0;

  useEffect(() => {
    setLoading(true);
    const s = slug ?? '';
    Promise.all([
      fetchCategoryDetail(s),
      getCategoryMenus(s),
      fetchCategoryEvents(s, 5),
    ]).then(([detail, navMenus, events]) => {
      setCategory(detail);
      setMenus(navMenus);
      setFeaturedEvents(events);
      setLoading(false);
    });
  }, [slug]);

  const title = slugToTitle(slug, category?.title);

  const visibleMenus = menus.filter((m) => m.visible);

  const showCarousel = activeSubCategory === DEFAULT_SUB_CATEGORY && featuredEvents.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background gap-0" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fixed top bar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </Pressable>
        <Pressable
          hitSlop={8}
          onPress={() => router.push('/search')}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
        >
          <Search size={22} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      {loading && <CategoryScreenSkeleton />}

      {/* stickyHeaderIndices: [1] = nav menu, [3] = filter bar */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1, 4]}
        keyboardShouldPersistTaps="handled"
        className={loading ? 'hidden' : 'pt-0'}>

        {/* [0] Hero */}
        <View className="min-h-140 px-5 pb-5">
          <Text className="text-2xl font-primary-bold leading-relaxed text-foreground">
            {title}
          </Text>
          {category?.image_url && (
            <Image
              source={{ uri: category.image_url }}
              className="absolute right-4 top-0"
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
          )}
        </View>

        {/* [1] Sticky sub-nav + divider */}
        <View className="bg-background">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 items-center pb-xxs">
            {visibleMenus.map((sub) => {
              const isActive = activeSubCategory === sub.id;
              return (
                <Pressable
                  key={sub.id}
                  className="relative px-3 py-2.5"
                  onPress={() => setActiveSubCategory(sub.id)}>
                  <Text className={`text-sm ${isActive ? 'font-primary-bold text-foreground' : 'font-primary-medium text-muted-foreground'}`}>
                    {sub.label}
                  </Text>
                  {isActive && (
                    <View className="absolute bottom-0 left-3 right-3 h-xxs rounded-full bg-primary" />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
          <View className="h-px bg-border" />
        </View>

        {/* [2] Featured carousel (always rendered to keep indices stable) */}
        <View className={showCarousel ? 'pt-6 pb-4' : ''}>
          {showCarousel && (
            <EventCarousel
              data={featuredEvents}
              title={FEATURED_CAROUSEL_TITLE}
              cardHeight={380}
              autoPlay
              renderItem={(item) => <FeaturedCard item={item} />}
            />
          )}
        </View>

        {/* [3] "All events" heading — scrolls with page */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-primary-bold text-foreground">{ALL_EVENTS_TITLE}</Text>
        </View>

        {/* [4] Sticky filter chips row */}
        <FilterBar
          className="px-5 pb-3"
          activeFilters={activeFilters}
          selectedDateChips={selectedDateChips}
          selectedGenreChips={selectedGenreChips}
          onFilterPress={() => setIsFilterVisible(true)}
          onSortClear={() => setActiveFilters({ ...activeFilters, sortBy: DEFAULT_SORT_BY })}
          onGenreModalClear={(genre) => setActiveFilters({ ...activeFilters, genres: activeFilters.genres.filter((g) => g !== genre) })}
          onDateChipPress={(key) => setSelectedDateChips((prev) => prev.includes(key) ? [] : [key])}
          onGenreChipPress={(g) => setSelectedGenreChips((prev) => prev.includes(g) ? prev.filter((p) => p !== g) : [...prev, g])}
        />

        {/* [5] Events grid */}
        <View className="px-5 pb-12 pt-4">
          <EventsListing
            categoryFilter={slug}
            hideHeader
            externalActiveFilters={activeFilters}
            externalSelectedDateChips={selectedDateChips}
            externalSelectedGenreChips={selectedGenreChips}
          />
        </View>
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
