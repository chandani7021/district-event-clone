import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight, Receipt, User } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { InvoiceDetails, SelectedTicket } from '@/interfaces/booking.interface';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import {
  BOOKING_TOTAL_BILL,
  BOOKING_INCL_TAXES,
  BOOKING_INVOICE_SENT_TO,
  BOOKING_CURRENCY_SYMBOL,
  BOOKING_ORDER_ID_LABEL,
  BOOKING_BILL_SUMMARY,
  BOOKING_TOTAL_PAID,
} from '@/constants/booking.constants';

interface BookingOrderDetailsProps {
  totalAmount: number;
  invoiceDetails: InvoiceDetails;
  bookingId?: string;
  tickets?: SelectedTicket[];
}

export function BookingOrderDetails({ totalAmount, invoiceDetails, bookingId, tickets = [] }: BookingOrderDetailsProps) {
  const [showBill, setShowBill] = useState(false);

  return (
    <>
      <View className="mx-4 rounded-xl overflow-hidden bg-card">
        <TouchableOpacity
          className="px-4 py-4 border-b border-border flex-row items-center gap-3"
          onPress={() => setShowBill(true)}
        >
          <Receipt size={20} color={THEME.dark.mutedForeground} />
          <View className="flex-1">
            <Text className="text-foreground text-base font-primary-semibold">
              {BOOKING_TOTAL_BILL} {BOOKING_CURRENCY_SYMBOL}{totalAmount.toLocaleString('en-IN')}
            </Text>
            <Text className="text-xs mt-0.5 text-muted-foreground">
              {BOOKING_INCL_TAXES}
            </Text>
          </View>
          <ChevronRight size={18} color={THEME.dark.mutedForeground} />
        </TouchableOpacity>

        <View className="px-4 py-4 flex-row items-start gap-3">
          <User size={20} color={THEME.dark.mutedForeground} />
          <View className="flex-1">
            <Text className="text-foreground text-base">
              {BOOKING_INVOICE_SENT_TO}{' '}
              <Text className="font-primary-bold">{invoiceDetails.name}</Text>
            </Text>
            <Text className="text-sm mt-0.5 text-muted-foreground">
              {invoiceDetails.phone.replace('+91', '')}
            </Text>
            <Text className="text-sm mt-0.5 text-muted-foreground">
              {invoiceDetails.email}
            </Text>
            <Text className="text-sm mt-0.5 text-muted-foreground">
              {invoiceDetails.state}
            </Text>
          </View>
        </View>
      </View>

      <DetailSheetModal
        isVisible={showBill}
        onClose={() => setShowBill(false)}
        title={BOOKING_TOTAL_BILL}
        coverage={0.55}
      >
        {bookingId && (
          <View className="flex-row justify-between mb-4">
            <Text className="text-muted-foreground">{BOOKING_ORDER_ID_LABEL}</Text>
            <Text className="text-foreground font-primary-semibold">{bookingId}</Text>
          </View>
        )}
        <View className="h-px mb-4 bg-border" />
        <Text className="text-foreground font-primary-bold text-base mb-3">{BOOKING_BILL_SUMMARY}</Text>
        {tickets.map((t) => (
          <View key={t.ticketTypeId} className="flex-row justify-between mb-2">
            <Text className="text-muted-foreground">
              {t.quantity} x {t.ticketTypeName}
            </Text>
            <Text className="text-foreground">
              {BOOKING_CURRENCY_SYMBOL}{(t.price * t.quantity).toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
        <View className="h-px my-4 bg-border" />
        <View className="flex-row justify-between">
          <Text className="text-foreground font-primary-bold text-base">{BOOKING_TOTAL_PAID}</Text>
          <Text className="text-foreground font-primary-bold text-base">
            {BOOKING_CURRENCY_SYMBOL}{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </DetailSheetModal>
    </>
  );
}
