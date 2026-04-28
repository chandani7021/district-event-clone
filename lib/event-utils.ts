import type { EventCardData } from '@/interfaces/events.interface';
import type { EventDetail, EventDetailMultiDayScheduleDay } from '@/interfaces/event-detail.interface';
import { formatDate, formatScheduleDate, formatTime } from '@/lib/utils';

/**
 * Returns a consumer-friendly display label for the event status badge.
 * Derived from the API `status` + `availability` fields.
 */
export function toEventDetail(card: EventCardData): EventDetail {
  const formattedTime = formatTime(card.time);
  return {
    id: card.id,
    title: card.title,
    categories: card.categories,
    date: formatDate(card.date),
    time: formattedTime,
    mediaImages: card.media_images ?? [card.coverImage],
    venue: {
      name: card.venue_name,
      address: card.venue_address ?? '',
      distanceKm: card.venue_distance_km ?? 0,
    },
    schedule: {
      date: card.end_date && card.event_type === 'multi_day' 
        ? `${formatScheduleDate(card.date)} – ${formatScheduleDate(card.end_date)}`
        : formatScheduleDate(card.date),
      items: card.schedule_items ?? card.multi_day_schedule?.[0]?.items ?? [
        { label: 'Gates open', time: formattedTime },
        { label: 'Event starts', time: formattedTime },
      ],
    },
    multiDaySchedule: card.multi_day_schedule as EventDetailMultiDayScheduleDay[] | undefined,
    highlights: card.highlights ?? [],
    artists: (card.artists_detail ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      image: a.image,
      bio: a.bio,
      instagramFollowers: a.instagramFollowers,
      youtubeSubscribers: a.youtubeSubscribers,
    })),
    about: card.about ?? card.description,
    thingsToKnowInfo: card.things_to_know_info ?? [],
    thingsToKnowAmenities: card.things_to_know_amenities ?? [],
    gallery: card.gallery_urls ?? [],
    partners: [],
    faq: (card.faqEntries ?? []).map((e) => ({
      id: e.id,
      question: e.question,
      answer: e.answer,
    })),
    termsAndConditions: card.termsAndConditions ? card.termsAndConditions.split('\n') : [],
    priceMin: card.price_min,
    priceMax: card.price_max,
    currency: card.currency === 'INR' ? '₹' : card.currency,
    saleStatus: card.sale_status ?? 'general_sale',
    saleTimeline: card.sale_timeline ?? [],
    seating_type: card.seating_type,
  };
}

export function getEventStatusLabel(item: EventCardData): string {
  if (item.availability === 'sold_out') return 'Sold Out';
  if (item.availability === 'filling_fast') return 'Selling Fast';
  if (item.status === 'live') return 'Live Now';
  if (item.status === 'completed') return 'Completed';
  if (item.status === 'cancelled') return 'Cancelled';
  if (item.status === 'postponed') return 'Postponed';
  return 'On Sale Now';
}
