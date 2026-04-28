import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Share,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, ScrollView, type ScrollView as RNGHScrollView } from 'react-native-gesture-handler';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import { toEventDetail } from '@/lib/event-utils';
import type { EventDetail, EventDetailArtist } from '@/interfaces/event-detail.interface';

import { EventDetailSkeleton } from '@/components/event-detail/event-detail-skeleton';
import { EventMedia } from '@/components/event-detail/event-media';
import { EventHeader } from '@/components/event-detail/event-header';
import { EventLocationRow } from '@/components/event-detail/event-location-row';
import { EventScheduleRow } from '@/components/event-detail/event-schedule-row';
import { EventHighlights } from '@/components/event-detail/event-highlights';
import { EventArtistSection } from '@/components/event-detail/event-artist-section';
import { EventAboutSection } from '@/components/event-detail/event-about-section';
import { EventThingsToKnow } from '@/components/event-detail/event-things-to-know';
import { EventGallery } from '@/components/event-detail/event-gallery';
import { EventMoreSection } from '@/components/event-detail/event-more-section';
import { EventBookingBar } from '@/components/event-detail/event-booking-bar';
import { GalleryFullscreen } from '@/components/event-detail/gallery-fullscreen';
import { bookingSession } from '@/services/booking.service';
import { ActiveBookingBanner } from '@/components/event-detail/active-booking-banner';

import { ReplaceTicketsSheet } from '@/components/booking/replace-tickets-sheet';
import { VenueSheet } from '@/components/event-detail/sheets/venue-sheet';
import { ScheduleSheet } from '@/components/event-detail/sheets/schedule-sheet';
import { ArtistSheet } from '@/components/event-detail/sheets/artist-sheet';
import { AboutSheet } from '@/components/event-detail/sheets/about-sheet';
import { ThingsToKnowSheet } from '@/components/event-detail/sheets/things-to-know-sheet';
import { FaqSheet } from '@/components/event-detail/sheets/faq-sheet';
import { TermsSheet } from '@/components/event-detail/sheets/terms-sheet';
import { SaleTimelineSheet } from '@/components/event-detail/sheets/sale-timeline-sheet';
import { ED_ABOUT_TITLE, ED_EVENT_NOT_FOUND } from '@/constants/event-detail.constants';
import { HotlistPickerSheet } from '@/components/hotlist/hotlist-picker-sheet';

const { height } = Dimensions.get('window');

const SNAP_COLLAPSED = height * 0.6;

async function fetchEventDetail(id: string): Promise<EventDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const card = DUMMY_EVENTS.find((e) => e.id === id);
  if (!card) return null;
  return toEventDetail(card);
}


export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTicketsCount, setActiveTicketsCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [activeBookingEventId, setActiveBookingEventId] = useState<string | null>(null);
  const [activeBookingEventTitle, setActiveBookingEventTitle] = useState<string | null>(null);
  const [showReplaceSheet, setShowReplaceSheet] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const session = bookingSession.get();
      const tickets = session.selectedTickets ?? [];
      setActiveTicketsCount(tickets.reduce((sum, t) => sum + t.quantity, 0));
      setActiveBookingEventId(session.eventId ?? null);
      setActiveBookingEventTitle(session.eventTitle ?? null);

      if (!session.timerEndTime) return;

      const endTime = session.timerEndTime;
      const tick = () => {
        setSecondsLeft(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));
      };
      tick();
      const id = setInterval(tick, 500);
      return () => clearInterval(id);
    }, []),
  );

  // Only show the active banner when the session belongs to THIS event
  const showActiveBookingBanner =
    activeTicketsCount > 0 && secondsLeft > 0 && activeBookingEventId === event?.id;


  // Sheet visibility state
  const [showVenue, setShowVenue] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showArtist, setShowArtist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<EventDetailArtist | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showThingsToKnow, setShowThingsToKnow] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSaleTimeline, setShowSaleTimeline] = useState(false);
  const [isHotlisted] = useState(false);
  const [hotlistPickerVisible, setHotlistPickerVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Gallery state
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Draggable sheet animation
  const insets = useSafeAreaInsets();
  const topInset = insets.top;
  // Sheet expands to just above the media header icons (insets.top + icon row ~48px + margin)
  const snapExpanded = topInset + 60;
  const snapExpandedRef = useRef(snapExpanded);
  snapExpandedRef.current = snapExpanded;

  const snapExpandedVal = useSharedValue(snapExpanded);
  const snapCollapsedVal = useSharedValue(SNAP_COLLAPSED);
  const translateY = useSharedValue(SNAP_COLLAPSED);
  const currentSnap = useSharedValue(SNAP_COLLAPSED);
  const scrollYRef = useSharedValue(0);
  const scrollRef = useRef<RNGHScrollView>(null);
  const isDraggingSheet = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .simultaneousWithExternalGesture(scrollRef)
    .onBegin(() => {
      // Determine intent the instant the finger touches the screen
      // If we are expanded AND the title is scrolled off-screen (>100px),
      // strictly lock this touch to SCROLLING only.
      const isActuallyExpanded = translateY.value < snapCollapsedVal.value - 20;

      if (isActuallyExpanded && scrollYRef.value > 100) {
        isDraggingSheet.value = false;
      } else {
        isDraggingSheet.value = true;
      }
    })
    .onUpdate((e) => {
      // If we determined this gesture is for scrolling, NEVER move the sheet
      if (!isDraggingSheet.value) return;

      const isActuallyExpanded = translateY.value < snapCollapsedVal.value - 20;

      // When expanded, only allow collapsing if near the top of scroll AND dragging down
      if (isActuallyExpanded) {
        if (scrollYRef.value > 100) return; // Let scrollview handle it
        if (e.translationY <= 0) return;    // Let scrollview handle upward drag too
      }

      const newY = currentSnap.value + e.translationY;
      if (newY >= snapExpandedVal.value && newY <= snapCollapsedVal.value) {
        translateY.value = newY;
      }
    })
    .onEnd((e) => {
      if (!isDraggingSheet.value) return;

      const currentY = currentSnap.value + e.translationY;
      const mid = (snapExpandedVal.value + snapCollapsedVal.value) / 2;
      let target = currentSnap.value;

      const isActuallyExpanded = translateY.value < snapCollapsedVal.value - 20;

      if (isActuallyExpanded && scrollYRef.value > 100) {
        // Was scrolled — don't change snap position
        return;
      }

      if (e.velocityY < -400) {
        target = snapExpandedVal.value;
      } else if (e.velocityY > 400) {
        target = snapCollapsedVal.value;
      } else {
        target = currentY < mid ? snapExpandedVal.value : snapCollapsedVal.value;
      }

      currentSnap.value = target;
      translateY.value = withSpring(target, { damping: 25, stiffness: 300, mass: 0.7 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    fetchEventDetail(id ?? '').then((data) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  const handleKnowMorePress = (artist: EventDetailArtist) => {
    setSelectedArtist(artist);
    setShowArtist(true);
  };

  const handleGalleryImagePress = (index: number) => {
    setGalleryImages(event?.gallery ?? []);
    setGalleryIndex(index);
    setShowGallery(true);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <EventDetailSkeleton />
      </>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-foreground">{ED_EVENT_NOT_FOUND}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Full-screen media background */}
      <View className="absolute inset-0">
        <EventMedia
          images={event.mediaImages}
          onGalleryPress={() => {
            setGalleryImages(event.mediaImages);
            setGalleryIndex(0);
            setShowGallery(true);
          }}
          isHotlisted={isHotlisted}
          onHotlistToggle={() => setHotlistPickerVisible(true)}
          onSharePress={() => {
            Share.share({ message: event.title, title: event.title });
          }}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted(!isMuted)}
          showMute={event.mediaImages.length > 0 && event.mediaImages[0]?.match(/\.(mp4|mov|m3u8)$/i) !== null}
        />
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="rounded-t-3xl overflow-hidden"
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: THEME.dark.card,
            },
            animatedStyle,
          ]}>
          <View className="items-center py-3">
            <View
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
          </View>

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            bounces={false}
            className="flex-1 mb-8"
            contentContainerStyle={{ paddingBottom: 160 }}
            scrollEventThrottle={16}
            onScroll={(e) => {
              scrollYRef.value = e.nativeEvent.contentOffset.y;
            }}
            onScrollBeginDrag={() => {
              // Auto-expand when user starts scrolling while collapsed
              if (currentSnap.value !== snapExpanded) {
                currentSnap.value = snapExpanded;
                translateY.value = withTiming(snapExpanded, { duration: 300 });
              }
            }}>
            <EventHeader
              categories={event.categories}
              title={event.title}
              date={event.date}
              time={event.time}
            />

            <EventLocationRow venue={event.venue} onPress={() => setShowVenue(true)} />

            <EventScheduleRow schedule={event.schedule} multiDaySchedule={event.multiDaySchedule} onPress={() => setShowSchedule(true)} />

            {event.highlights.length > 0 && (
              <EventHighlights highlights={event.highlights} />
            )}

            {event.artists.length > 0 && (
              <EventArtistSection artists={event.artists} onKnowMorePress={handleKnowMorePress} />
            )}

            <EventAboutSection about={event.about} onReadMorePress={() => setShowAbout(true)} />

            {event.thingsToKnowInfo.length > 0 && (
              <EventThingsToKnow
                infoItems={event.thingsToKnowInfo}
                onSeeAllPress={() => setShowThingsToKnow(true)}
              />
            )}

            {event.gallery.length > 0 && (
              <EventGallery images={event.gallery} onImagePress={handleGalleryImagePress} />
            )}

            <EventMoreSection
              onFaqPress={() => setShowFaq(true)}
              onTermsPress={() => setShowTerms(true)}
            />
          </ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Fixed booking bar at bottom */}
      {showActiveBookingBanner ? (
        <ActiveBookingBanner
          activeTicketsCount={activeTicketsCount}
          secondsLeft={secondsLeft}
          bottomInset={insets.bottom}
          onPress={() => {
            router.push({
              pathname: '/booking/[eventId]' as never,
              params: {
                eventId: event.id,
                title: event.title,
                subtitle: `${event.date} | ${event.time} onwards | ${event.venue.name}`,
                seating_type: event.seating_type ?? 'non_seated',
                price_min: String(event.priceMin),
                price_max: String(event.priceMax),
                currency: event.currency,
              },
            });
          }}
        />
      ) : (
        <EventBookingBar
          priceMin={event.priceMin}
          currency={event.currency}
          saleStatus={event.saleStatus}
          onBookPress={() => {
            router.push({
              pathname: '/booking/[eventId]' as never,
              params: {
                eventId: event.id,
                title: event.title,
                subtitle: `${event.date} | ${event.time} onwards | ${event.venue.name}`,
                seating_type: event.seating_type ?? 'non_seated',
                price_min: String(event.priceMin),
                price_max: String(event.priceMax),
                currency: event.currency,
              },
            });
          }}
          onSaleLabelPress={() => setShowSaleTimeline(true)}
          hasSaleTimeline={event.saleTimeline.length > 0}
        />
      )}

      {/* ── Sheets ── */}
      <VenueSheet
        isVisible={showVenue}
        onClose={() => setShowVenue(false)}
        venue={event.venue}
      />

      <ScheduleSheet
        isVisible={showSchedule}
        onClose={() => setShowSchedule(false)}
        schedule={event.schedule}
        multiDaySchedule={event.multiDaySchedule}
      />

      <ArtistSheet
        isVisible={showArtist}
        onClose={() => {
          setShowArtist(false);
          setSelectedArtist(null);
        }}
        artist={selectedArtist}
      />

      <AboutSheet
        isVisible={showAbout}
        onClose={() => setShowAbout(false)}
        title={ED_ABOUT_TITLE}
        about={event.about}
      />

      <ThingsToKnowSheet
        isVisible={showThingsToKnow}
        onClose={() => setShowThingsToKnow(false)}
        infoItems={event.thingsToKnowInfo}
        amenityItems={event.thingsToKnowAmenities}
      />

      <FaqSheet
        isVisible={showFaq}
        onClose={() => setShowFaq(false)}
        items={event.faq}
      />

      <TermsSheet
        isVisible={showTerms}
        onClose={() => setShowTerms(false)}
        items={event.termsAndConditions}
      />

      <SaleTimelineSheet
        isVisible={showSaleTimeline}
        onClose={() => setShowSaleTimeline(false)}
        entries={event.saleTimeline}
      />

      <HotlistPickerSheet
        visible={hotlistPickerVisible}
        onClose={() => setHotlistPickerVisible(false)}
        eventTitle={event.title}
      />

      {/* Gallery fullscreen */}
      <GalleryFullscreen
        isVisible={showGallery}
        onClose={() => setShowGallery(false)}
        images={galleryImages}
        initialIndex={galleryIndex}
        eventTitle={event.title}
      />

    </View>
  );
}
