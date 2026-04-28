import type { ImageSourcePropType } from 'react-native';

export interface NavLocation {
  id: string
  name: string
  area: string
  city: string
  state: string
}

export interface NavMenuItem {
  id: string
  label: string
  visible: boolean
  isActive: boolean
}

export interface SearchResult {
  id: string
  title: string
  type: 'event' | 'movie' | 'store' | 'activity'
  image?: ImageSourcePropType
  date?: string
  venue?: string
  city?: string
}

export interface LocationSearchResult {
  id: string
  name: string
  area: string
  city: string
  state: string
}

export interface Bookmark {
  id: string
  itemId: string
  itemType: 'event' | 'movie' | 'store' | 'activity'
  savedAt: string
}
