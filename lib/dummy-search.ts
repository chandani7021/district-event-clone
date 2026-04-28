import cat1 from '@/assets/images/event-category.png';
import cat2 from '@/assets/images/event-category2.png';
import type { TrendingEvent, SearchArtist as Artist } from '@/interfaces/search.interface';

export const DUMMY_TRENDING: TrendingEvent[] = [
  {
    id: 'e1b2c3d4-0001-0001-0001-000000000001',
    title: 'Coldplay: Music of the Spheres World Tour',
    image: cat1,
    category: 'Music',
    date: 'Sat, 15 Mar',
    venue: 'Jawaharlal Nehru Stadium',
    city: 'New Delhi',
  },
  {
    id: 'e1b2c3d4-0003-0003-0003-000000000003',
    title: 'Kendrick Lamar: Grand National Tour',
    image: cat2,
    category: 'Music',
    date: 'Sun, 22 Mar',
    venue: 'DY Patil Stadium',
    city: 'Mumbai',
  },
  {
    id: 'e1b2c3d4-0008-0008-0008-000000000008',
    title: 'Zakir Khan Live',
    image: cat1,
    category: 'Comedy',
    date: 'Fri, 10 Apr',
    venue: 'Bal Gandharva Rang Mandir',
    city: 'Pune',
  },
  {
    id: 'e1b2c3d4-0004-0004-0004-000000000004',
    title: 'Goa Sunburn Festival 2026',
    image: cat2,
    category: 'Music',
    date: 'Fri, 27 Mar',
    venue: 'Vagator Beach',
    city: 'Goa',
  },
  {
    id: 'e1b2c3d4-0013-0013-0013-000000000013',
    title: 'IPL 2026: MI vs RCB',
    image: cat1,
    category: 'Sports',
    date: 'Sat, 4 Apr',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
  },
  {
    id: 'e1b2c3d4-0009-0009-0009-000000000009',
    title: 'A.R. Rahman: Harmony Live in Concert',
    image: cat2,
    category: 'Music',
    date: 'Sun, 19 Apr',
    venue: 'MMRDA Grounds',
    city: 'Mumbai',
  },
];

export const DUMMY_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Shakira',
    image: 'https://picsum.photos/seed/shakira_art/300/300',
  },
  {
    id: '2',
    name: 'Morgan Jay',
    image: 'https://picsum.photos/seed/morgan_art/300/300',
  },
  {
    id: '3',
    name: 'Yo Yo Honey Singh',
    image: 'https://picsum.photos/seed/yoyo_art/300/300',
  },
  {
    id: '4',
    name: 'Rish Rikhira',
    image: 'https://picsum.photos/seed/rish_art/300/300',
  },
  {
    id: '5',
    name: 'Louis CK',
    image: 'https://picsum.photos/seed/louick_art/300/300',
  },
  {
    id: '6',
    name: 'Arijit Singh',
    image: 'https://picsum.photos/seed/arijit_art/300/300',
  },
];
