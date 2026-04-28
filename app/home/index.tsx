import { useCallback, useRef, useState } from 'react';
import { Animated, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navbar } from '@/components/composite/navbar';
import { EventsContent } from '@/components/home/events-content';
import { LocationBottomSheet } from '@/components/composite/location-bottom-sheet';
import { checkSession } from '@/services/auth.service';

const SCROLL_THRESHOLD = 300;

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeMenu, setActiveMenu] = useState('events');
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isTriggering = useRef(false);

  useFocusEffect(
    useCallback(() => {
      checkSession().then((res) => setIsLoggedIn(res.isAuthenticated));
    }, [])
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasMore || isTriggering.current) return;
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
    if (distanceFromBottom < SCROLL_THRESHOLD) {
      isTriggering.current = true;
      setLoadMoreTrigger((prev) => prev + 1);
      setTimeout(() => { isTriggering.current = false; }, 1500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* [TODO]: for now no need of*/}
      <Navbar
        scrollY={scrollY}
        onLocationPress={() => setLocationSheetVisible(true)}
        onSearchPress={() => router.push('/search')}
        onBookmarkPress={() => router.push('/hotlist')}
        onProfilePress={() => router.push('/profile')}
        onMenuSelect={setActiveMenu}
        showBookmark={isLoggedIn}
      />

      <Animated.ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
      >
        {activeMenu === 'events' && (
          <EventsContent
            loadMoreTrigger={loadMoreTrigger}
            onHasMore={setHasMore}
          />
        )}
      </Animated.ScrollView>

      <LocationBottomSheet
        isVisible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
      />
    </SafeAreaView>
  );
}
