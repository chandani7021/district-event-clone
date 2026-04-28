import type { Show, TicketType, ZoneType } from '../types/booking.types';
import { ZONE_PRICING } from '../constants';

// ── Date helpers ─────────────────────────────────────────────────────────────
const today = new Date();
const relDate = (days: number): string => {
  const d = new Date(today);
  d.setDate(today.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const SEATSIO_TEST_EVENT_KEY = '846f615b-027e-4065-a001-837c1872ad6c';
const SEATSIO_ZONE_EVENT_KEY = 'e4e23fe4-7cce-4124-a55e-0993d21f3d90';

// ── Non-seated A: Single day · single show ───────────────────────────────────
// Event: Taylor Swift — 0005
// Flow: (load) → tickets
const scenarioAShows: Show[] = [
  {
    id: 'mock-a-show-1',
    date: relDate(3),
    start_time: '20:00',
    end_time: '23:00',
    available_tickets: 350,
    is_sold_out: false,
  },
];

const scenarioATickets: TicketType[] = [
  { id: 'mock-a-tt-1', name: 'Early Bird | Single', price: 1000, currency: 'INR', description: 'Each ticket grants entry for one individual to this event.', max_per_order: 10, available: 200, is_sold_out: false },
  { id: 'mock-a-tt-2', name: 'Early Bird | Buddy Pass', price: 1600, currency: 'INR', description: 'Each ticket grants entry for two individuals to the event.', max_per_order: 5, available: 80, is_sold_out: false },
  { id: 'mock-a-tt-3', name: 'Early Bird | Group of 4', price: 3000, currency: 'INR', description: 'Each ticket grants entry for four individuals to the event.', max_per_order: 3, available: 30, is_sold_out: false },
];

// ── Non-seated B: Single day · multiple shows ────────────────────────────────
// Event: Coldplay — 0001
// Flow: time → tickets
const scenarioBShows: Show[] = [
  { id: 'mock-b-show-1', date: relDate(1), start_time: '13:00', end_time: '15:30', available_tickets: 220, is_sold_out: false },
  { id: 'mock-b-show-2', date: relDate(1), start_time: '17:00', end_time: '19:30', available_tickets: 90, is_sold_out: false },
  { id: 'mock-b-show-3', date: relDate(1), start_time: '20:30', end_time: '23:00', available_tickets: 0, is_sold_out: true },
];

const scenarioBTickets: TicketType[] = [
  { id: 'mock-b-tt-1', name: 'General Admission', price: 2500, currency: 'INR', description: 'Standing area with great views of the stage.', max_per_order: 10, available: 1200, is_sold_out: false },
  { id: 'mock-b-tt-2', name: 'VIP', price: 7500, currency: 'INR', description: 'Premium zone, express entry + 2 complimentary drinks.', max_per_order: 4, available: 80, is_sold_out: false },
  { id: 'mock-b-tt-3', name: 'Platinum', price: 15000, currency: 'INR', description: 'Front-row standing, VIP lounge & exclusive merch bag.', max_per_order: 2, available: 12, is_sold_out: false },
];

// ── Non-seated C: Multiple days (≤7) · single show per day ──────────────────
// Event: Goa Sunburn Festival — 0004
// Flow: date → tickets (auto-advances; 3 dates → pill list, no calendar toggle)
const scenarioCShows: Show[] = [
  { id: 'mock-c-show-1', date: '2026-12-26', start_time: '16:00', end_time: '02:00', available_tickets: 500, is_sold_out: false },
  { id: 'mock-c-show-2', date: '2026-12-27', start_time: '16:00', end_time: '02:00', available_tickets: 320, is_sold_out: false },
  { id: 'mock-c-show-3', date: '2026-12-28', start_time: '16:00', end_time: '02:00', available_tickets: 50, is_sold_out: false },
];

const scenarioCTickets: TicketType[] = [
  { id: 'mock-c-tt-1', name: 'Day Pass', price: 3500, currency: 'INR', description: 'Single day entry to the festival grounds.', max_per_order: 10, available: 500, is_sold_out: false },
  { id: 'mock-c-tt-2', name: '3-Day Pass', price: 8500, currency: 'INR', description: 'Full festival access for all three days.', max_per_order: 6, available: 200, is_sold_out: false },
  { id: 'mock-c-tt-3', name: 'VIP 3-Day', price: 18000, currency: 'INR', description: 'VIP lounge access, express lanes & artist meet-greet ballot.', max_per_order: 2, available: 40, is_sold_out: false },
];

// ── Non-seated D: Multiple days (>7) · multiple shows per day ───────────────
// Event: Hyderabad Art Week — 0015
// Flow: date → time → tickets  (8 dates → calendar toggle appears)
const scenarioDDates = [
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
  '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08',
];

const scenarioDShows: Show[] = scenarioDDates.flatMap((date, i) => [
  { id: `mock-d-show-${i + 1}-am`, date, start_time: '11:00', end_time: '13:30', available_tickets: 120, is_sold_out: false },
  { id: `mock-d-show-${i + 1}-pm`, date, start_time: '17:00', end_time: '20:00', available_tickets: i === 2 ? 0 : 80, is_sold_out: i === 2 },
]);

const scenarioDTickets: TicketType[] = [
  { id: 'mock-d-tt-1', name: 'Standard Entry', price: 800, currency: 'INR', description: 'Access to all open galleries and installations.', max_per_order: 8, available: 300, is_sold_out: false },
  { id: 'mock-d-tt-2', name: 'Guided Tour', price: 1500, currency: 'INR', description: 'Curator-led tour + standard entry.', max_per_order: 4, available: 60, is_sold_out: false },
  { id: 'mock-d-tt-3', name: 'Patron Pass', price: 5000, currency: 'INR', description: 'All-session access + opening night reception + merch.', max_per_order: 2, available: 20, is_sold_out: false },
];

// ── Seated A: Single day · single show · zone-based ─────────────────────────
// Event: Gully Gang Open Mic Night — 0012
// Flow: (load) → seats (zone/stand cards)
// Zone category label (lowercase) → seatsio event key for individual seat picking within that zone.
// Only platinum supports drill-down seat picking; gold/silver use quantity-based ticket selection.
const ZONE_SEAT_CHARTS: Record<string, string> = {
  platinum: 'd24009bf-13a9-4b36-90a3-a29b5a80d7dc',
};

const seatedAShows: Show[] = [
  { id: 'seated-a-show-1', date: '2026-08-15', start_time: '19:00', end_time: '22:00', seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: 'zone', zone_seat_charts: ZONE_SEAT_CHARTS, available_tickets: 120, is_sold_out: false },
];

// ── Seated B: Single day · multiple shows · seat-map ────────────────────────
// Event: A.R. Rahman: Harmony Live in Concert — 0009
// Flow: time → seats (seatsio chart)
const seatedBShows: Show[] = [
  { id: 'seated-b-show-1', date: '2026-11-20', start_time: '15:00', end_time: '17:30', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 200, is_sold_out: false },
  { id: 'seated-b-show-2', date: '2026-11-20', start_time: '19:00', end_time: '22:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 180, is_sold_out: false },
];

// ── Seated C: Multiple days (≤7) · single show/day · zone-based ─────────────
// Event: Vir Das: Mind Fool India Tour — 0010
// Flow: date → seats (zone/stand cards; auto-advances on date select)
const seatedCShows: Show[] = [
  { id: 'seated-c-show-1', date: relDate(2), start_time: '20:00', end_time: '21:45', seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: 'zone', zone_seat_charts: ZONE_SEAT_CHARTS, zone_pricing: ZONE_PRICING, available_tickets: 180, is_sold_out: false },
  { id: 'seated-c-show-2', date: relDate(3), start_time: '20:00', end_time: '21:45', seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: 'zone', zone_seat_charts: ZONE_SEAT_CHARTS, zone_pricing: ZONE_PRICING, available_tickets: 60, is_sold_out: false },
  { id: 'seated-c-show-3', date: relDate(4), start_time: '20:00', end_time: '21:45', seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: 'zone', zone_seat_charts: ZONE_SEAT_CHARTS, zone_pricing: ZONE_PRICING, available_tickets: 0, is_sold_out: true },
];

// ── Seated D: Multiple days · multiple shows/day · seat-map ─────────────────
// Event: The Phantom of the Opera — 0002
// Flow: date → time → seats (seatsio chart)
const phantomShows: Show[] = [
  { id: 'show-phant-1', date: relDate(0), start_time: '15:00', end_time: '17:30', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: false },
  { id: 'show-phant-2', date: relDate(0), start_time: '19:30', end_time: '22:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: false },
  { id: 'show-phant-3', date: '2026-04-12', start_time: '15:00', end_time: '17:30', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: false },
  { id: 'show-phant-4', date: '2026-04-12', start_time: '19:30', end_time: '22:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: false },
  { id: 'show-phant-5', date: '2026-04-19', start_time: '15:00', end_time: '17:30', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: false },
  { id: 'show-phant-6', date: relDate(5), start_time: '19:30', end_time: '22:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, is_sold_out: true },
];

// ── Non-seated E: Single day · sold-out · multiple shows ────────────────────
// Event: Kendrick Lamar: Grand National Tour — 0003
// Flow: time → tickets (all shows sold out)
const kendrickShows: Show[] = [
  { id: 'show-kend-1', date: '2026-05-10', start_time: '18:00', end_time: '21:00', available_tickets: 0, is_sold_out: true },
  { id: 'show-kend-2', date: '2026-05-11', start_time: '18:00', end_time: '21:00', available_tickets: 0, is_sold_out: true },
];

const kendrickTickets: TicketType[] = [
  { id: 'tt-kend-1', name: 'General Floor', price: 4500, currency: 'INR', description: 'Standing area closest to the stage.', max_per_order: 6, available: 0, is_sold_out: true },
  { id: 'tt-kend-2', name: 'VIP Floor', price: 9000, currency: 'INR', description: 'Priority standing with express entry and dedicated viewing area.', max_per_order: 4, available: 0, is_sold_out: true },
  { id: 'tt-kend-3', name: 'Platinum', price: 20000, currency: 'INR', description: 'Front-row standing, VIP lounge access & exclusive merch.', max_per_order: 2, available: 0, is_sold_out: true },
];

// ── Non-seated F: Multiple days · single show per day ───────────────────────
// Event: Tomorrowland 2026: India Edition — 0006
// Flow: date → tickets
const tomorrowlandShows: Show[] = [
  { id: 'show-tmrl-1', date: '2026-11-06', start_time: '14:00', end_time: '04:00', available_tickets: 800, is_sold_out: false },
  { id: 'show-tmrl-2', date: '2026-11-07', start_time: '14:00', end_time: '04:00', available_tickets: 650, is_sold_out: false },
  { id: 'show-tmrl-3', date: '2026-11-08', start_time: '14:00', end_time: '04:00', available_tickets: 200, is_sold_out: false },
];

const tomorrowlandTickets: TicketType[] = [
  { id: 'tt-tmrl-1', name: 'Day Pass', price: 5000, currency: 'INR', description: 'Single day festival entry.', max_per_order: 10, available: 800, is_sold_out: false },
  { id: 'tt-tmrl-2', name: '3-Day Pass', price: 12000, currency: 'INR', description: 'Full festival access for all three days.', max_per_order: 6, available: 300, is_sold_out: false },
  { id: 'tt-tmrl-3', name: 'VIP 3-Day', price: 25000, currency: 'INR', description: 'Exclusive VIP lounge, express lanes & complimentary bar.', max_per_order: 2, available: 50, is_sold_out: false },
];

// ── Non-seated G: Single day · single show ───────────────────────────────────
// Event: Sunburn Arena ft. Alan Walker — 0007
// Flow: (load) → tickets
const alanWalkerShows: Show[] = [
  { id: 'show-aw-1', date: '2026-07-19', start_time: '20:00', end_time: '23:30', available_tickets: 400, is_sold_out: false },
];

const alanWalkerTickets: TicketType[] = [
  { id: 'tt-aw-1', name: 'General Admission', price: 2999, currency: 'INR', description: 'Standing area with great views of the stage.', max_per_order: 8, available: 300, is_sold_out: false },
  { id: 'tt-aw-2', name: 'VIP', price: 7500, currency: 'INR', description: 'Premium zone with dedicated bar & express entry.', max_per_order: 4, available: 80, is_sold_out: false },
  { id: 'tt-aw-3', name: 'Platinum', price: 14000, currency: 'INR', description: 'Front-row standing, exclusive merch & VIP lounge.', max_per_order: 2, available: 20, is_sold_out: false },
];

// ── Non-seated H: Multiple days · multiple sessions per day ─────────────────
// Event: Bengaluru Food & Drinks Festival 2026 — 0011
// Flow: date → time → tickets
const bengaluruFoodShows: Show[] = [
  { id: 'show-bfd-1-am', date: '2026-09-19', start_time: '11:00', end_time: '15:00', available_tickets: 250, is_sold_out: false },
  { id: 'show-bfd-1-pm', date: '2026-09-19', start_time: '16:00', end_time: '21:00', available_tickets: 180, is_sold_out: false },
  { id: 'show-bfd-2-am', date: '2026-09-20', start_time: '11:00', end_time: '15:00', available_tickets: 200, is_sold_out: false },
  { id: 'show-bfd-2-pm', date: '2026-09-20', start_time: '16:00', end_time: '21:00', available_tickets: 90, is_sold_out: false },
  { id: 'show-bfd-3-am', date: '2026-09-21', start_time: '11:00', end_time: '15:00', available_tickets: 150, is_sold_out: false },
  { id: 'show-bfd-3-pm', date: '2026-09-21', start_time: '16:00', end_time: '21:00', available_tickets: 0, is_sold_out: true },
];

const bengaluruFoodTickets: TicketType[] = [
  { id: 'tt-bfd-1', name: 'Day Pass', price: 999, currency: 'INR', description: 'Entry to all open-air food stalls and live performances.', max_per_order: 10, available: 400, is_sold_out: false },
  { id: 'tt-bfd-2', name: 'Weekend Pass', price: 2200, currency: 'INR', description: 'All-weekend access with unlimited tasting tokens.', max_per_order: 6, available: 150, is_sold_out: false },
  { id: 'tt-bfd-3', name: 'VIP Masterclass', price: 4500, currency: 'INR', description: 'Weekend pass + exclusive hands-on masterclass with a celebrity chef.', max_per_order: 2, available: 30, is_sold_out: false },
];

// ── Non-seated I: Multiple days · multiple sessions per day ─────────────────
// Event: Ashtanga Yoga & Wellness Retreat — 0014
// Flow: date → time → tickets
const yogaRetreatShows: Show[] = [
  { id: 'show-yoga-1-am', date: '2026-10-17', start_time: '06:30', end_time: '09:00', available_tickets: 40, is_sold_out: false },
  { id: 'show-yoga-1-pm', date: '2026-10-17', start_time: '16:00', end_time: '18:30', available_tickets: 40, is_sold_out: false },
  { id: 'show-yoga-2-am', date: '2026-10-18', start_time: '06:30', end_time: '09:00', available_tickets: 40, is_sold_out: false },
  { id: 'show-yoga-2-pm', date: '2026-10-18', start_time: '16:00', end_time: '18:30', available_tickets: 20, is_sold_out: false },
  { id: 'show-yoga-3-am', date: '2026-10-19', start_time: '06:30', end_time: '09:00', available_tickets: 15, is_sold_out: false },
  { id: 'show-yoga-3-pm', date: '2026-10-19', start_time: '16:00', end_time: '18:30', available_tickets: 0, is_sold_out: true },
];

const yogaRetreatTickets: TicketType[] = [
  { id: 'tt-yoga-1', name: 'Day Pass', price: 1800, currency: 'INR', description: 'Access to all sessions for a single day.', max_per_order: 4, available: 80, is_sold_out: false },
  { id: 'tt-yoga-2', name: '3-Day Pass', price: 4500, currency: 'INR', description: 'Full retreat access for all three days including meals.', max_per_order: 2, available: 30, is_sold_out: false },
  { id: 'tt-yoga-3', name: 'VIP Wellness Package', price: 9000, currency: 'INR', description: '3-day pass + private Ayurvedic consultation & sound healing session.', max_per_order: 1, available: 10, is_sold_out: false },
];

// ── Non-seated J: Single day · single show ───────────────────────────────────
// Event: New Year's Eve Rooftop Party: Mumbai 2027 — 0016
// Flow: (load) → tickets
const nyePartyShows: Show[] = [
  { id: 'show-nye-1', date: '2026-12-31', start_time: '20:00', end_time: '03:00', available_tickets: 200, is_sold_out: false },
];

const nyePartyTickets: TicketType[] = [
  { id: 'tt-nye-1', name: 'Standard', price: 3500, currency: 'INR', description: 'Entry with open bar and gourmet canapés all night.', max_per_order: 6, available: 120, is_sold_out: false },
  { id: 'tt-nye-2', name: 'Premium', price: 6500, currency: 'INR', description: 'Priority seating, premium bar & dedicated server.', max_per_order: 4, available: 60, is_sold_out: false },
  { id: 'tt-nye-3', name: 'VIP Table', price: 15000, currency: 'INR', description: 'Private table for 4, bottle service & first-row countdown view.', max_per_order: 1, available: 20, is_sold_out: false },
];

// ── Seated E: Single day · multiple shows · seat-map ────────────────────────
// Event: Zakir Khan Live — 0008
// Flow: time → seats (seatsio chart)
const zakirKhanShows: Show[] = [
  { id: 'show-zakir-1', date: '2026-09-06', start_time: '17:00', end_time: '19:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 300, is_sold_out: false },
  { id: 'show-zakir-2', date: '2026-09-06', start_time: '21:00', end_time: '23:00', seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 180, is_sold_out: false },
];

// ── Seated F: Single day · single show · zone-based ─────────────────────────
// Event: IPL 2026: MI vs RCB — 0013
// Flow: (load) → seats (zone chart)
// All zones support individual seat picking
const IPL_ZONE_SEAT_CHARTS: Record<string, string> = {
  platinum: 'd24009bf-13a9-4b36-90a3-a29b5a80d7dc',
  gold: SEATSIO_TEST_EVENT_KEY,
  silver: SEATSIO_TEST_EVENT_KEY,
};

const iplShows: Show[] = [
  { id: 'show-ipl-1', date: '2026-04-18', start_time: '19:30', end_time: '23:30', seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: 'zone', zone_seat_charts: IPL_ZONE_SEAT_CHARTS, zone_pricing: ZONE_PRICING, available_tickets: 250, is_sold_out: false },
];

// ── Default fallback (single day · multiple shows · non-seated) ──────────────
const defaultShows: Show[] = [
  { id: 'show-def-1', date: relDate(0), start_time: '14:00', end_time: '16:30', available_tickets: 80, is_sold_out: false },
  { id: 'show-def-2', date: relDate(0), start_time: '18:30', end_time: '21:00', available_tickets: 120, is_sold_out: false },
  { id: 'show-def-3', date: relDate(1), start_time: '21:30', end_time: '00:00', available_tickets: 30, is_sold_out: false },
];

const defaultTickets: TicketType[] = [
  { id: 'tt-std', name: 'Standard', price: 999, currency: 'INR', description: 'General entry', max_per_order: 8, available: 100, is_sold_out: false },
  { id: 'tt-prem', name: 'Premium', price: 2499, currency: 'INR', description: 'Priority entry with reserved area access', max_per_order: 4, available: 30, is_sold_out: false },
];

// ── Zone types (zone-based seated events) ────────────────────────────────────
// Seated A: Gully Gang Open Mic Night — 0012
const seatedAZones: ZoneType[] = [
  { id: 'zone-a-pit', name: 'Pit Standing', price: 2500, currency: 'INR', description: 'Front standing area closest to the stage.', available: 60, max_per_order: 6, is_sold_out: false },
  { id: 'zone-a-vip', name: 'VIP Seating', price: 5000, currency: 'INR', description: 'Reserved seats with premium sightlines and table service.', available: 20, max_per_order: 4, is_sold_out: false },
  { id: 'zone-a-gen', name: 'General Seating', price: 1500, currency: 'INR', description: 'Open seating in the main hall.', available: 40, max_per_order: 8, is_sold_out: false },
];

// Seated C: Vir Das: Mind Fool India Tour — 0010
const seatedCZones: ZoneType[] = [
  { id: 'zone-c-gold', name: 'Gold', price: 3000, currency: 'INR', description: 'Best seats in the house — front and centre.', available: 30, max_per_order: 4, is_sold_out: false },
  { id: 'zone-c-silver', name: 'Silver', price: 2000, currency: 'INR', description: 'Great mid-section seats with clear views.', available: 80, max_per_order: 6, is_sold_out: false },
  { id: 'zone-c-bronze', name: 'Bronze', price: 1200, currency: 'INR', description: 'Value seats at the rear of the venue.', available: 120, max_per_order: 8, is_sold_out: false },
];

const defaultZones: ZoneType[] = [
  { id: 'zone-def-gen', name: 'General', price: 999, currency: 'INR', description: 'General admission zone.', available: 100, max_per_order: 8, is_sold_out: false },
];

// ── Exports ───────────────────────────────────────────────────────────────────
/**
 * Shows keyed by event ID. fetchEventShows checks this FIRST.
 *
 * Non-seated:
 *   A — single day  · single show  → Sunburn Arena     (0007)  flow: tickets
 *   B — single day  · multi show   → Coldplay         (0001)  flow: time → tickets
 *   C — multi day   · single/day   → Sunburn          (0004)  flow: date → tickets (auto-advance)
 *   D — multi day   · multi/day    → Art Week         (0015)  flow: date → time → tickets + calendar toggle
 *
 * Seated:
 *   A — single day  · single show  → Gully Gang       (0012)  flow: seats (zone-based)
 *   B — single day  · multi show   → Zakir khan     (0008)  flow: time → seats (seat-map)
 *   C — multi day   · single/day   → Vir Das          (0010)  flow: date → seats (zone-based, auto-advance)
 *   D — multi day   · multi/day    → Phantom          (0002)  flow: date → time → seats (seat-map)
 */
export const mockShows: Record<string, Show[]> = {
  // Non-seated A — Taylor Swift: The Eras Tour (single day · single show)
  'e1b2c3d4-0005-0005-0005-000000000005': scenarioAShows,
  // Non-seated B — Coldplay: Music of the Spheres (single day · multi show)
  'e1b2c3d4-0001-0001-0001-000000000001': scenarioBShows,
  // Non-seated C — Goa Sunburn Festival (multi day · single show/day)
  'e1b2c3d4-0004-0004-0004-000000000004': scenarioCShows,
  // Non-seated D — Hyderabad Art Week (multi day >7 · multi show/day)
  'e1b2c3d4-0015-0015-0015-000000000015': scenarioDShows,
  // Non-seated E — Kendrick Lamar: Grand National Tour (sold out)
  'e1b2c3d4-0003-0003-0003-000000000003': kendrickShows,
  // Non-seated F — Tomorrowland 2026: India Edition (multi day · single show/day)
  'e1b2c3d4-0006-0006-0006-000000000006': tomorrowlandShows,
  // Non-seated G — Sunburn Arena ft. Alan Walker (single day · single show)
  'e1b2c3d4-0007-0007-0007-000000000007': alanWalkerShows,
  // Non-seated H — Bengaluru Food & Drinks Festival (multi day · multi session/day)
  'e1b2c3d4-0011-0011-0011-000000000011': bengaluruFoodShows,
  // Non-seated I — Ashtanga Yoga & Wellness Retreat (multi day · multi session/day)
  'e1b2c3d4-0014-0014-0014-000000000014': yogaRetreatShows,
  // Non-seated J — New Year's Eve Rooftop Party (single day · single show)
  'e1b2c3d4-0016-0016-0016-000000000016': nyePartyShows,
  // Seated A — Gully Gang Open Mic Night (single day · zone chart)
  'e1b2c3d4-0012-0012-0012-000000000012': seatedAShows,
  // Seated B — A.R. Rahman: Harmony Live (single day · multi show · seat chart)
  'e1b2c3d4-0009-0009-0009-000000000009': seatedBShows,
  // Seated C — Vir Das: Mind Fool India Tour (multi day · zone chart)
  'e1b2c3d4-0010-0010-0010-000000000010': seatedCShows,
  // Seated D — The Phantom of the Opera (multi day · multi show · seat chart)
  'e1b2c3d4-0002-0002-0002-000000000002': phantomShows,
  // Seated E — Zakir Khan Live (single day · multi show · seat chart)
  'e1b2c3d4-0008-0008-0008-000000000008': zakirKhanShows,
  // Seated F — IPL 2026: MI vs RCB (single day · zone chart)
  'e1b2c3d4-0013-0013-0013-000000000013': iplShows,
  default: defaultShows,
};

export const mockTicketTypes: Record<string, TicketType[]> = {
  // Non-seated A — Taylor Swift
  'e1b2c3d4-0005-0005-0005-000000000005': scenarioATickets,
  // Non-seated B — Coldplay
  'e1b2c3d4-0001-0001-0001-000000000001': scenarioBTickets,
  // Non-seated C — Goa Sunburn Festival
  'e1b2c3d4-0004-0004-0004-000000000004': scenarioCTickets,
  // Non-seated D — Hyderabad Art Week
  'e1b2c3d4-0015-0015-0015-000000000015': scenarioDTickets,
  // Non-seated E — Kendrick Lamar
  'e1b2c3d4-0003-0003-0003-000000000003': kendrickTickets,
  // Non-seated F — Tomorrowland
  'e1b2c3d4-0006-0006-0006-000000000006': tomorrowlandTickets,
  // Non-seated G — Sunburn Arena ft. Alan Walker
  'e1b2c3d4-0007-0007-0007-000000000007': alanWalkerTickets,
  // Non-seated H — Bengaluru Food & Drinks Festival
  'e1b2c3d4-0011-0011-0011-000000000011': bengaluruFoodTickets,
  // Non-seated I — Ashtanga Yoga & Wellness Retreat
  'e1b2c3d4-0014-0014-0014-000000000014': yogaRetreatTickets,
  // Non-seated J — New Year's Eve Rooftop Party
  'e1b2c3d4-0016-0016-0016-000000000016': nyePartyTickets,
  default: defaultTickets,
};

export const mockZoneTypes: Record<string, ZoneType[]> = {
  'e1b2c3d4-0012-0012-0012-000000000012': seatedAZones,
  'e1b2c3d4-0010-0010-0010-000000000010': seatedCZones,
  default: defaultZones,
};
