import { DUMMY_EVENTS } from '@/lib/dummy-events';

export interface HotlistItem {
  id: string;
  title: string;
  coverImage: string;
  subtitle: string;
  dateAdded: string; // ISO string
  happeningDate: string; // ISO string
}

export interface Hotlist {
  id: string;
  name: string;
  isStarter?: boolean;
  gradientColors: string[];
  iconType: 'heart' | 'sparkle';
  itemCount: number;
  items?: HotlistItem[];
}

const GRADIENT_PRESETS = [
  ['#9C27B0', '#7B1FA2', '#4A148C'],
  ['#00BCD4', '#0097A7', '#006064'],
  ['#FF5722', '#E64A19', '#BF360C'],
  ['#4CAF50', '#388E3C', '#1B5E20'],
  ['#FF9800', '#F57C00', '#E65100'],
  ['#607D8B', '#455A64', '#263238'],
];

const DEFAULT_HOTLISTS: Hotlist[] = [
  {
    id: 'favourites',
    name: 'All saved',
    isStarter: true,
    gradientColors: ['#E91E8C', '#C2185B', '#880E4F'],
    iconType: 'heart',
    itemCount: 2,
    items: [
      {
        id: DUMMY_EVENTS[0].id,
        title: DUMMY_EVENTS[0].title,
        coverImage: DUMMY_EVENTS[0].coverImage,
        subtitle: `Event • ${DUMMY_EVENTS[0].date} @ ${DUMMY_EVENTS[0].venue_name}`,
        dateAdded: new Date().toISOString(),
        happeningDate: `${DUMMY_EVENTS[0].date}T${DUMMY_EVENTS[0].time}:00Z`,
      },
      {
        id: DUMMY_EVENTS[1].id,
        title: DUMMY_EVENTS[1].title,
        coverImage: DUMMY_EVENTS[1].coverImage,
        subtitle: `Event • ${DUMMY_EVENTS[1].date} @ ${DUMMY_EVENTS[1].venue_name}`,
        dateAdded: new Date(Date.now() - 86400000).toISOString(),
        happeningDate: `${DUMMY_EVENTS[1].date}T${DUMMY_EVENTS[1].time}:00Z`,
      },
    ],
  },
  {
    id: 'want-to-try',
    name: 'Want to try',
    isStarter: true,
    gradientColors: ['#7C4DFF', '#5E35B1', '#311B92'],
    iconType: 'sparkle',
    itemCount: 0,
    items: [],
  },
];

let hotlists: Hotlist[] = [...DEFAULT_HOTLISTS];
let listeners: Set<() => void> = new Set();

export function getHotlists(): Hotlist[] {
  return hotlists;
}

export function getHotlistById(id: string): Hotlist | undefined {
  return hotlists.find((h) => h.id === id);
}

export function addHotlist(name: string): Hotlist {
  const presetIndex = (hotlists.length - DEFAULT_HOTLISTS.length) % GRADIENT_PRESETS.length;
  const newHotlist: Hotlist = {
    id: `hotlist-${Date.now()}`,
    name,
    gradientColors: GRADIENT_PRESETS[presetIndex],
    iconType: 'sparkle',
    itemCount: 0,
  };
  hotlists = [...hotlists, newHotlist];
  listeners.forEach((l) => l());
  return newHotlist;
}

export function updateHotlistName(id: string, name: string) {
  hotlists = hotlists.map((h) => h.id === id ? { ...h, name } : h);
  listeners.forEach((l) => l());
}

export function subscribeToHotlists(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
