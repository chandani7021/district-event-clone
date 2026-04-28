import type { ImageSourcePropType } from 'react-native';

export interface ArtistSocialLinks {
  instagram?: string
  twitter?: string
  spotify?: string
  youtube?: string
}

export interface Artist {
  id: string
  name: string
  image_url: ImageSourcePropType
  banner_url: ImageSourcePropType
  bio: string
  genres: string[]
  social_links: ArtistSocialLinks
  is_wishlisted: boolean
}

export interface ArtistCarouselProps {
  artists: Artist[]
  onArtistPress?: (artist: Artist) => void
  onHotlistPress?: (artist: Artist) => void
}

export interface ArtistEvent {
  id: string
  title: string
  image_url: string
  date: string
  time: string
  venue: string
  city: string
  price: string
  currency: string
}

export interface ArtistDetail {
  id: string
  name: string
  image_url: string
  bio: string
  nearYouEvents: ArtistEvent[]
  otherCityEvents: ArtistEvent[]
}
