import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import type { EventCardData } from '@/interfaces/events.interface';
import { EventGridCard } from './EventGridCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListFilter, X } from 'lucide-react-native';
import { FilterBar } from './filter-bar';
import { FilterBottomSheet, type FilterState } from './filter-bottom-sheet';
import { fetchEvents } from '@/lib/api/events';
import type { FetchEventsParams } from '@/interfaces/events.interface';
import { ALL_EVENTS_TITLE, DATE_CHIPS, DEFAULT_SORT_BY, FILTER_BUTTON_LABEL, GENRE_CHIPS, NO_EVENTS_SUBTITLE, NO_EVENTS_TITLE, SORT_OPTIONS } from '@/constants/events.constants';

const PAGE_SIZE = 8;

interface EventsListingProps {
  loadMoreTrigger?: number;
  onHasMore?: (hasMore: boolean) => void;
  categoryFilter?: string;
  // When provided, filter state is owned externally and the header section is hidden
  externalActiveFilters?: FilterState;
  externalSelectedDateChips?: string[];
  externalSelectedGenreChips?: string[];
  hideHeader?: boolean;
}

export function EventsListing({
  loadMoreTrigger = 0,
  onHasMore,
  categoryFilter,
  externalActiveFilters,
  externalSelectedDateChips,
  externalSelectedGenreChips,
  hideHeader = false,
}: EventsListingProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [_activeFilters, _setActiveFilters] = useState<FilterState>({ sortBy: DEFAULT_SORT_BY, genres: [] });
  const [_selectedDateChips, _setSelectedDateChips] = useState<string[]>([]);
  const [_selectedGenreChips, _setSelectedGenreChips] = useState<string[]>([]);

  const activeFilters = externalActiveFilters ?? _activeFilters;
  const setActiveFilters = _setActiveFilters;
  const selectedDateChips = externalSelectedDateChips ?? _selectedDateChips;
  const setSelectedDateChips = _setSelectedDateChips;
  const selectedGenreChips = externalSelectedGenreChips ?? _selectedGenreChips;
  const setSelectedGenreChips = _setSelectedGenreChips;

  const [events, setEvents] = useState<EventCardData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Use refs to avoid stale closure issues in async effects
  const pageRef = useRef(1);
  const isLoadingMoreRef = useRef(false);

  const loadPage = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (reset) {
        setIsLoading(true);
        setEvents([]);
        pageRef.current = 1;
      } else {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      const params: FetchEventsParams = {
        page: pageNum,
        pageSize: PAGE_SIZE,
        sortBy: activeFilters.sortBy as FetchEventsParams['sortBy'],
        genres: [...selectedGenreChips, ...activeFilters.genres],
        dateFilter: selectedDateChips,
        category: categoryFilter,
      };

      try {
        const result = await fetchEvents(params);
        setEvents((prev) => (reset ? result.data : [...prev, ...result.data]));
        setHasMore(result.hasMore);
        onHasMore?.(result.hasMore);
        pageRef.current = pageNum;
      } finally {
        setIsLoading(false);
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [activeFilters, selectedDateChips, selectedGenreChips, onHasMore, categoryFilter]
  );

  // Reload from page 1 whenever filters change
  useEffect(() => {
    loadPage(1, true);
  }, [activeFilters, selectedDateChips, selectedGenreChips]);

  // Parent signals scroll near-bottom → load next page
  useEffect(() => {
    if (loadMoreTrigger === 0 || !hasMore || isLoadingMoreRef.current) return;
    loadPage(pageRef.current + 1, false);
  }, [loadMoreTrigger, hasMore, loadPage]);

  return (
    <View className="gap-4">
      {!hideHeader && (
        <View className="flex-col gap-4 justify-between">
          <Text className="text-foreground text-2xl font-primary-bold">{ALL_EVENTS_TITLE}</Text>

          <FilterBar
            activeFilters={activeFilters}
            selectedDateChips={selectedDateChips}
            selectedGenreChips={selectedGenreChips}
            onFilterPress={() => setIsFilterVisible(true)}
            onSortClear={() => setActiveFilters({ ...activeFilters, sortBy: DEFAULT_SORT_BY })}
            onGenreModalClear={(genre) => setActiveFilters({ ...activeFilters, genres: activeFilters.genres.filter((g) => g !== genre) })}
            onDateChipPress={(key) => setSelectedDateChips((prev) => (prev.includes(key) ? [] : [key]))}
            onGenreChipPress={(g) => setSelectedGenreChips((prev) => (prev.includes(g) ? prev.filter((p) => p !== g) : [...prev, g]))}
          />
        </View>
      )}

      {!hideHeader && (
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
      )}

      {isLoading ? (
        <View className="items-center py-10">
          <ActivityIndicator color="white" />
        </View>
      ) : events.length === 0 ? (
        <View className="items-center justify-center py-16 gap-2">
          <Text className="text-foreground text-lg font-primary-semibold">{NO_EVENTS_TITLE}</Text>
          <Text className="text-muted-foreground text-sm text-center">{NO_EVENTS_SUBTITLE}</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {events.map((event) => (
            <View key={event.id} className="w-[47%]">
              <EventGridCard item={event} />
            </View>
          ))}
        </View>
      )}

      {isLoadingMore && (
        <View className="items-center py-4">
          <ActivityIndicator color="white" />
        </View>
      )}

    </View>
  );
}
