export interface EventDetailHighlight {
  id: string;
  icon: string; // emoji
  title: string;
  description: string;
}

export interface EventDetailScheduleItem {
  label: string;
  time: string;
}

export interface EventDetailSchedule {
  date: string;
  items: EventDetailScheduleItem[];
}

export interface EventDetailMultiDayScheduleDay {
  date: string;
  label: string;
  items: EventDetailScheduleItem[];
}

export interface EventDetailVenue {
  name: string;
  address: string;
  distanceKm: number;
}

export interface EventDetailArtist {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  instagramFollowers?: string;
  youtubeSubscribers?: string;
}

export interface EventDetailThingToKnow {
  iconName: string; // lucide icon name as string key
  label: string;
}

export interface EventDetailFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface EventDetailPartner {
  role: string;
  name: string;
}

export interface EventDetailSaleEntry {
  id: string;
  label: string;
  dateRange: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface EventDetail {
  id: string;
  title: string;
  categories: string[];
  date: string;
  time: string;
  mediaImages: string[];
  venue: EventDetailVenue;
  schedule: EventDetailSchedule;
  multiDaySchedule?: EventDetailMultiDayScheduleDay[];
  highlights: EventDetailHighlight[];
  artists: EventDetailArtist[];
  about: string;
  thingsToKnowInfo: EventDetailThingToKnow[];
  thingsToKnowAmenities: EventDetailThingToKnow[];
  gallery: string[];
  partners: EventDetailPartner[];
  faq: EventDetailFaqItem[];
  termsAndConditions: string[];
  priceMin: number;
  priceMax: number;
  currency: string;
  saleStatus: 'general_sale' | 'pre_sale' | 'sold_out';
  saleTimeline: EventDetailSaleEntry[];
  seating_type?: 'seated' | 'non_seated';
}

// ── Component Props ────────────────────────────────────────────────────────

import type React from 'react';

export interface DetailSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  coverage?: number;
}

export interface EventHeaderProps {
  categories: string[];
  title: string;
  date: string;
  time: string;
}

export interface EventLocationRowProps {
  venue: EventDetailVenue;
  onPress: () => void;
}

export interface EventScheduleRowProps {
  schedule: EventDetailSchedule;
  multiDaySchedule?: EventDetailMultiDayScheduleDay[];
  onPress: () => void;
}

export interface EventArtistSectionProps {
  artists: EventDetailArtist[];
  onKnowMorePress: (artist: EventDetailArtist) => void;
}

export interface EventAboutSectionProps {
  about: string;
  onReadMorePress: () => void;
}

export interface EventHighlightsProps {
  highlights: EventDetailHighlight[];
}

export interface EventThingsToKnowProps {
  infoItems: EventDetailThingToKnow[];
  onSeeAllPress: () => void;
}

export interface EventGalleryProps {
  images: string[];
  onImagePress: (index: number) => void;
}

export interface GalleryFullscreenProps {
  isVisible: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  eventTitle: string;
}

export interface EventMoreSectionProps {
  onFaqPress: () => void;
  onTermsPress: () => void;
}

export interface EventBookingBarProps {
  priceMin: number;
  currency: string;
  saleStatus: EventDetail['saleStatus'];
  onBookPress: () => void;
  onSaleLabelPress: () => void;
  hasSaleTimeline: boolean;
}

export interface SaleTimelineSheetProps {
  isVisible: boolean;
  onClose: () => void;
  entries: EventDetailSaleEntry[];
}

export interface EventMediaProps {
  images: string[];
  onGalleryPress: () => void;
  isHotlisted?: boolean;
  onHotlistToggle?: () => void;
  onSharePress?: () => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showMute?: boolean;
}

export interface EventPartnersProps {
  partners: EventDetailPartner[];
}

export interface VenueSheetProps {
  isVisible: boolean;
  onClose: () => void;
  venue: EventDetailVenue;
}

export interface ScheduleSheetProps {
  isVisible: boolean;
  onClose: () => void;
  schedule: EventDetailSchedule;
  multiDaySchedule?: EventDetailMultiDayScheduleDay[];
}

export interface ArtistSheetProps {
  isVisible: boolean;
  onClose: () => void;
  artist: EventDetailArtist | null;
}

export interface AboutSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  about: string;
}

export interface ThingsToKnowSheetProps {
  isVisible: boolean;
  onClose: () => void;
  infoItems: EventDetailThingToKnow[];
  amenityItems: EventDetailThingToKnow[];
}

export interface FaqItemProps {
  item: EventDetailFaqItem;
  isOpen: boolean;
  onToggle: () => void;
  showDivider: boolean;
}

export interface FaqSheetProps {
  isVisible: boolean;
  onClose: () => void;
  items: EventDetailFaqItem[];
}

export interface TermsSheetProps {
  isVisible: boolean;
  onClose: () => void;
  items: string[];
}

export interface EventMediaControlsProps {
  isMuted: boolean;
  onMuteToggle: () => void;
  onGalleryPress: () => void;
  showMute: boolean;
}
