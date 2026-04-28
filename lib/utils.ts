import { ED_GENERAL_SALE, ED_PRE_SALE, ED_SOLD_OUT } from '@/constants/event-detail.constants';
import type { EventDetail } from '@/interfaces/event-detail.interface';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VIDEO_EXTENSIONS = /\.(mp4|mov|webm|avi|mkv|m4v)(\?|$)/i;
export function isVideo(url: string) { return VIDEO_EXTENSIONS.test(url); }


/**
 * Checks if a string contains only digits.
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Validates a phone number.
 */
export function validatePhoneNumber(phone: string): string | null {
  const trimmed = phone.trim();

  if (!trimmed) {
    return 'Phone number is required.';
  }

  if (!isNumeric(trimmed)) {
    return 'Phone number must contain digits only.';
  }

  if (trimmed.length < 7) {
    return 'Phone number is too short.';
  }

  if (trimmed.length > 15) {
    return 'Phone number is too long.';
  }

  return null;
}

export function slugToTitle(slug: string | undefined, override?: string | null): string {
  if (override) return override;
  return slug?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') ?? '';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatScheduleDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getDateParts(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  return { day, month, weekday };
}

/** Parses a YYYY-MM-DD string into a Date without timezone issues. */
export function parseDate(yyyyMmDd: string): Date {
  const parts = yyyyMmDd.split('-').map(Number);
  return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1);
}

/** Formats YYYY-MM-DD as "Wednesday, 15 January 2026" (for booking summary). */
export function formatBookingDate(yyyyMmDd: string): string {
  try {
    const d = parseDate(yyyyMmDd);
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return yyyyMmDd;
  }
}

/** Like formatTime but omits `:00` when minutes are zero (e.g. "8 PM" instead of "8:00 PM"). */
export function formatTimeCompact(hhmm: string): string {
  try {
    const parts = hhmm.split(':').map(Number);
    const h = parts[0] ?? 0;
    const m = parts[1] ?? 0;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  } catch {
    return hhmm;
  }
}


export function getSaleLabel(status: EventDetail['saleStatus']): string {
  switch (status) {
    case 'general_sale':
      return ED_GENERAL_SALE;
    case 'pre_sale':
      return ED_PRE_SALE;
    case 'sold_out':
      return ED_SOLD_OUT;
    default:
      return ED_GENERAL_SALE;
  }
}

export function formatCardNumber(text: string): string {
  const cleaned = text.replace(/\D/g, '').slice(0, 16);
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

export function formatCardExpiry(text: string): string {
  const cleaned = text.replace(/\D/g, '').slice(0, 4);
  return cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
}