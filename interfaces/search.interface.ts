import type { ImageSourcePropType } from 'react-native';

export interface TrendingEvent {
  id: string
  title: string
  image: ImageSourcePropType
  category: string
  date: string
  venue: string
  city: string
}

export interface SearchArtist {
  id: string
  name: string
  image: string
}
