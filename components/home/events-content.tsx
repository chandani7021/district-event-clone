import { CarouselCard } from "@/components/events/carousel-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import { EventCarousel } from "@/components/events/event-carousel";
import type {  EventCardData } from "@/interfaces/events.interface";
import { useEffect, useState } from "react";
import { CategoriesListing } from "../events/categories-listing";
import { mockArtists } from "@/lib/dummy-artist";
import type { Artist } from "@/interfaces/artist.interface";
import { ArtistCarouselSkeleton } from "../events/artist-carousel-skeleton";
import { ArtistCarousel } from "../events/artist-carousel";
import { EventsListing } from "../events/events-listing";
import { View } from "react-native";
import { fetchCarouselEvents } from "@/lib/api/events";
import { router } from "expo-router";
import { HotlistPickerSheet } from "@/components/hotlist/hotlist-picker-sheet";

interface EventsContentProps {
  loadMoreTrigger?: number;
  onHasMore?: (hasMore: boolean) => void;
}

export function EventsContent({ loadMoreTrigger = 0, onHasMore }: EventsContentProps) {
  const [carouselEvents, setCarouselEvents] = useState<EventCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [hotlistPickerVisible, setHotlistPickerVisible] = useState(false);

  useEffect(() => {
    fetchCarouselEvents(5).then((data) => {
      setCarouselEvents(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <View className="px-4 pb-10 pt-6 gap-10">
      {isLoading ? (
        <>
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <ArtistCarouselSkeleton />
        </>
      ) : (
        <>
          <EventCarousel<EventCardData>
            data={carouselEvents}
            renderItem={(item) => <CarouselCard item={item} />}
          />


          <CategoriesListing />

          <ArtistCarousel
            artists={mockArtists}
            onArtistPress={(artist: Artist) => router.push({ pathname: '/artist/[id]', params: { id: artist.id } })}
            onHotlistPress={(artist: Artist) => {
              setSelectedTitle(artist.name);
              setHotlistPickerVisible(true);
            }}
          />

          <EventsListing loadMoreTrigger={loadMoreTrigger} onHasMore={onHasMore} />

          <HotlistPickerSheet
            visible={hotlistPickerVisible}
            onClose={() => setHotlistPickerVisible(false)}
            eventTitle={selectedTitle}
          />
        </>
      )}
    </View>
  );
}
