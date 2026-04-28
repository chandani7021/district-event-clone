import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { AboutSheetProps } from '@/interfaces/event-detail.interface';

export function AboutSheet({ isVisible, onClose, title, about }: AboutSheetProps) {
  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={title}>
      <View>
        <Text className="text-sm leading-6" style={{ color: THEME.dark.mutedForeground }}>
          {about}
        </Text>
      </View>
    </DetailSheetModal>
  );
}
