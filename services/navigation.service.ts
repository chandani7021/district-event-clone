import { API_BASE_URL, Endpoints } from '@/constants/api';
import type {
  Bookmark,
  LocationSearchResult,
  NavLocation,
  NavMenuItem,
  SearchResult,
} from '@/interfaces/navigation.interface';

// ── Helpers ───────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// ── Location ──────────────────────────────────────────────────────────────────

/** Fetch the user's current/saved location. */
export async function getCurrentLocation(): Promise<NavLocation> {
  try {
    const res = await fetch(`${API_BASE_URL}${Endpoints.location.current}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return {
      id: '1',
      name: 'Riviresa Society',
      area: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
    };
  }
}

/** Save the user's selected location to the backend. */
export async function saveLocation(location: NavLocation): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}${Endpoints.location.save}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });
    return { success: res.ok };
  } catch {
    await delay(200);
    return { success: true };
  }
}

/**
 * Autocomplete location search.
 * Returns matching localities, areas, and cities.
 */
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({ q: query });
    const res = await fetch(`${API_BASE_URL}${Endpoints.location.search}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(300);
    const q = query.toLowerCase();
    const mock: LocationSearchResult[] = [
      { id: '1', name: 'Riviresa Society', area: 'Baner',          city: 'Pune',    state: 'Maharashtra' },
      { id: '2', name: 'Koregaon Park',    area: 'Koregaon Park',  city: 'Pune',    state: 'Maharashtra' },
      { id: '3', name: 'Kalyani Nagar',    area: 'Kalyani Nagar',  city: 'Pune',    state: 'Maharashtra' },
      { id: '4', name: 'Bandra West',      area: 'Bandra',         city: 'Mumbai',  state: 'Maharashtra' },
      { id: '5', name: 'Andheri East',     area: 'Andheri',        city: 'Mumbai',  state: 'Maharashtra' },
      { id: '6', name: 'Connaught Place',  area: 'Central Delhi',  city: 'Delhi',   state: 'Delhi'       },
      { id: '7', name: 'Indiranagar',      area: 'Indiranagar',    city: 'Bengaluru', state: 'Karnataka' },
    ];
    return mock.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q)
    );
  }
}

// ── Navigation menus ──────────────────────────────────────────────────────────

/**
 * Fetch the navigation tabs for a city.
 * `visible: false` means no content exists for that category — hide the tab.
 * "events" is the default active tab.
 */
export async function getNavMenus(city?: string): Promise<NavMenuItem[]> {
  try {
    const params = city ? new URLSearchParams({ city }) : undefined;
    const url = `${API_BASE_URL}${Endpoints.navigation.menus}${params ? `?${params}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return [
      { id: 'home',       label: 'Home',       visible: true,  isActive: false },
      { id: 'trending',   label: 'Trending',   visible: true,  isActive: false },
      { id: 'movies',     label: 'Movies',     visible: true,  isActive: false },
      { id: 'events',     label: 'Events',     visible: true,  isActive: true  },
      { id: 'stores',     label: 'Stores',     visible: true,  isActive: false },
      { id: 'activities', label: 'Activities', visible: true,  isActive: false },
      { id: 'food',       label: 'Food',       visible: false, isActive: false },
    ];
  }
}

// ── Category sub-menus ────────────────────────────────────────────────────────

const CATEGORY_MENUS: Record<string, NavMenuItem[]> = {
  music: [
    { id: 'all',             label: 'All',             visible: true, isActive: true  },
    { id: 'live-gigs',       label: 'Live Gigs',       visible: true, isActive: false },
    { id: 'concerts',        label: 'Concerts',        visible: true, isActive: false },
    { id: 'jams',            label: 'Jams',            visible: true, isActive: false },
    { id: 'music-festivals', label: 'Music Festivals', visible: true, isActive: false },
  ],
  nightlife: [
    { id: 'all',      label: 'All',        visible: true, isActive: true  },
    { id: 'club',     label: 'Club Night', visible: true, isActive: false },
    { id: 'rooftop',  label: 'Rooftop',    visible: true, isActive: false },
    { id: 'parties',  label: 'Parties',    visible: true, isActive: false },
    { id: 'pub',      label: 'Pub Night',  visible: true, isActive: false },
  ],
  comedy: [
    { id: 'all',       label: 'All',       visible: true, isActive: true  },
    { id: 'stand-up',  label: 'Stand Up',  visible: true, isActive: false },
    { id: 'improv',    label: 'Improv',    visible: true, isActive: false },
    { id: 'open-mic',  label: 'Open Mic',  visible: true, isActive: false },
    { id: 'roast',     label: 'Roast',     visible: true, isActive: false },
  ],
  sports: [
    { id: 'all',       label: 'All',       visible: true, isActive: true  },
    { id: 'cricket',   label: 'Cricket',   visible: true, isActive: false },
    { id: 'football',  label: 'Football',  visible: true, isActive: false },
    { id: 'basketball',label: 'Basketball',visible: true, isActive: false },
    { id: 'marathon',  label: 'Marathon',  visible: true, isActive: false },
  ],
  holi: [
    { id: 'all',        label: 'All',         visible: true, isActive: true  },
    { id: 'festival',   label: 'Festival',    visible: true, isActive: false },
    { id: 'parties',    label: 'Holi Parties',visible: true, isActive: false },
    { id: 'family',     label: 'Family',      visible: true, isActive: false },
  ],
  performances: [
    { id: 'all',       label: 'All',        visible: true, isActive: true  },
    { id: 'theatre',   label: 'Theatre',    visible: true, isActive: false },
    { id: 'dance',     label: 'Dance',      visible: true, isActive: false },
    { id: 'magic',     label: 'Magic Show', visible: true, isActive: false },
    { id: 'circus',    label: 'Circus',     visible: true, isActive: false },
  ],
  'food-and-drink': [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'popup',     label: 'Pop Up',       visible: true, isActive: false },
    { id: 'wine',      label: 'Wine Tasting', visible: true, isActive: false },
    { id: 'workshop',  label: 'Workshop',     visible: true, isActive: false },
    { id: 'brunch',    label: 'Brunch',       visible: true, isActive: false },
  ],
  'fests-and-fairs': [
    { id: 'all',       label: 'All',           visible: true, isActive: true  },
    { id: 'cultural',  label: 'Cultural',      visible: true, isActive: false },
    { id: 'trade',     label: 'Trade Fair',    visible: true, isActive: false },
    { id: 'street',    label: 'Street Fest',   visible: true, isActive: false },
  ],
  'social-mixer': [
    { id: 'all',        label: 'All',          visible: true, isActive: true  },
    { id: 'networking', label: 'Networking',   visible: true, isActive: false },
    { id: 'speed-dating',label: 'Speed Dating',visible: true, isActive: false },
    { id: 'community',  label: 'Community',    visible: true, isActive: false },
  ],
  screenings: [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'movie',     label: 'Movies',       visible: true, isActive: false },
    { id: 'sports',    label: 'Sports',       visible: true, isActive: false },
    { id: 'outdoor',   label: 'Outdoor',      visible: true, isActive: false },
  ],
  fitness: [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'yoga',      label: 'Yoga',         visible: true, isActive: false },
    { id: 'marathon',  label: 'Marathon',     visible: true, isActive: false },
    { id: 'cycling',   label: 'Cycling',      visible: true, isActive: false },
    { id: 'gym',       label: 'Gym Events',   visible: true, isActive: false },
  ],
  pets: [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'adoption',  label: 'Adoption',     visible: true, isActive: false },
    { id: 'show',      label: 'Pet Show',     visible: true, isActive: false },
    { id: 'workshop',  label: 'Workshop',     visible: true, isActive: false },
  ],
  'art-exhibitions': [
    { id: 'all',        label: 'All',         visible: true, isActive: true  },
    { id: 'painting',   label: 'Painting',    visible: true, isActive: false },
    { id: 'sculpture',  label: 'Sculpture',   visible: true, isActive: false },
    { id: 'digital',    label: 'Digital Art', visible: true, isActive: false },
    { id: 'photography',label: 'Photography', visible: true, isActive: false },
  ],
  conferences: [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'tech',      label: 'Tech',         visible: true, isActive: false },
    { id: 'business',  label: 'Business',     visible: true, isActive: false },
    { id: 'health',    label: 'Health',       visible: true, isActive: false },
  ],
  expos: [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'auto',      label: 'Auto Expo',    visible: true, isActive: false },
    { id: 'fashion',   label: 'Fashion',      visible: true, isActive: false },
    { id: 'tech',      label: 'Tech Expo',    visible: true, isActive: false },
  ],
  'open-mics': [
    { id: 'all',       label: 'All',          visible: true, isActive: true  },
    { id: 'comedy',    label: 'Comedy',       visible: true, isActive: false },
    { id: 'music',     label: 'Music',        visible: true, isActive: false },
    { id: 'poetry',    label: 'Poetry',       visible: true, isActive: false },
  ],
};

/**
 * Fetch sub-category tabs for a given category slug.
 * Falls back to mock data when the API is unavailable.
 */
export async function getCategoryMenus(slug: string): Promise<NavMenuItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}/menus`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return CATEGORY_MENUS[slug] ?? [{ id: 'all', label: 'All', visible: true, isActive: true }];
  }
}

// ── Global search ─────────────────────────────────────────────────────────────

/**
 * Search events, movies, stores, and activities.
 * `city` scopes results to the selected location.
 */
export async function searchContent(query: string, city?: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({ q: query, ...(city ? { city } : {}) });
    const res = await fetch(`${API_BASE_URL}${Endpoints.search.query}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(400);
    const q = query.toLowerCase();
    const mock: SearchResult[] = [
      { id: '1', title: 'Shakira Live Concert',       type: 'event',    date: '10 Apr', venue: 'MMRDA Grounds',   city: 'Mumbai'    },
      { id: '2', title: 'Sitar for Mental Health',    type: 'event',    date: '15 Apr', venue: 'Siri Fort Auditorium', city: 'Delhi' },
      { id: '3', title: 'Comedy Night with Zakir',    type: 'event',    date: '22 Mar', venue: 'Bal Gandharva',   city: 'Pune'      },
      { id: '4', title: 'Yo Yo Honey Singh — My Story', type: 'event', date: '5 Apr',  venue: 'JLN Stadium',     city: 'Delhi'     },
      { id: '5', title: 'Inception',                  type: 'movie',    date: 'Now Showing', venue: '',           city: 'Mumbai'    },
    ];
    return mock.filter((r) => r.title.toLowerCase().includes(q));
  }
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────

/** Fetch the user's saved bookmarks. */
export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${Endpoints.bookmarks.list}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return [];
  }
}

/** Save a bookmark for an event, movie, store, or activity. */
export async function saveBookmark(
  itemId: string,
  itemType: Bookmark['itemType']
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}${Endpoints.bookmarks.save}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, itemType }),
    });
    return { success: res.ok };
  } catch {
    await delay(300);
    return { success: true };
  }
}

/** Remove a saved bookmark by its ID. */
export async function removeBookmark(id: string): Promise<{ success: boolean }> {
  try {
    const url = `${API_BASE_URL}${Endpoints.bookmarks.remove.replace(':id', id)}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: res.ok };
  } catch {
    await delay(300);
    return { success: true };
  }
}
