import { API_BASE_URL } from '@/constants/api';
import type { SearchResult } from '@/interfaces/navigation.interface';
import { DUMMY_TRENDING, DUMMY_ARTISTS } from '@/lib/dummy-search';
import type { TrendingEvent, SearchArtist as Artist } from '@/interfaces/search.interface';
import cat1 from '@/assets/images/event-category.png';
import cat2 from '@/assets/images/event-category2.png';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function getTrending(city?: string): Promise<TrendingEvent[]> {
  try {
    const params = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await fetch(`${API_BASE_URL}/search/trending/${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(300);
    return DUMMY_TRENDING;
  }
}

export async function getArtists(city?: string): Promise<Artist[]> {
  try {
    const params = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await fetch(`${API_BASE_URL}/search/artists/${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(300);
    return DUMMY_ARTISTS;
  }
}

export async function searchContent(query: string, city?: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({ q: query, ...(city ? { city } : {}) });
    const res = await fetch(`${API_BASE_URL}/search/?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(400);
    const q = query.toLowerCase();
    const mock: SearchResult[] = [
      {
        id: 'e1b2c3d4-0001-0001-0001-000000000001',
        title: 'Coldplay: Music of the Spheres World Tour',
        type: 'event',
        image: cat1,
        date: '15 Mar',
        venue: 'Jawaharlal Nehru Stadium',
        city: 'New Delhi',
      },
      {
        id: 'e1b2c3d4-0003-0003-0003-000000000003',
        title: 'Kendrick Lamar: Grand National Tour',
        type: 'event',
        image: cat2,
        date: '22 Mar',
        venue: 'DY Patil Stadium',
        city: 'Mumbai',
      },
      {
        id: 'e1b2c3d4-0008-0008-0008-000000000008',
        title: 'Zakir Khan Live',
        type: 'event',
        image: cat1,
        date: '10 Apr',
        venue: 'Bal Gandharva Rang Mandir',
        city: 'Pune',
      },
      {
        id: 'e1b2c3d4-0004-0004-0004-000000000004',
        title: 'Goa Sunburn Festival 2026',
        type: 'event',
        image: cat2,
        date: '27 Mar',
        venue: 'Vagator Beach',
        city: 'Goa',
      },
      {
        id: 'e1b2c3d4-0009-0009-0009-000000000009',
        title: 'A.R. Rahman: Harmony Live in Concert',
        type: 'event',
        image: cat1,
        date: '19 Apr',
        venue: 'MMRDA Grounds',
        city: 'Mumbai',
      },
      {
        id: 'e1b2c3d4-0010-0010-0010-000000000010',
        title: 'Vir Das: Mind Fool India Tour',
        type: 'event',
        image: cat2,
        date: '5 Apr',
        venue: 'Shriram Bharatiya Kala Kendra',
        city: 'Delhi',
      },
      {
        id: 'e1b2c3d4-0013-0013-0013-000000000013',
        title: 'IPL 2026: MI vs RCB',
        type: 'event',
        image: cat1,
        date: '4 Apr',
        venue: 'Wankhede Stadium',
        city: 'Mumbai',
      },
      {
        id: 'e1b2c3d4-0011-0011-0011-000000000011',
        title: 'Bengaluru Food & Drinks Festival 2026',
        type: 'event',
        image: cat2,
        date: '14 Mar',
        venue: 'Palace Grounds',
        city: 'Bengaluru',
      },
    ];
    return mock.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.venue ?? '').toLowerCase().includes(q) ||
        (r.city ?? '').toLowerCase().includes(q)
    );
  }
}
