import { View, TouchableOpacity, Modal, Pressable, Text as RNText } from 'react-native';
import { ArrowLeftRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import {
  BOOKING_REPLACE_TITLE,
  BOOKING_REPLACE_SUBTITLE,
  BOOKING_REPLACE_PROCEED_BTN,
  BOOKING_REPLACE_CANCEL_BTN,
} from '@/constants/booking.constants';

interface ReplaceTicketsSheetProps {
  newEventTitle: string;
  existingEventTitle: string;
  onProceed: () => void;
  onCancel: () => void;
}

export function ReplaceTicketsSheet({
  newEventTitle,
  existingEventTitle,
  onProceed,
  onCancel,
}: ReplaceTicketsSheetProps) {
  const subtitle = BOOKING_REPLACE_SUBTITLE(newEventTitle, existingEventTitle);

  // Render subtitle with bold event names
  const parts = subtitle.split(/(".*?")/g);

  return (
    <BottomSheet
      isVisible={true}
      onClose={onCancel}
      coverage={0.58}
      footer={
        <View className="gap-3">
          <TouchableOpacity
            onPress={onProceed}
            className="bg-foreground rounded-2xl py-4 items-center"
          >
            <Text className="text-background text-base font-primary-bold">
              {BOOKING_REPLACE_PROCEED_BTN}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="py-3 items-center">
            <View style={{ borderBottomWidth: 1, borderBottomColor: THEME.dark.mutedForeground, paddingBottom: 2 }}>
              <Text
                className="text-base font-primary-bold"
                style={{ color: THEME.dark.mutedForeground }}>
                {BOOKING_REPLACE_CANCEL_BTN}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      }
    >
      <View className="items-center gap-4 pt-2">
        <View className="w-16 h-16 rounded-2xl items-center justify-center bg-secondary">
          <ArrowLeftRight size={32} color={THEME.dark.mutedForeground} />
        </View>
        <Text className="text-foreground text-xl font-primary-bold text-center">
          {BOOKING_REPLACE_TITLE}
        </Text>
        <RNText className="text-sm text-center leading-5" style={{ color: THEME.dark.mutedForeground }}>
          {parts.map((part, i) =>
            part.startsWith('"') && part.endsWith('"') ? (
              <RNText key={i} style={{ color: THEME.dark.foreground, fontWeight: '700' }}>
                {part}
              </RNText>
            ) : (
              part
            )
          )}
        </RNText>
      </View>
    </BottomSheet>
  );
}
