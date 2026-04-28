import type { CardDetails } from './payment.interface';

export interface BookingSession {
  /** Which event is currently being booked */
  eventId?: string;
  /** Display title of the event being booked — used in the replace-tickets sheet */
  eventTitle?: string;
  /** ID of the show the user selected */
  selectedShowId?: string;
  /** Date the user selected (YYYY-MM-DD) */
  selectedDate?: string;
  /** All dates (YYYY-MM-DD) for which seats/tickets were selected — used on the review screen */
  selectedShowDates?: string[];
  invoiceDetails?: InvoiceDetails;
  selectedTickets?: SelectedTicket[];
  selectedPaymentMethod?: PaymentMethodOption;
  savedCard?: CardDetails;
  timerEndTime?: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  maxPerOrder: number;
}

export interface SelectedTicket {
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
}

export interface InvoiceDetails {
  name: string;
  phone: string;
  email: string;
  state: string;
}

export type PaymentMethodGroup = 'recommended' | 'cards' | 'wallets' | 'pay_later' | 'netbanking';

export interface PaymentMethodOption {
  id: string;
  name: string;
  group: PaymentMethodGroup;
  subtext?: string;
  unavailable?: boolean;
}

export interface BookedTicket {
  bookingId: string;
  confirmationCode: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventEndDate?: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  coverImage: string;
  tickets: SelectedTicket[];
  orderAmount: number;
  totalAmount: number;
  invoiceDetails: InvoiceDetails;
  paymentMethodName?: string;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}
