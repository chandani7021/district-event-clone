import { API_BASE_URL } from '@/constants/api';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

import type { ArtistDetail } from '@/interfaces/artist.interface';

const MOCK_ARTIST_DETAILS: Record<string, ArtistDetail> = {
  'a1b2c3d4-e5f6-7890-abcd-ef1234567801': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567801',
    name: 'Amara Diallo',
    image_url: 'https://picsum.photos/seed/amara-hero/800/1000',
    bio: 'Afrobeats vocalist blending West African rhythms with contemporary R&B, based in Brooklyn. Her music draws from the rich traditions of West Africa while embracing the modern sounds of global R&B.',
    nearYouEvents: [
      { id: 'ev-ad-1', title: 'Amara Diallo Live | Mumbai', image_url: 'https://picsum.photos/seed/amara-ev1/400/400', date: 'Sat, 22 Mar', time: '8:00 PM', venue: 'Blue Frog', city: 'Mumbai', price: '1500', currency: '₹' },
      { id: 'ev-ad-1b', title: 'Sunset Grooves with Amara', image_url: 'https://picsum.photos/seed/amara-ev1b/400/400', date: 'Fri, 28 Mar', time: '6:00 PM', venue: 'AER', city: 'Mumbai', price: '2500', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-ad-2', title: 'Amara Diallo — Afrobeats Night', image_url: 'https://picsum.photos/seed/amara-ev2/400/400', date: 'Sun, 30 Mar', time: '9:00 PM', venue: 'Kitty Su', city: 'Delhi', price: '1200', currency: '₹' },
      { id: 'ev-ad-3', title: 'Brooklyn Sound Tour | Bengaluru', image_url: 'https://picsum.photos/seed/amara-ev3/400/400', date: 'Fri, 4 Apr', time: '8:30 PM', venue: 'The Humming Tree', city: 'Bengaluru', price: '999', currency: '₹' },
      { id: 'ev-ad-4', title: 'Afro-Soul Festival | Goa', image_url: 'https://picsum.photos/seed/amara-ev4/400/400', date: 'Sat, 12 Apr', time: '10:00 PM', venue: 'Thalassa', city: 'Goa', price: '2000', currency: '₹' },
      { id: 'ev-ad-5', title: 'Amara Diallo | Hyderabad Live', image_url: 'https://picsum.photos/seed/amara-ev5/400/400', date: 'Sun, 20 Apr', time: '7:30 PM', venue: 'Heart Cup Coffee', city: 'Hyderabad', price: '1500', currency: '₹' },
      { id: 'ev-ad-6', title: 'Diallo Experience | Chennai', image_url: 'https://picsum.photos/seed/amara-ev6/400/400', date: 'Thu, 24 Apr', time: '8:00 PM', venue: 'Bay 146', city: 'Chennai', price: '1200', currency: '₹' },
      { id: 'ev-ad-7', title: 'Global Beats | Kolkata', image_url: 'https://picsum.photos/seed/amara-ev7/400/400', date: 'Fri, 2 May', time: '8:30 PM', venue: 'Someplace Else', city: 'Kolkata', price: '1000', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567802': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567802',
    name: 'Lena Vasquez',
    image_url: 'https://picsum.photos/seed/lena-hero/800/1000',
    bio: 'Soulful R&B singer-songwriter from Harlem with a passion for storytelling through music. Lena\'s voice carries the weight of experience and the lightness of hope in every note.',
    nearYouEvents: [
      { id: 'ev-lv-1', title: 'Lena Vasquez | Soul Sessions Mumbai', image_url: 'https://picsum.photos/seed/lena-ev1/400/400', date: 'Fri, 28 Mar', time: '7:30 PM', venue: 'NCPA', city: 'Mumbai', price: '2000', currency: '₹' },
      { id: 'ev-lv-1b', title: 'Acoustic Soul Evening', image_url: 'https://picsum.photos/seed/lena-ev1b/400/400', date: 'Sun, 30 Mar', time: '7:00 PM', venue: 'Prithvi Theatre', city: 'Mumbai', price: '1500', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-lv-2', title: 'Neo-Soul Night with Lena Vasquez', image_url: 'https://picsum.photos/seed/lena-ev2/400/400', date: 'Sat, 5 Apr', time: '8:00 PM', venue: 'Tao Terrasse', city: 'Delhi', price: '1800', currency: '₹' },
      { id: 'ev-lv-3', title: 'Storyteller Tour | Bengaluru', image_url: 'https://picsum.photos/seed/lena-ev3/400/400', date: 'Fri, 11 Apr', time: '8:30 PM', venue: 'Windmills Craftworks', city: 'Bengaluru', price: '2500', currency: '₹' },
      { id: 'ev-lv-4', title: 'Soul by the Beach | Goa', image_url: 'https://picsum.photos/seed/lena-ev4/400/400', date: 'Sun, 20 Apr', time: '6:00 PM', venue: 'Titlie', city: 'Goa', price: '1200', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567803': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567803',
    name: 'Kai Nakamura',
    image_url: 'https://picsum.photos/seed/kai-hero/800/1000',
    bio: 'Jazz pianist and composer from Queens, drawing on Japanese folk melodies and bebop traditions. Kai\'s compositions are intricate tapestries of culture, technique, and raw emotion.',
    nearYouEvents: [
      { id: 'ev-kn-1', title: 'Kai Nakamura Jazz Quartet | Pune', image_url: 'https://picsum.photos/seed/kai-ev1/400/400', date: 'Thu, 20 Mar', time: '7:00 PM', venue: 'Hard Rock Cafe', city: 'Pune', price: '800', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-kn-2', title: 'Jazz & Fusion Evening | Bengaluru', image_url: 'https://picsum.photos/seed/kai-ev2/400/400', date: 'Sat, 29 Mar', time: '7:30 PM', venue: 'The Humming Tree', city: 'Bengaluru', price: '1000', currency: '₹' },
      { id: 'ev-kn-3', title: 'East Meets West | Delhi Jazz Festival', image_url: 'https://picsum.photos/seed/kai-ev3/400/400', date: 'Sun, 6 Apr', time: '6:00 PM', venue: 'India Habitat Centre', city: 'Delhi', price: '750', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567804': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567804',
    name: 'Priya Sharma',
    image_url: 'https://picsum.photos/seed/priya-hero/800/1000',
    bio: 'Neo-Soul artist from the Bronx weaving Bollywood influences into her lush, layered soundscapes. Priya bridges two worlds in her music, creating something entirely her own.',
    nearYouEvents: [
      { id: 'ev-ps-1', title: 'Priya Sharma Live | Pune Soundscape', image_url: 'https://picsum.photos/seed/priya-ev1/400/400', date: 'Sat, 15 Mar', time: '8:00 PM', venue: 'Pagdandi Books', city: 'Pune', price: '600', currency: '₹' },
      { id: 'ev-ps-2', title: 'Bollywood Meets Soul | Mumbai', image_url: 'https://picsum.photos/seed/priya-ev2/400/400', date: 'Sun, 23 Mar', time: '6:30 PM', venue: 'G5A Foundation', city: 'Mumbai', price: '1200', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-ps-3', title: 'Priya Sharma | Hyderabad Music Week', image_url: 'https://picsum.photos/seed/priya-ev3/400/400', date: 'Fri, 28 Mar', time: '7:00 PM', venue: 'Lamakaan', city: 'Hyderabad', price: '500', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567805': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567805',
    name: 'Marcus Osei',
    image_url: 'https://picsum.photos/seed/marcus-hero/800/1000',
    bio: 'Staten Island MC dropping conscious hip-hop bars rooted in Pan-African identity and community. Marcus\'s lyrics are a call to action wrapped in infectious rhythm.',
    nearYouEvents: [
      { id: 'ev-mo-1', title: 'Marcus Osei | Hip-Hop Takeover Mumbai', image_url: 'https://picsum.photos/seed/marcus-ev1/400/400', date: 'Fri, 21 Mar', time: '9:00 PM', venue: 'AntiSocial', city: 'Mumbai', price: '900', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-mo-2', title: 'Conscious Rap Night | Delhi', image_url: 'https://picsum.photos/seed/marcus-ev2/400/400', date: 'Sat, 29 Mar', time: '8:30 PM', venue: 'Piano Man Jazz Club', city: 'Delhi', price: '800', currency: '₹' },
      { id: 'ev-mo-3', title: 'Marcus Osei | Bengaluru Hip-Hop', image_url: 'https://picsum.photos/seed/marcus-ev3/400/400', date: 'Sun, 6 Apr', time: '8:00 PM', venue: 'Fandom', city: 'Bengaluru', price: '750', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567806': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567806',
    name: 'Sofia Mendez',
    image_url: 'https://picsum.photos/seed/sofia-hero/800/1000',
    bio: 'Brooklyn-based Latin pop powerhouse fusing cumbia rhythms with modern pop production. Sofia\'s electrifying live shows have earned her a global fan following.',
    nearYouEvents: [
      { id: 'ev-sm-1', title: 'Sofia Mendez | Latin Night Mumbai', image_url: 'https://picsum.photos/seed/sofia-ev1/400/400', date: 'Sat, 22 Mar', time: '9:30 PM', venue: 'Trilogy', city: 'Mumbai', price: '1500', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-sm-2', title: 'Cumbia Carnaval | Goa', image_url: 'https://picsum.photos/seed/sofia-ev2/400/400', date: 'Thu, 27 Mar', time: '8:00 PM', venue: 'Club Cubana', city: 'Goa', price: '1200', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567807': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567807',
    name: 'Devon Carter',
    image_url: 'https://picsum.photos/seed/devon-hero/800/1000',
    bio: 'Gospel and soul vocalist from Harlem whose powerful voice has graced stages across the globe. Devon brings spiritual depth and raw emotional power to every performance.',
    nearYouEvents: [
      { id: 'ev-dc-1', title: 'Devon Carter | Soulful Sunday Mumbai', image_url: 'https://picsum.photos/seed/devon-ev1/400/400', date: 'Sun, 16 Mar', time: '6:00 PM', venue: 'St. Andrews Auditorium', city: 'Mumbai', price: '700', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-dc-2', title: 'Gospel & Soul Night | Chennai', image_url: 'https://picsum.photos/seed/devon-ev2/400/400', date: 'Sat, 22 Mar', time: '6:30 PM', venue: 'Museum Theatre', city: 'Chennai', price: '600', currency: '₹' },
      { id: 'ev-dc-3', title: 'Devon Carter World Tour | Bengaluru', image_url: 'https://picsum.photos/seed/devon-ev3/400/400', date: 'Sun, 30 Mar', time: '7:00 PM', venue: 'Chowdiah Memorial Hall', city: 'Bengaluru', price: '800', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567808': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567808',
    name: 'Yuki Tanaka',
    image_url: 'https://picsum.photos/seed/yuki-hero/800/1000',
    bio: 'Electronic music producer from Queens crafting ambient soundscapes and hypnotic club tracks. Yuki\'s sets are immersive journeys that blur the line between sound and feeling.',
    nearYouEvents: [
      { id: 'ev-yt-1', title: 'Yuki Tanaka | Ambient Rave Pune', image_url: 'https://picsum.photos/seed/yuki-ev1/400/400', date: 'Sat, 15 Mar', time: '10:00 PM', venue: 'High Spirits', city: 'Pune', price: '800', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-yt-2', title: 'Electronic Horizons Festival | Goa', image_url: 'https://picsum.photos/seed/yuki-ev2/400/400', date: 'Fri, 21 Mar', time: '9:00 PM', venue: 'Hilltop Vagator', city: 'Goa', price: '1500', currency: '₹' },
      { id: 'ev-yt-3', title: 'Yuki Tanaka | Club Night Delhi', image_url: 'https://picsum.photos/seed/yuki-ev3/400/400', date: 'Sat, 5 Apr', time: '11:00 PM', venue: 'Privee', city: 'Delhi', price: '1000', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567809': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567809',
    name: 'Zara Ahmed',
    image_url: 'https://picsum.photos/seed/zara-hero/800/1000',
    bio: 'Bronx-born reggaeton artist whose bilingual anthems have topped Latin charts internationally. Zara\'s infectious energy and commanding stage presence make her shows unforgettable.',
    nearYouEvents: [
      { id: 'ev-za-1', title: 'Zara Ahmed | Reggaeton Takeover', image_url: 'https://picsum.photos/seed/zara-ev1/400/400', date: 'Fri, 28 Mar', time: '9:00 PM', venue: 'Bombay Cocktail Bar', city: 'Mumbai', price: '1000', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-za-2', title: 'Latin Trap Night | Bengaluru', image_url: 'https://picsum.photos/seed/zara-ev2/400/400', date: 'Sat, 5 Apr', time: '9:30 PM', venue: 'Skyye', city: 'Bengaluru', price: '900', currency: '₹' },
    ],
  },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567810': {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567810',
    name: 'Elijah Brooks',
    image_url: 'https://picsum.photos/seed/elijah-hero/800/1000',
    bio: 'Soul troubadour from Brooklyn channeling the golden era of Motown into fresh modern recordings. Elijah\'s warm voice and masterful musicianship make every concert a timeless experience.',
    nearYouEvents: [
      { id: 'ev-eb-1', title: 'Elijah Brooks | Motown Nights Pune', image_url: 'https://picsum.photos/seed/elijah-ev1/400/400', date: 'Thu, 20 Mar', time: '7:30 PM', venue: 'Hard Rock Cafe', city: 'Pune', price: '700', currency: '₹' },
      { id: 'ev-eb-2', title: 'Soul & Funk Festival | Mumbai', image_url: 'https://picsum.photos/seed/elijah-ev2/400/400', date: 'Sat, 22 Mar', time: '6:00 PM', venue: 'Rangsharda Auditorium', city: 'Mumbai', price: '1100', currency: '₹' },
    ],
    otherCityEvents: [
      { id: 'ev-eb-3', title: 'Elijah Brooks World Tour | Kolkata', image_url: 'https://picsum.photos/seed/elijah-ev3/400/400', date: 'Sun, 30 Mar', time: '7:00 PM', venue: 'Rabindra Sadan', city: 'Kolkata', price: '600', currency: '₹' },
    ],
  },
};

/** Fetch full artist detail by ID. Falls back to mock data when API is unavailable. */
export async function fetchArtistDetail(id: string): Promise<ArtistDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/artists/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(300);
    return MOCK_ARTIST_DETAILS[id] ?? null;
  }
}
