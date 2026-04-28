import cat1 from '@/assets/images/event-category.png';
import cat2 from '@/assets/images/event-category2.png';
import type { EventCategory } from '@/interfaces/category.interface';

export const mockCategories: EventCategory[] = [
  { id: '1', title: 'Holi', image: cat1, slug: 'holi' },
  { id: '2', title: 'Music', image: cat2, slug: 'music' },
  { id: '3', title: 'Nightlife', image: cat1, slug: 'nightlife' },
  { id: '4', title: 'Comedy', image: cat2, slug: 'comedy' },
  { id: '5', title: 'Sports', image: cat1, slug: 'sports' },
  { id: '6', title: 'Performances', image: cat2, slug: 'performances' },
  { id: '7', title: 'Food & Drink', image: cat1, slug: 'food-and-drink' },
  { id: '8', title: 'Fests & Fairs', image: cat2, slug: 'fests-and-fairs' },
  { id: '9', title: 'Social Mixer', image: cat1, slug: 'social-mixer' },
  { id: '10', title: 'Screenings', image: cat2, slug: 'screenings' },
  { id: '11', title: 'Fitness', image: cat1, slug: 'fitness' },
  { id: '12', title: 'Pets', image: cat2, slug: 'pets' },
  { id: '13', title: 'Art Exhibitions', image: cat1, slug: 'art-exhibitions' },
  { id: '14', title: 'Conferences', image: cat2, slug: 'conferences' },
  { id: '15', title: 'Expos', image: cat1, slug: 'expos' },
  { id: '16', title: 'Open Mics', image: cat2, slug: 'open-mics' },
];
