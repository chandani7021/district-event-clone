import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { TrendingSection } from '@/components/search/trending-section';
import { ArtistCarousel } from '@/components/events/artist-carousel';
import { SearchResultItem } from '@/components/search/search-result-item';
import { mockArtists } from '@/lib/dummy-artist';
import { CategoriesListing } from '@/components/events/categories-listing';
import { searchContent } from '@/services/search.service';
import { getNavMenus } from '@/services/navigation.service';
import type { SearchResult, NavMenuItem } from '@/interfaces/navigation.interface';
import { THEME } from '@/lib/theme';
import { SearchScreenSkeleton } from '@/components/skeltons/search-screen-skeleton';
import { SEARCH_NO_RESULTS_SUBTITLE, SEARCH_PLACEHOLDER } from '@/constants/search.constants';

import { DUMMY_EVENTS } from '@/lib/dummy-events';

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menus, setMenus] = useState<NavMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    getNavMenus().then((data) => { setMenus(data); setLoading(false); });
    return () => clearTimeout(t);
  }, []);

  const handleMenuSelect = (id: string) => {
    setMenus((prev) => prev.map((m) => ({ ...m, isActive: m.id === id })));
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchContent(query);
        // Filter search results to only show events that have details in the system (DUMMY_EVENTS)
        // If type is 'event', it must exist in DUMMY_EVENTS.
        const filteredData = data.filter((item) => {
          if (item.type === 'event') {
            return DUMMY_EVENTS.some((e) => e.id === item.id);
          }
          return true; // For now, allow other types if any
        });
        setResults(filteredData);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);


  const showResults = query.trim().length > 0;
  const visibleMenus = menus.filter((m) => m.visible);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fixed top: search bar + nav menu + divider */}
      <View>
        {/* Search header */}
        <View className="flex-row items-center px-4 pt-2 pb-3 gap-3">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} color={THEME.dark.foreground} />
          </Pressable>

          <View className="flex-1 flex-row items-center bg-secondary rounded-full px-4 gap-2 h-[46px]">
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder={SEARCH_PLACEHOLDER}
              placeholderTextColor={THEME.dark.mutedForeground}
              className="flex-1 text-base text-foreground"
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <X size={16} color={THEME.dark.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>
       
        {/* Divider */}
        <View className="h-px bg-border" />
      </View>

      {showResults ? (
        // ── Search results ────────────────────────────────────────────
        isSearching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={THEME.dark.primary} size="large" />
          </View>
        ) : results.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2 px-8">
            <Text className="text-foreground text-base font-primary-semibold text-center">
              No results for "{query}"
            </Text>
            <Text className="text-secondary-foreground text-sm text-center">
              {SEARCH_NO_RESULTS_SUBTITLE}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
            contentContainerClassName="px-4 pt-2 pb-10"
            ItemSeparatorComponent={() => <View className="h-px bg-border" />}
            renderItem={({ item }) => <SearchResultItem item={item} />}
          />
        )
      ) : loading ? (
        <SearchScreenSkeleton />
      ) : (
        // ── Discovery view ────────────────────────────────────────────
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="pb-12 pt-5 gap-7">
          <TrendingSection />

          <View className="px-5 gap-7">
            <ArtistCarousel
              artists={mockArtists}
              onArtistPress={(artist) => router.push({ pathname: '/artist/[id]', params: { id: artist.id } })}
            />

            <CategoriesListing />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
