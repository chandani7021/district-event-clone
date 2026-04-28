export type EventType = "single_day" | "multi_day"
export type Availability = "available" | "filling_fast" | "sold_out"
export type SeatingType = "seated" | "non_seated"

// Matches the API event lifecycle state machine
export type EventStatus =
  | "draft"
  | "shows_configured"
  | "tickets_configured"
  | "submitted"
  | "under_review"
  | "approved"
  | "approved_pending_zone"
  | "rejected"
  | "live"
  | "completed"
  | "cancelled"
  | "postponed"

// Matches EventDetail.saleStatus
export type SaleStatus = "general_sale" | "pre_sale" | "sold_out"

export interface EventQAEntry {
  id: string
  question: string
  answer: string
}

export interface EventCardData {
  id: string
  title: string
  description: string
  // API lifecycle status — use getEventStatusLabel() for display
  status: EventStatus
  coverImage: string
  date: string // 'YYYY-MM-DD' — first show date
  end_date?: string // 'YYYY-MM-DD' — last show date (multi_day only)
  time: string // 'HH:mm' — show start time
  end_time?: string // 'HH:mm' — show end time
  venue_name: string
  venue_address?: string
  venue_tba?: boolean
  city: string // lowercase city ID matching API spec (e.g. "mumbai")
  city_name: string // display name (e.g. "Mumbai")
  price_min: number
  price_max: number
  currency: string
  isPromoted?: boolean
  is_wishlisted: boolean
  event_type: EventType
  availability: Availability
  categories: string[] // display tags (UI only)
  category?: string // primary API category value (e.g. "music", "comedy")
  subCategory?: string // API sub-category value (e.g. "concert", "standup")
  languages?: string[]
  amenities?: string[]
  cover_charge?: string
  prohibited_items?: string[]
  seating_type?: SeatingType
  instagramUrl?: string
  presetAnswers?: Record<string, string>
  customQA?: EventQAEntry[]
  faqEntries?: EventQAEntry[]
  gallery_urls?: string[]
  video_url?: string
  artist_id?: string
  nextPage?: number
  // Detail screen fields
  media_images?: string[]
  venue_distance_km?: number
  schedule_items?: Array<{ label: string; time: string }>
  multi_day_schedule?: Array<{
    date: string
    label: string
    items: Array<{ label: string; time: string }>
  }>
  highlights?: Array<{ id: string; icon: string; title: string; description: string }>
  artists_detail?: Array<{
    id: string
    name: string
    role: string
    image: string
    bio: string
    instagramFollowers?: string
    youtubeSubscribers?: string
  }>
  about?: string
  things_to_know_info?: Array<{ iconName: string; label: string }>
  things_to_know_amenities?: Array<{ iconName: string; label: string }>
  termsAndConditions?: string
  sale_status?: SaleStatus
  sale_timeline?: Array<{ id: string; label: string; dateRange: string; status: 'completed' | 'active' | 'upcoming' }>
  organiser_detail?: {
    name: string
    logoUrl: string
    likedPercent: number
    hostedEvents: number
    hostingMonths: number
  }
  discount_label?: string
}

export interface Event {
  id: string
  name: string
  date: string
  time: string
  venue: string
  price: string
  image: string
  categoryId: string
}

export interface FetchEventsParams {
  page?: number
  pageSize?: number
  sortBy?: 'popularity' | 'price_low_high' | 'price_high_low' | 'date'
  genres?: string[]
  dateFilter?: string[]
  category?: string
}

export interface FetchEventsResult {
  data: EventCardData[]
  total: number
  page: number
  hasMore: boolean
}
