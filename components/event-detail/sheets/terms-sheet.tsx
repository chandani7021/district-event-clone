import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { TermsSheetProps } from '@/interfaces/event-detail.interface';
import { ED_TERMS_TITLE } from '@/constants/event-detail.constants';

export function TermsSheet({ isVisible, onClose, items }: TermsSheetProps) {
  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_TERMS_TITLE}>
      <View className="gap-4">
        {items.map((term, index) => (
          <View key={index} className="flex-row gap-3">
            <View
              className="w-5 h-5 rounded-full items-center justify-center mt-0.5 shrink-0"
              style={{ backgroundColor: THEME.dark.secondary }}>
              <Text className="text-xs font-primary-bold" style={{ color: THEME.dark.mutedForeground }}>
                {index + 1}
              </Text>
            </View>
            <Text
              className="text-sm leading-6 flex-1"
              style={{ color: THEME.dark.mutedForeground }}>
              {term}
            </Text>
          </View>
        ))}
      </View>
    </DetailSheetModal>
  );
}
