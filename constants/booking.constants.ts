// Timer banner
export const BOOKING_COMPLETE_IN_PREFIX = 'Complete your booking in';
export const BOOKING_COMPLETE_IN_SUFFIX = 'mins';
export const TIMER_INITIAL_SECONDS = 610; // 10:02. 610
export const TIMER_WARNING_SECONDS = 180; // 5:00 — show orange below this
export const TIMER_WARNING_COLOR = '#F97316'; // orange

// Retry / Payment failed screen
export const BOOKING_PAYMENT_FAILED_TITLE = 'Payment failed';
export const BOOKING_PAYMENT_FAILED_SUBTITLE =
  "We couldn't process your payment. Please check your payment details and try again. If the issue persists, try a different payment method.";
export const BOOKING_RETRY_BTN = 'Retry booking';

// Buy Again (time's up) bottom sheet
export const BOOKING_TIMES_UP_TITLE = "Oops, time's up!";
export const BOOKING_TIMES_UP_SUBTITLE =
  "We've released the tickets you selected. You can always jump back in and get your tickets!";
export const BOOKING_BUY_AGAIN_BTN = 'Buy again';

// Invoice form screen
export const BOOKING_INVOICE_SECTION = 'INVOICE DETAILS';
export const BOOKING_ENTER_NAME = 'Enter name *';
export const BOOKING_EMAIL_ADDRESS = 'Email address *';
export const BOOKING_SELECT_STATE = 'Select state';
export const BOOKING_PHONE_NOTE = 'The phone number associated with your account cannot be modified';
export const BOOKING_EMAIL_NOTE = 'Email ID is required to send tickets and updates';
export const BOOKING_STATE_NOTE = 'State is required to generate your invoice';
export const BOOKING_CONFIRM_BTN = 'Confirm';

// Replace existing tickets sheet
export const BOOKING_REPLACE_TITLE = 'Replace existing tickets?';
export const BOOKING_REPLACE_SUBTITLE = (newEvent: string, existingEvent: string) =>
  `Would you like to continue with your selection for\n"${newEvent}"\ninstead of your previous one from\n"${existingEvent}"?`;
export const BOOKING_REPLACE_PROCEED_BTN = 'Proceed';
export const BOOKING_REPLACE_CANCEL_BTN = 'Cancel';

// Remove ticket confirmation sheet
export const BOOKING_REMOVE_CONFIRM_TITLE = 'Remove cart items?';
export const BOOKING_REMOVE_CONFIRM_SUBTITLE = (name: string) =>
  `Are you sure you want to remove ${name} from your cart?`;
export const BOOKING_REMOVE_CONFIRM_BTN = 'Confirm';
export const BOOKING_REMOVE_CANCEL_BTN = 'Cancel';

// Review screen
export const BOOKING_REVIEW_TITLE = 'Review your booking';
export const BOOKING_PAYMENT_SUMMARY = 'PAYMENT SUMMARY';
export const BOOKING_ORDER_AMOUNT = 'Order amount';
export const BOOKING_GRAND_TOTAL = 'Grand Total';
export const BOOKING_DONATE_SECTION = 'DONATE TO FEEDING INDIA';
export const BOOKING_REMOVE = 'Remove';
export const BOOKING_M_TICKET_NOTICE = 'M-Ticket: Entry using the QR code in your app';
export const BOOKING_PAY_NOW_BTN = 'Pay Now';
export const BOOKING_PAY_USING = 'Pay Using';
export const BOOKING_TOTAL_LABEL = 'Total';
export const BOOKING_INVOICE_INFO_NOTE = 'Information mentioned above will be used for generating the invoice and sending out the tickets.';
export const BOOKING_EDIT_BTN = 'Edit';
export const BOOKING_CURRENCY_SYMBOL = '₹';
export const BOOKING_FREE_LABEL = '₹0';

// Payment methods screen
export const BOOKING_PAYMENT_TITLE = 'Select Payment Method';
export const BOOKING_RECOMMENDED_GROUP = 'Recommended';
export const BOOKING_CARDS_GROUP = 'Cards';
export const BOOKING_WALLETS_GROUP = 'Wallets';
export const BOOKING_ADD_CARD = 'Add credit or debit cards';
export const BOOKING_ADD_BTN = 'ADD';
export const BOOKING_UNAVAILABLE_BALANCE = 'Unavailable due to insufficient balance';

// Payment methods screen - extended groups
export const BOOKING_PAY_LATER_GROUP = 'Pay Later';
export const BOOKING_NETBANKING_GROUP = 'Netbanking';

// Add card screen
export const BOOKING_ADD_CARD_TITLE = 'Add a card';
export const BOOKING_ADD_CARD_DESC = 'Your card information is encrypted and secure';
export const BOOKING_CARD_NAME_PLACEHOLDER = 'Name on card';
export const BOOKING_CARD_NUMBER_PLACEHOLDER = 'Card number';
export const BOOKING_CARD_EXPIRY_PLACEHOLDER = 'Expiry Date (MM/YY)';
export const BOOKING_CARD_NICKNAME_PLACEHOLDER = 'Nickname for card';
export const BOOKING_CARD_NICK_PERSONAL = 'Personal';
export const BOOKING_CARD_NICK_BUSINESS = 'Business';
export const BOOKING_CARD_NICK_OTHER = 'Other';
export const BOOKING_MAKE_PAYMENT_BTN = 'Make Payment';
export const BOOKING_CARD_EDIT_BTN = 'Edit';
export const BOOKING_LAZYPAY_MOBILE_PLACEHOLDER = 'Mobile number';
export const BOOKING_LAZYPAY_LINK_BTN = 'Link wallet';

// Select bank screen
export const BOOKING_SELECT_BANK_TITLE = 'Select Bank';
export const BOOKING_SEARCH_BANK_PLACEHOLDER = 'Search By Bank Name';
export const BOOKING_POPULAR_BANKS_LABEL = 'Popular Banks';
export const BOOKING_ALL_BANKS_LABEL = 'All Banks';

// Confirm screen
export const BOOKING_CONFIRMED_TITLE = 'Booking is confirmed!';
export const BOOKING_M_TICKETS_SECTION = 'M - TICKETS';
export const BOOKING_TICKET_LABEL = 'Ticket';
export const BOOKING_CONFIRMATION_CODE_LABEL = 'Confirmation code:';
export const BOOKING_VENUE_SECTION = 'VENUE';
export const BOOKING_GET_DIRECTIONS = 'Get directions';
export const BOOKING_ORDER_DETAILS_SECTION = 'ORDER DETAILS';
export const BOOKING_TOTAL_BILL = 'Total bill';
export const BOOKING_INCL_TAXES = 'Incl. taxes & fees';
export const BOOKING_INVOICE_SENT_TO = 'Invoice sent to';
export const BOOKING_NEED_HELP_SECTION = 'NEED HELP WITH BOOKING';
export const BOOKING_CHAT_SUPPORT = 'Chat with support';
export const BOOKING_TERMS_CONDITIONS = 'Terms and conditions';
export const BOOKING_M_TICKET_SHOW = 'M-Ticket: Show the QR at the gate for entry';
export const BOOKING_ONWARDS_LABEL = 'onwards';
export const BOOKING_ORDER_ID_LABEL = 'Order ID:';
export const BOOKING_BILL_SUMMARY = 'Bill Summary';
export const BOOKING_TOTAL_PAID = 'Total Amount Paid';

// Profile bookings list
export const PROFILE_EVENT_TICKETS_TITLE = 'Event tickets';
export const BOOKING_STATUS_BOOKED = 'Booked';
export const BOOKING_VIEW_DETAILS = 'View details';
export const BOOKING_LOCATION_LABEL = 'Location';
export const BOOKING_NO_BOOKINGS_TITLE = 'No bookings yet';
export const BOOKING_NO_BOOKINGS_SUBTITLE = 'Your event bookings will appear here.';

// Terms and conditions
export const BOOKING_TERMS_TITLE = 'Terms & Conditions';
export const BOOKING_TERMS_ITEMS = [
  'All ticket sales are final. No refunds or exchanges unless the event is cancelled.',
  'Tickets are non-transferable and valid only for the named ticket holder.',
  'Entry may be refused if the QR code has already been scanned or cannot be verified.',
  'The organiser reserves the right to change the lineup, schedule, or venue without prior notice.',
  'Attendees must comply with all venue rules and security checks.',
  'The organiser is not responsible for any lost, stolen, or damaged personal belongings.',
  'By purchasing a ticket you agree to these terms and the event organiser\'s policies.',
];

// Indian states
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];
