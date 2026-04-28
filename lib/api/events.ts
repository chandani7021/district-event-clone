import { API_BASE_URL } from '@/constants/api';
import { DUMMY_EVENTS } from '@/lib/dummy-events';
import type { EventCardData, FetchEventsParams, FetchEventsResult } from '@/interfaces/events.interface';

const SIMULATED_DELAY = 800;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Maps category slugs to matching category strings in EventCardData.categories */
const SLUG_CATEGORIES: Record<string, string[]> = {
  music:             ['Music', 'Live Concert', 'Pop', 'Rock', 'R&B', 'Hip-Hop', 'Live Show', 'Tour'],
  nightlife:         ['Electronic', 'Festival'],
  comedy:            ['Comedy', 'Stand-Up'],
  sports:            ['Motorsport', 'Formula 1', 'Sports'],
  performances:      ['Theatre', 'Musical'],
  'fests-and-fairs': ['Festival'],
  screenings:        ['Theatre', 'Musical'],
  'open-mics':       ['Comedy', 'Stand-Up'],
};


/** Returns up to `limit` events for the home carousel. Falls back to mock data when API is unavailable. */
export async function fetchCarouselEvents(limit = 5): Promise<EventCardData[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit), featured: 'true' });
    const res = await fetch(`${API_BASE_URL}/events/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(SIMULATED_DELAY);
    return DUMMY_EVENTS.slice(0, limit);
  }
}

/** Returns featured events for a category slug carousel. Falls back to mock data when API is unavailable. */
export async function fetchCategoryEvents(slug: string, limit = 5): Promise<EventCardData[]> {
  try {
    const params = new URLSearchParams({ category: slug, limit: String(limit), featured: 'true' });
    const res = await fetch(`${API_BASE_URL}/events/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(SIMULATED_DELAY);
    const keywords = SLUG_CATEGORIES[slug];
    if (!keywords) return [];
    return DUMMY_EVENTS
      .filter((e) => keywords.some((k) => e.categories.includes(k)))
      .slice(0, limit);
  }
}

/** Returns a paginated list of events with optional filtering/sorting. Falls back to mock data when API is unavailable. */
export async function fetchEvents(params: FetchEventsParams = {}): Promise<FetchEventsResult> {
  const { page = 1, pageSize = 8, sortBy = 'popularity', genres = [], dateFilter = [], category } = params;

  try {
    const urlParams = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sortBy,
      ...(category ? { category } : {}),
      ...(genres.length > 0 ? { genres: genres.join(',') } : {}),
      ...(dateFilter.length > 0 ? { dateFilter: dateFilter.join(',') } : {}),
    });
    const res = await fetch(`${API_BASE_URL}/events/?${urlParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(SIMULATED_DELAY);
    const total = DUMMY_EVENTS.length;
    const start = (page - 1) * pageSize;
    const data = DUMMY_EVENTS.slice(start, start + pageSize);
    return { data, total, page, hasMore: start + pageSize < total };
  }
}
