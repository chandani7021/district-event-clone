import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight, MessageSquare, FileText } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import {
  BOOKING_CHAT_SUPPORT,
  BOOKING_TERMS_CONDITIONS,
  BOOKING_TERMS_TITLE,
  BOOKING_TERMS_ITEMS,
} from '@/constants/booking.constants';

export function BookingHelpSection() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <View className="mx-4 rounded-xl overflow-hidden bg-card">

        <TouchableOpacity className="px-4 py-4 flex-row items-center gap-3" onPress={() => setShowTerms(true)}>
          <FileText size={20} color={THEME.dark.mutedForeground} />
          <Text className="text-foreground text-base flex-1">{BOOKING_TERMS_CONDITIONS}</Text>
          <ChevronRight size={18} color={THEME.dark.mutedForeground} />
        </TouchableOpacity>
      </View>

      <DetailSheetModal
        isVisible={showTerms}
        onClose={() => setShowTerms(false)}
        title={BOOKING_TERMS_TITLE}
        coverage={0.65}
      >
        <View className="gap-4">
          {BOOKING_TERMS_ITEMS.map((term) => (
            <View key={term} className="flex-row gap-3">
              <View className="w-5 h-5 rounded-full items-center justify-center mt-0.5 shrink-0 bg-secondary">
                <Text className="text-xs font-primary-bold text-muted-foreground">
                  {BOOKING_TERMS_ITEMS.indexOf(term) + 1}
                </Text>
              </View>
              <Text className="text-sm leading-6 flex-1 text-muted-foreground">
                {term}
              </Text>
            </View>
          ))}
        </View>
      </DetailSheetModal>
    </>
  );
}
