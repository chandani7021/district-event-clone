import { API_BASE_URL, Endpoints, apiFetch } from '@/constants/api';
import type { BookingType, UserProfile } from '@/interfaces/profile.interface';

// ── Helpers ───────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// ── User profile ──────────────────────────────────────────────────────────────

import { getSavedAccounts } from './accounts.service';

/** Fetch the authenticated user's profile. */
export async function getProfile(): Promise<UserProfile> {
  try {
    const res = await apiFetch(`${API_BASE_URL}${Endpoints.profile.get}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    // Fallback to local accounts if backend is down
    const accounts = await getSavedAccounts();
    const activeAccount = accounts[0]; // Assume most recent is active

    return {
      name: activeAccount?.name ?? undefined,
      phone: activeAccount?.phone ?? '+91 7021405056',
      email: activeAccount?.email ?? undefined,
      gender: activeAccount?.gender ?? undefined,
      avatarUri: activeAccount?.avatarUri ?? undefined,
    };
  }
}

/** Update the authenticated user's profile. */
export async function updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean }> {
  try {
    const res = await apiFetch(`${API_BASE_URL}${Endpoints.profile.update}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return { success: res.ok };
  } catch {
    await delay(300);
    return { success: true };
  }
}

// ── Booking types ─────────────────────────────────────────────────────────────

/** Fetch the available booking category types shown on the profile screen. */
export async function getBookingTypes(): Promise<BookingType[]> {
  try {
    const res = await apiFetch(`${API_BASE_URL}${Endpoints.bookings.types}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(200);
    return [
      { id: 'events', label: 'Events' },
    ];
  }
}
