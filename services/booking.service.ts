import * as SecureStore from 'expo-secure-store';
import type {
  BookedTicket,
  BookingSession,
  InvoiceDetails,
  PaymentMethodOption,
  SelectedTicket,
  TicketType,
} from '@/interfaces/booking.interface';
import type { BankOption } from '@/interfaces/payment.interface';
import { DUMMY_EVENTS } from '@/lib/dummy-events';

// ── Persistent invoice details (survives app restarts) ─────────────
const INVOICE_DETAILS_KEY = 'district-clone_invoice_details';

export const invoiceDetailsStorage = {
  async get(): Promise<InvoiceDetails | null> {
    try {
      const data = await SecureStore.getItemAsync(INVOICE_DETAILS_KEY);
      if (!data) return null;
      return JSON.parse(data) as InvoiceDetails;
    } catch {
      return null;
    }
  },
  async save(details: InvoiceDetails): Promise<void> {
    try {
      await SecureStore.setItemAsync(INVOICE_DETAILS_KEY, JSON.stringify(details));
    } catch { /* ignore */ }
  },
  async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(INVOICE_DETAILS_KEY);
    } catch { /* ignore */ }
  },
};

// ── In-memory booking session (shared across screens during checkout) ──
// BookingSession type lives in @/interfaces/booking.interface

let _session: BookingSession = {};

export const bookingSession = {
  set(data: Partial<BookingSession>) {
    _session = { ..._session, ...data };
  },
  get(): BookingSession {
    return _session;
  },
  clear() {
    _session = {};
  },
};

// ── In-memory bookings history ─────────────────────────────────────
let _bookings: BookedTicket[] = [];

// ── Mock payment methods ───────────────────────────────────────────
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'gpay', name: 'Google Pay UPI', group: 'recommended' },
  { id: 'amazonpay', name: 'Amazon Pay UPI', group: 'recommended' },
  { id: 'whatsapp', name: 'WhatsApp UPI', group: 'recommended' },
  { id: 'card', name: 'Add credit or debit cards', group: 'cards' },
  { id: 'amazon_wallet', name: 'Amazon Pay Balance', group: 'wallets', subtext: 'Link your Amazon Pay Balance…' },
  { id: 'district_money', name: 'District Money', group: 'wallets', unavailable: true },
  { id: 'mobikwik', name: 'MobiKwik', group: 'wallets', subtext: 'Currently disabled due to a technical problem.' },
  { id: 'lazypay', name: 'LazyPay', group: 'pay_later', subtext: 'Link your LazyPay account' },
  { id: 'netbanking', name: 'Netbanking', group: 'netbanking' },
];

// ── Mock bank data ─────────────────────────────────────────────────
export const POPULAR_BANKS: BankOption[] = [
  { id: 'hdfc', name: 'HDFC', iconLabel: 'H', iconColor: '#003366' },
  { id: 'kotak', name: 'Kotak', iconLabel: 'K', iconColor: '#ED1C24' },
  { id: 'icici', name: 'ICICI', iconLabel: 'I', iconColor: '#F07B27' },
  { id: 'sbi', name: 'SBI', iconLabel: 'S', iconColor: '#22409A' },
  { id: 'axis', name: 'Axis', iconLabel: 'A', iconColor: '#800000' },
];

export const ALL_BANKS: BankOption[] = [
  { id: 'pnb', name: 'Punjab National Bank', iconLabel: 'P', iconColor: '#C8102E' },
  { id: 'indusind', name: 'IndusInd Bank', iconLabel: 'I', iconColor: '#1A1A8C' },
  { id: 'jk_bank', name: 'Jammu and Kashmir Bank', iconLabel: 'J', iconColor: '#006747' },
  { id: 'janata_sahakari', name: 'Janata Sahakari Bank Pune', iconLabel: 'J', iconColor: '#6B4226' },
  { id: 'karnataka', name: 'Karnataka Bank', iconLabel: 'K', iconColor: '#6A0DAD' },
  { id: 'kvb', name: 'Karur Vysya', iconLabel: 'K', iconColor: '#F5C400' },
  { id: 'lakshmi_vilas', name: 'Lakshmi Vilas Bank', iconLabel: 'L', iconColor: '#E8000D' },
  { id: 'nkgsb', name: 'NKGSB Co-operative Bank', iconLabel: 'N', iconColor: '#C0392B' },
  { id: 'pnb_corp', name: 'Punjab National Bank - Corporate Banking', iconLabel: 'P', iconColor: '#C8102E' },
  { id: 'rbl', name: 'RBL Bank', iconLabel: 'R', iconColor: '#C0392B' },
  { id: 'saraswat', name: 'Saraswat Bank', iconLabel: 'S', iconColor: '#E8650A' },
  { id: 'south_indian', name: 'South Indian Bank', iconLabel: 'S', iconColor: '#C0392B' },
  { id: 'standard_chartered', name: 'Standard Chartered Bank', iconLabel: 'S', iconColor: '#009A44' },
  { id: 'sbi_corp', name: 'State Bank of India (Corporate)', iconLabel: 'S', iconColor: '#22409A' },
  { id: 'tmb', name: 'Tamilnad Merchantile Bank', iconLabel: 'T', iconColor: '#003087' },
  { id: 'uco', name: 'UCO Bank', iconLabel: 'U', iconColor: '#003087' },
  { id: 'ujjivan', name: 'Ujjivan Small Finance Bank', iconLabel: 'U', iconColor: '#00875A' },
  { id: 'union', name: 'Union Bank of India', iconLabel: 'U', iconColor: '#003087' },
  { id: 'united', name: 'United Bank Of India', iconLabel: 'U', iconColor: '#007C42' },
  { id: 'yes_bank', name: 'Yes Bank', iconLabel: 'Y', iconColor: '#003087' },
];

// ── Service functions ──────────────────────────────────────────────
export async function getTicketTypes(eventId: string): Promise<TicketType[]> {
  await new Promise((r) => setTimeout(r, 300));
  const event = DUMMY_EVENTS.find((e) => e.id === eventId) ?? DUMMY_EVENTS[0];
  const currency = event.currency === 'INR' ? '₹' : event.currency;
  return [
    {
      id: 'tt_general',
      name: 'General',
      price: event.price_min,
      currency,
      description: 'General standing/seating area',
      maxPerOrder: 10,
    },
    {
      id: 'tt_premium',
      name: 'Premium',
      price: Math.round(event.price_min * 1.8),
      currency,
      description: 'Premium viewing area',
      maxPerOrder: 4,
    },
  ];
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createBooking(
  eventId: string,
  tickets: SelectedTicket[],
  invoiceDetails: InvoiceDetails,
  paymentMethod?: PaymentMethodOption,
): Promise<BookedTicket> {
  await new Promise((r) => setTimeout(r, 600));
  const event = DUMMY_EVENTS.find((e) => e.id === eventId) ?? DUMMY_EVENTS[0];
  const orderAmount = tickets.reduce((sum, t) => sum + t.price, 0);

  const booking: BookedTicket = {
    bookingId: generateCode() + generateCode(),
    confirmationCode: generateCode(),
    eventId,
    eventTitle: event.title,
    eventDate: event.date,
    eventEndDate: event.end_date,
    eventTime: event.time,
    venueName: event.venue_name,
    venueAddress: event.venue_address ?? '',
    venueCity: event.city_name ?? '',
    coverImage: event.coverImage,
    tickets,
    orderAmount,
    totalAmount: orderAmount,
    invoiceDetails,
    paymentMethodName: paymentMethod?.name,
    status: 'confirmed',
    bookedAt: new Date().toISOString(),
  };

  _bookings = [booking, ..._bookings];
  return booking;
}

export async function getBookingHistory(): Promise<BookedTicket[]> {
  await new Promise((r) => setTimeout(r, 300));
  return _bookings;
}

export async function getBookingById(bookingId: string): Promise<BookedTicket | null> {
  await new Promise((r) => setTimeout(r, 200));
  return _bookings.find((b) => b.bookingId === bookingId) ?? null;
}
