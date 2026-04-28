import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ArtistEventCard } from '@/components/artist/artist-event-card';
import { ArtistDetailSkeleton } from '@/components/artist/artist-detail-skeleton';
import { fetchArtistDetail } from '@/services/artist.service';
import type { ArtistDetail } from '@/interfaces/artist.interface';
import { THEME } from '@/lib/theme';
import { ARTIST_ADD_TO_HOTLIST_LABEL, ARTIST_EVENTS_NEAR_YOU, ARTIST_EVENTS_OTHER_CITIES, ARTIST_HOTLISTED_LABEL, ARTIST_NOT_FOUND, ARTIST_SHOW_LESS, ARTIST_SHOW_MORE } from '@/constants/artist.constants';
import { ALL_EVENTS_TITLE } from '@/constants/events.constants';
import { HotlistPickerSheet } from '@/components/hotlist/hotlist-picker-sheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.55;
const HEADER_HEIGHT = 100;

function SectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-md my-xs">
      <View className="flex-1 h-px bg-border" />
      <Text className="text-muted-foreground text-[11px] font-primary-bold tracking-[2px] uppercase">
        {label}
      </Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
}

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [hotlisted] = useState(false);
  const [hotlistPickerVisible, setHotlistPickerVisible] = useState(false);
  const [selectedHotlistItem, setSelectedHotlistItem] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchArtistDetail(id ?? '').then((data) => {
      setArtist(data);
      setLoading(false);
    });
  }, [id]);

  const handleHotlistPress = (itemId: string, itemName: string) => {
    setSelectedHotlistItem({ id: itemId, name: itemName });
    setHotlistPickerVisible(true);
  };

  const handleShare = async () => {
    if (!artist) return;
    try {
      await Share.share({
        message: `Check out ${artist.name} on district-clone!`,
        title: artist.name,
      });
    } catch {
      // dismissed
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ArtistDetailSkeleton topInset={insets.top} />
      </>
    );
  }

  if (!artist) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-foreground">{ARTIST_NOT_FOUND}</Text>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 120, HERO_HEIGHT - 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 120, HERO_HEIGHT - 60],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Sticky Header (Dynamic) ── */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 60,
          zIndex: 10,
          backgroundColor: THEME.dark.card,
          opacity: headerOpacity,
          borderBottomWidth: 1,
          borderBottomColor: THEME.dark.border,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top,
          paddingHorizontal: 70, // Room for back/share buttons
        }}>
        <Animated.Text
          style={{
            transform: [{ translateY: headerTranslateY }],
          }}
          className="text-foreground text-lg font-primary-bold text-center flex-1"
          numberOfLines={1}>
          {artist.name}
        </Animated.Text>
      </Animated.View>

      {/* Static Buttons (Always on top) */}
      <View
        className="absolute left-0 right-0 flex-row justify-between px-lg z-20"
        pointerEvents="box-none"
        style={{ top: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center shadow-sm">
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </Pressable>

        <Pressable
          onPress={handleShare}
          hitSlop={8}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center shadow-sm">
          <Share2 size={20} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 48) }}
      >
        {/* ── Hero image ── */}
        <View style={{ height: HERO_HEIGHT }}>
          <Image
            source={{ uri: artist.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Gradient fade into screen bg */}
          <LinearGradient
            colors={['rgba(10,10,10,0)', THEME.dark.background]}
            className="absolute bottom-0 left-0 right-0 h-[160px]"
          />
        </View>

        {/* ── Content ── */}
        <View className="px-xl pb-jumbo gap-lg -mt-xl bg-background rounded-t-3xl pt-lg">

          {/* Name + Hotlist */}
          <View className="flex-row items-center justify-between gap-md">
            <Text style={{ color: THEME.dark.foreground, }} className="text-foreground text-xl flex-1" numberOfLines={1}>
              {artist.name}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleHotlistPress(artist.id, artist.name)}
              className="flex-row items-center justify-center gap-1.5 min-w-32 px-3 py-2 rounded-md border"
              style={{
                borderColor: hotlisted ? THEME.dark.primary : THEME.dark.border,
                backgroundColor: hotlisted ? 'rgba(232,234,3,0.12)' : 'transparent',
              }}>
              <Bookmark
                size={15}
                color={hotlisted ? THEME.dark.primary : THEME.dark.foreground}
                fill={hotlisted ? THEME.dark.primary : 'transparent'}
              />
              <Text
                className="text-sm font-primary-semibold"
                style={{ color: hotlisted ? THEME.dark.primary : THEME.dark.foreground }}>
                {hotlisted ? ARTIST_HOTLISTED_LABEL : ARTIST_ADD_TO_HOTLIST_LABEL}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View className="gap-xs">
            <Text
              className="text-secondary-foreground text-base"
              style={{ lineHeight: 22 }}
              numberOfLines={bioExpanded ? undefined : 3}>
              {artist.bio}
            </Text>
            <Pressable onPress={() => setBioExpanded((v) => !v)}>
              <Text className="text-foreground text-base font-primary-semibold">
                {bioExpanded ? ARTIST_SHOW_LESS : ARTIST_SHOW_MORE}
              </Text>
            </Pressable>
          </View>

          {/* All events section */}
          {(artist.nearYouEvents.length > 0 || artist.otherCityEvents.length > 0) && (
            <>
              <Text className="text-foreground text-lg mt-sm">{ALL_EVENTS_TITLE}</Text>

              {/* Near you */}
              {artist.nearYouEvents.length > 0 && (
                <View className="gap-md">
                  <SectionDivider label={ARTIST_EVENTS_NEAR_YOU} />
                  {artist.nearYouEvents.map((event) => (
                    <ArtistEventCard
                      key={event.id}
                      item={event}
                      onHotlistPress={() => handleHotlistPress(event.id, event.title)}
                    />
                  ))}
                </View>
              )}

              {/* Other cities */}
              {artist.otherCityEvents.length > 0 && (
                <View className="gap-md">
                  <SectionDivider label={ARTIST_EVENTS_OTHER_CITIES} />
                  {artist.otherCityEvents.map((event) => (
                    <ArtistEventCard
                      key={event.id}
                      item={event}
                      onHotlistPress={() => handleHotlistPress(event.id, event.title)}
                    />

                  ))}

                </View>
              )}

            </>
          )}
        </View>
      </Animated.ScrollView>
      <HotlistPickerSheet
        visible={hotlistPickerVisible}
        onClose={() => {
          setHotlistPickerVisible(false);
          setSelectedHotlistItem(null);
        }}
        eventTitle={selectedHotlistItem?.name ?? artist.name}
        eventId={selectedHotlistItem?.id ?? artist.id}
      />
    </View>
  );
}

