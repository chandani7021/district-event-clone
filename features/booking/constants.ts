// ── Date/time display arrays ───────────────────────────────────────────────
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

// ── Availability thresholds ────────────────────────────────────────────────
/** Shows "Only N left" / "Filling Fast" badge below this ticket count. */
export const LOW_STOCK_THRESHOLD = 50;

// ── Seatsio zone pricing ───────────────────────────────────────────────────
/** Fallback zone pricing when seatsio chart has no pricing configured.
 *  Category keys must exactly match the seatsio chart category labels (lowercase). */
export const ZONE_PRICING = [
  { category: 'lounge-left', price: 20000 },
  { category: 'lounge-right', price: 20000 },
  { category: 'fanpit-1', price: 10000 },
  { category: 'fanpit-2', price: 10000 },
  { category: 'diamond-left', price: 7000 },
  { category: 'diamond-right', price: 7000 },
  { category: 'platinum', price: 4000 },
  { category: 'gold', price: 3000 },
  { category: 'silver', price: 2000 },
] as const;

// ── Seatsio individual seat pricing ───────────────────────────────────────
/** Fallback pricing for individual seat charts when seatsio has no pricing configured.
 *  Keys must match the seatsio chart category labels exactly (case-sensitive). */
export const SEAT_CATEGORY_PRICING: Record<string, number> = {
  VIP: 5000,
  Gold: 3000,
  Silver: 2000,
  Platinum: 4000,
};

// ── "Filling Fast" badge colours ──────────────────────────────────────────
export const FILLING_FAST_BADGE = {
  background: '#431407',
  border: '#9a3412',
  text: '#fb923c',
} as const;
