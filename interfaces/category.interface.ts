import type { ImageSourcePropType } from 'react-native';

export interface EventCategory {
  id: string
  title: string
  image: ImageSourcePropType
  slug: string
}

export interface CategoryDetail {
  id: string
  title: string
  slug: string
  image_url?: string
}
