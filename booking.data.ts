import type { Show, TicketType } from "../types"

// ── Date helpers ────────────────────────────────────────────────────────────
const today = new Date()
const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
const relDate = (days: number) => {
  const d = new Date(today)
  d.setDate(today.getDate() + days)
  return formatDate(d)
}

const SEATSIO_TEST_EVENT_KEY = "846f615b-027e-4065-a001-837c1872ad6c"
const SEATSIO_ZONE_EVENT_KEY = "e4e23fe4-7cce-4124-a55e-0993d21f3d90"

// ── Scenario A: Single day · single show ────────────────────────────────────
// Event: Taylor Swift — e1b2c3d4-0005-0005-0005-000000000005
// Flow:  (load) → tickets
const scenarioAShows: Show[] = [
  {
    id: "mock-a-show-1",
    date: relDate(3),
    start_time: "20:00",
    end_time: "23:00",
    available_tickets: 350,
    is_sold_out: false,
  },
]

const scenarioATickets: TicketType[] = [
  {
    id: "mock-a-tt-1",
    name: "Early Bird | Single",
    price: 1000,
    currency: "INR",
    description: "Each ticket grants entry for one individual to this event.",
    max_per_order: 10,
    available: 200,
    is_sold_out: false,
  },
  {
    id: "mock-a-tt-2",
    name: "Early Bird | Buddy Pass",
    price: 1600,
    currency: "INR",
    description: "Each ticket grants entry for two individuals to the event.",
    max_per_order: 5,
    available: 80,
    is_sold_out: false,
  },
  {
    id: "mock-a-tt-3",
    name: "Early Bird | Group of 4",
    price: 3000,
    currency: "INR",
    description: "Each ticket grants entry for four individuals to the event.",
    max_per_order: 3,
    available: 30,
    is_sold_out: false,
  },
]

// ── Scenario B: Single day · multiple shows ──────────────────────────────────
// Event: Coldplay — e1b2c3d4-0001-0001-0001-000000000001
// Flow:  time → tickets
const scenarioBShows: Show[] = [
  {
    id: "mock-b-show-1",
    date: relDate(1),
    start_time: "13:00",
    end_time: "15:30",
    available_tickets: 220,
    is_sold_out: false,
  },
  {
    id: "mock-b-show-2",
    date: relDate(1),
    start_time: "17:00",
    end_time: "19:30",
    available_tickets: 90,
    is_sold_out: false,
  },
  {
    id: "mock-b-show-3",
    date: relDate(1),
    start_time: "20:30",
    end_time: "23:00",
    available_tickets: 0,
    is_sold_out: true,
  },
]

const scenarioBTickets: TicketType[] = [
  {
    id: "mock-b-tt-1",
    name: "General Admission",
    price: 2500,
    currency: "INR",
    description: "Standing area with great views of the stage.",
    max_per_order: 10,
    available: 1200,
    is_sold_out: false,
  },
  {
    id: "mock-b-tt-2",
    name: "VIP",
    price: 7500,
    currency: "INR",
    description: "Premium zone, express entry + 2 complimentary drinks.",
    max_per_order: 4,
    available: 80,
    is_sold_out: false,
  },
  {
    id: "mock-b-tt-3",
    name: "Platinum",
    price: 15000,
    currency: "INR",
    description: "Front-row standing, VIP lounge & exclusive merch bag.",
    max_per_order: 2,
    available: 12,
    is_sold_out: false,
  },
]

// ── Scenario C: Multiple days (≤7) · single show per day ────────────────────
// Event: Goa Sunburn Festival — e1b2c3d4-0004-0004-0004-000000000004
// Flow:  date → tickets (auto-advances since 1 show per date)
// 3 dates → pill list view only, no calendar toggle
const scenarioCShows: Show[] = [
  {
    id: "mock-c-show-1",
    date: "2026-12-26",
    start_time: "16:00",
    end_time: "02:00",
    available_tickets: 500,
    is_sold_out: false,
  },
  {
    id: "mock-c-show-2",
    date: "2026-12-27",
    start_time: "16:00",
    end_time: "02:00",
    available_tickets: 320,
    is_sold_out: false,
  },
  {
    id: "mock-c-show-3",
    date: "2026-12-28",
    start_time: "16:00",
    end_time: "02:00",
    available_tickets: 50,
    is_sold_out: false,
  },
]

const scenarioCTickets: TicketType[] = [
  {
    id: "mock-c-tt-1",
    name: "Day Pass",
    price: 3500,
    currency: "INR",
    description: "Single day entry to the festival grounds.",
    max_per_order: 10,
    available: 500,
    is_sold_out: false,
  },
  {
    id: "mock-c-tt-2",
    name: "3-Day Pass",
    price: 8500,
    currency: "INR",
    description: "Full festival access for all three days.",
    max_per_order: 6,
    available: 200,
    is_sold_out: false,
  },
  {
    id: "mock-c-tt-3",
    name: "VIP 3-Day",
    price: 18000,
    currency: "INR",
    description: "VIP lounge access, express lanes & artist meet-greet ballot.",
    max_per_order: 2,
    available: 40,
    is_sold_out: false,
  },
]

// ── Scenario D: Multiple days (>7) · multiple shows per day ─────────────────
// Event: Hyderabad Art Week — e1b2c3d4-0015-0015-0015-000000000015
// Flow:  date → time → tickets
// 8 dates → calendar toggle appears (>7 dates)
const scenarioDDates = [
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
]

const scenarioDShows: Show[] = scenarioDDates.flatMap((date, i) => [
  {
    id: `mock-d-show-${i + 1}-am`,
    date,
    start_time: "11:00",
    end_time: "13:30",
    available_tickets: 120,
    is_sold_out: false,
  },
  {
    id: `mock-d-show-${i + 1}-pm`,
    date,
    start_time: "17:00",
    end_time: "20:00",
    available_tickets: i === 2 ? 0 : 80,
    is_sold_out: i === 2,
  },
])

const scenarioDTickets: TicketType[] = [
  {
    id: "mock-d-tt-1",
    name: "Standard Entry",
    price: 800,
    currency: "INR",
    description: "Access to all open galleries and installations.",
    max_per_order: 8,
    available: 300,
    is_sold_out: false,
  },
  {
    id: "mock-d-tt-2",
    name: "Guided Tour",
    price: 1500,
    currency: "INR",
    description: "Curator-led tour + standard entry.",
    max_per_order: 4,
    available: 60,
    is_sold_out: false,
  },
  {
    id: "mock-d-tt-3",
    name: "Patron Pass",
    price: 5000,
    currency: "INR",
    description: "All-session access + opening night reception + merch.",
    max_per_order: 2,
    available: 20,
    is_sold_out: false,
  },
]

// ── Seated A: Single day · single show · zone-based ─────────────────────────
// Event: Gully Gang Open Mic Night — e1b2c3d4-0012-0012-0012-000000000012
// Flow:  (load) → seats (zone/stand cards — no seatsio_event_key)
const seatedAShows: Show[] = [
  { id: "seated-a-show-1", date: "2026-08-15", start_time: "19:00", end_time: "22:00", seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: "zone", available_tickets: 120, is_sold_out: false },
]

// ── Seated B: Single day · multiple shows · seat-map ────────────────────────
// Event: A.R. Rahman: Harmony Live in Concert — e1b2c3d4-0009-0009-0009-000000000009
// Flow:  time → seats (seatsio chart)
const seatedBShows: Show[] = [
  { id: "seated-b-show-1", date: "2026-11-20", start_time: "15:00", end_time: "17:30", seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 200, is_sold_out: false },
  { id: "seated-b-show-2", date: "2026-11-20", start_time: "19:00", end_time: "22:00", seatsio_event_key: SEATSIO_TEST_EVENT_KEY, available_tickets: 180, is_sold_out: false },
]

// ── Seated C: Multiple days (≤7) · single show/day · zone-based ─────────────
// Event: Vir Das: Mind Fool India Tour — e1b2c3d4-0010-0010-0010-000000000010
// Flow:  date → seats (zone/stand cards, auto-advances on date select since 1 show/day)
const seatedCShows: Show[] = [
  { id: "seated-c-show-1", date: relDate(2), start_time: "20:00", end_time: "21:45", seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: "zone", available_tickets: 180, is_sold_out: false },
  { id: "seated-c-show-2", date: relDate(3), start_time: "20:00", end_time: "21:45", seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: "zone", available_tickets: 60, is_sold_out: false },
  { id: "seated-c-show-3", date: relDate(4), start_time: "20:00", end_time: "21:45", seatsio_event_key: SEATSIO_ZONE_EVENT_KEY, seating_mode: "zone", available_tickets: 0, is_sold_out: true },
]

// ── Seated D: Multiple days · multiple shows/day · seat-map ─────────────────
// Event: The Phantom of the Opera — e1b2c3d4-0002-0002-0002-000000000002
// Flow:  date → time → seats (seatsio chart)
const phantomShows: Show[] = [
  {
    id: "show-phant-1",
    date: relDate(0),
    start_time: "15:00",
    end_time: "17:30",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: false,
  },
  {
    id: "show-phant-2",
    date: relDate(0),
    start_time: "19:30",
    end_time: "22:00",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: false,
  },
  {
    id: "show-phant-3",
    date: "2026-04-12",
    start_time: "15:00",
    end_time: "17:30",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: false,
  },
  {
    id: "show-phant-4",
    date: "2026-04-12",
    start_time: "19:30",
    end_time: "22:00",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: false,
  },
  {
    id: "show-phant-5",
    date: "2026-04-19",
    start_time: "15:00",
    end_time: "17:30",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: false,
  },
  {
    id: "show-phant-6",
    date: relDate(5),
    start_time: "19:30",
    end_time: "22:00",
    seatsio_event_key: SEATSIO_TEST_EVENT_KEY,
    is_sold_out: true,
  },
]

// ── Default fallback (single day · multiple shows) ───────────────────────────
const defaultShows: Show[] = [
  {
    id: "show-def-1",
    date: relDate(0),
    start_time: "14:00",
    end_time: "16:30",
    available_tickets: 80,
    is_sold_out: false,
  },
  {
    id: "show-def-2",
    date: relDate(0),
    start_time: "18:30",
    end_time: "21:00",
    available_tickets: 120,
    is_sold_out: false,
  },
  {
    id: "show-def-3",
    date: relDate(1),
    start_time: "21:30",
    end_time: "00:00",
    available_tickets: 30,
    is_sold_out: false,
  },
]

const defaultTickets: TicketType[] = [
  {
    id: "tt-std",
    name: "Standard",
    price: 999,
    currency: "INR",
    description: "General entry",
    max_per_order: 8,
    available: 100,
    is_sold_out: false,
  },
  {
    id: "tt-prem",
    name: "Premium",
    price: 2499,
    currency: "INR",
    description: "Priority entry with reserved area access",
    max_per_order: 4,
    available: 30,
    is_sold_out: false,
  },
]

// ── Exports ──────────────────────────────────────────────────────────────────

/**
 * Shows keyed by event ID. `fetchEventShows` checks this FIRST.
 *
 * Non-seated:
 *   A — single day  · single show  → Taylor Swift     (0005)  flow: tickets
 *   B — single day  · multi show   → Coldplay         (0001)  flow: time → tickets
 *   C — multi day   · single/day   → Sunburn          (0004)  flow: date → tickets (auto-advance)
 *   D — multi day   · multi/day    → Art Week         (0015)  flow: date → time → tickets + calendar toggle
 *
 * Seated:
 *   A — single day  · single show  → Gully Gang       (0012)  flow: seats (zone-based)
 *   B — single day  · multi show   → A.R. Rahman      (0009)  flow: time → seats (seat-map)
 *   C — multi day   · single/day   → Vir Das          (0010)  flow: date → seats (zone-based, auto-advance)
 *   D — multi day   · multi/day    → Phantom          (0002)  flow: date → time → seats (seat-map)
 */
export const mockShows: Record<string, Show[]> = {
  // Non-seated
  "e1b2c3d4-0005-0005-0005-000000000005": scenarioAShows,
  "e1b2c3d4-0001-0001-0001-000000000001": scenarioBShows,
  "e1b2c3d4-0004-0004-0004-000000000004": scenarioCShows,
  "e1b2c3d4-0015-0015-0015-000000000015": scenarioDShows,
  // Seated
  "e1b2c3d4-0012-0012-0012-000000000012": seatedAShows,
  "e1b2c3d4-0009-0009-0009-000000000009": seatedBShows,
  "e1b2c3d4-0010-0010-0010-000000000010": seatedCShows,
  "e1b2c3d4-0002-0002-0002-000000000002": phantomShows,
  default: defaultShows,
}

export const mockTicketTypes: Record<string, TicketType[]> = {
  "e1b2c3d4-0005-0005-0005-000000000005": scenarioATickets,
  "e1b2c3d4-0001-0001-0001-000000000001": scenarioBTickets,
  "e1b2c3d4-0004-0004-0004-000000000004": scenarioCTickets,
  "e1b2c3d4-0015-0015-0015-000000000015": scenarioDTickets,
  default: defaultTickets,
}