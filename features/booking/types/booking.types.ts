export type SeatingType = 'seated' | 'non_seated';

export interface Show {
  id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time?: string; // HH:mm
  /** Present only for seated shows — the seats.io event key */
  seatsio_event_key?: string;
  /** 'zone' = zone overview chart, 'chart' (default) = full seatsio seat-map */
  seating_mode?: 'zone' | 'chart' | 'individual';
  /** Maps zone category label (lowercase) → seatsio event key for individual seat picking within that zone */
  zone_seat_charts?: Record<string, string>;
  /** Pricing per zone category — used for price filtering on the zone chart */
  zone_pricing?: readonly { category: string; price: number }[];
  available_tickets?: number;
  is_sold_out?: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  max_per_order: number;
  available: number;
  is_sold_out?: boolean;
}

export interface ZoneType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  available: number;
  max_per_order: number;
  is_sold_out?: boolean;
}

export interface SelectedSeat {
  id: string;
  label: string;
  category: { label: string };
  pricing?: { price: number; formattedPrice: string };
}

export interface SelectedTicket {
  type: TicketType;
  quantity: number;
}

export type BookingStep = 'date' | 'time' | 'seats' | 'tickets' | 'summary';

export interface BookingState {
  step: BookingStep;
  shows: Show[];
  availableDates: string[];
  ticketTypes: TicketType[];
  selectedDate: string | null;
  selectedShow: Show | null;
  /** All shows selected across dates — date (YYYY-MM-DD) → Show */
  selectedShows: Record<string, Show>;
  selectedSeats: SelectedSeat[];
  /** The show ID for which the current selectedSeats were picked — used to detect multi-day cross-show selection */
  selectedSeatsShowId?: string;
  selectedTickets: SelectedTicket[];
  isLoadingShows: boolean;
  isBooking: boolean;
  isSuccess: boolean;
  error: string | null;
  bookingId: string | null;
}

export interface BookingEventData {
  id: string;
  title: string;
  seating_type?: SeatingType;
  price_min: number;
  price_max: number;
  currency: string;
}
