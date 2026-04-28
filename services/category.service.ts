import { API_BASE_URL } from '@/constants/api';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

import type { CategoryDetail } from '@/interfaces/category.interface';

const MOCK_CATEGORIES: CategoryDetail[] = [
  { id: '1',  title: 'Holi',            slug: 'holi',            image_url: 'https://picsum.photos/seed/holi-cat/300/300'       },
  { id: '2',  title: 'Music',           slug: 'music',           image_url: 'https://picsum.photos/seed/music-cat/300/300'      },
  { id: '3',  title: 'Nightlife',       slug: 'nightlife',       image_url: 'https://picsum.photos/seed/nightlife-cat/300/300'  },
  { id: '4',  title: 'Comedy',          slug: 'comedy',          image_url: 'https://picsum.photos/seed/comedy-cat/300/300'     },
  { id: '5',  title: 'Sports',          slug: 'sports',          image_url: 'https://picsum.photos/seed/sports-cat/300/300'     },
  { id: '6',  title: 'Performances',    slug: 'performances',    image_url: 'https://picsum.photos/seed/perfs-cat/300/300'      },
  { id: '7',  title: 'Food & Drink',    slug: 'food-and-drink',  image_url: 'https://picsum.photos/seed/food-cat/300/300'       },
  { id: '8',  title: 'Fests & Fairs',   slug: 'fests-and-fairs', image_url: 'https://picsum.photos/seed/fests-cat/300/300'      },
  { id: '9',  title: 'Social Mixer',    slug: 'social-mixer',    image_url: 'https://picsum.photos/seed/social-cat/300/300'     },
  { id: '10', title: 'Screenings',      slug: 'screenings',      image_url: 'https://picsum.photos/seed/screen-cat/300/300'     },
  { id: '11', title: 'Fitness',         slug: 'fitness',         image_url: 'https://picsum.photos/seed/fitness-cat/300/300'    },
  { id: '12', title: 'Pets',            slug: 'pets',            image_url: 'https://picsum.photos/seed/pets-cat/300/300'       },
  { id: '13', title: 'Art Exhibitions', slug: 'art-exhibitions', image_url: 'https://picsum.photos/seed/art-cat/300/300'        },
  { id: '14', title: 'Conferences',     slug: 'conferences',     image_url: 'https://picsum.photos/seed/conf-cat/300/300'       },
  { id: '15', title: 'Expos',           slug: 'expos',           image_url: 'https://picsum.photos/seed/expos-cat/300/300'      },
  { id: '16', title: 'Open Mics',       slug: 'open-mics',       image_url: 'https://picsum.photos/seed/openmics-cat/300/300'   },
];

/** Fetch category detail (title, image) by slug. Falls back to mock data when API is unavailable. */
export async function fetchCategoryDetail(slug: string): Promise<CategoryDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}
