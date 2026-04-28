import { Modal, Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import type { DetailSheetModalProps } from '@/interfaces/event-detail.interface';

export function DetailSheetModal({
  isVisible,
  onClose,
  title,
  children,
  coverage = 0.5,
}: DetailSheetModalProps) {
  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      coverage={coverage}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-foreground text-[22px] font-primary-bold flex-1 mr-4" numberOfLines={2}>
          {title}
        </Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          className="p-2 rounded-full"
          style={{ backgroundColor: THEME.dark.secondary }}>
          <X size={18} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      {children}
    </BottomSheet>
  );
}
