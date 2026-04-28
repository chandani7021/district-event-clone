import { API_BASE_URL } from '@/constants/api';
import { mockShows, mockTicketTypes, mockZoneTypes } from '../data/mock-booking.data';
import type { Show, TicketType, ZoneType } from '../types/booking.types';

const USE_MOCK_DATA = true;

const SEATS_API_URL = process.env.EXPO_PUBLIC_SEATS_API_URL ?? 'http://localhost:3001';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchEventShows(eventId: string): Promise<Show[]> {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockShows[eventId] ?? mockShows['default'] ?? [];
  }
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/shows`);
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
}

export async function fetchTicketTypes(eventId: string): Promise<TicketType[]> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockTicketTypes[eventId] ?? mockTicketTypes['default'] ?? [];
  }
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/ticket-types`);
  if (!res.ok) throw new Error('Failed to fetch ticket types');
  return res.json();
}

/**
 * Book seats for a seated event.
 * Calls the seatsio-backend which handles seat holds with seats.io API.
 */
export async function bookSeats(params: {
  eventKey: string;
  seatIds: string[];
}): Promise<{ success: boolean; bookingId: string }> {
  if (USE_MOCK_DATA) {
    await delay(900);
    return {
      success: true,
      bookingId: 'BK-' + Math.random().toString(36).toUpperCase().substring(2, 10),
    };
  }
  const res = await fetch(`${SEATS_API_URL}/seats/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Seat booking failed');
  const data = await res.json();
  return { success: data.success, bookingId: data.bookingId ?? 'BK-' + Date.now() };
}

export async function fetchZoneTypes(eventId: string): Promise<ZoneType[]> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockZoneTypes[eventId] ?? mockZoneTypes.default ?? [];
  }
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/zone-types`);
  if (!res.ok) throw new Error('Failed to fetch zone types');
  return res.json();
}

export async function bookTickets(params: {
  eventId: string;
  showId: string;
  tickets: { ticketTypeId: string; quantity: number }[];
}): Promise<{ success: boolean; bookingId: string }> {
  if (USE_MOCK_DATA) {
    await delay(900);
    return {
      success: true,
      bookingId: 'BK-' + Math.random().toString(36).toUpperCase().substring(2, 10),
    };
  }
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Ticket booking failed');
  return res.json();
}
