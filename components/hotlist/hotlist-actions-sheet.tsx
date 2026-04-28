import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { X, Pencil, Trash2 } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { BottomSheet } from '@/components/ui/bottom-sheet';

interface HotlistActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HotlistActionsSheet({ visible, onClose, onEdit, onDelete }: HotlistActionsSheetProps) {
  if (!visible) return null;

  return (
    <BottomSheet
      isVisible={visible}
      onClose={onClose}
      coverage={0.35}
      className="bg-secondary"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-xl pt-lg pb-md">
        <Text className="text-foreground text-xl font-primary-bold">More actions</Text>
        <Pressable onPress={onClose} className="p-1">
          <X size={24} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      {/* Actions Container */}
      <View className="mx-lg bg-card rounded-3xl overflow-hidden border border-white/5 mb-8">
        {/* Edit */}
        <Pressable 
          className="flex-row items-center px-lg py-4 gap-md border-b border-white/5 active:bg-white/10"
          onPress={() => {
            onEdit?.();
            onClose();
          }}
        >
          <Pencil size={22} color={THEME.dark.foreground} />
          <Text className="text-foreground text-base">Edit list name</Text>
        </Pressable>

        {/* Delete */}
        <Pressable 
          className="flex-row items-center px-lg py-4 gap-md active:bg-white/10"
          onPress={() => {
            onDelete?.();
            onClose();
          }}
        >
          <Trash2 size={22} color={THEME.dark.destructive} />
          <Text className="text-brand-red text-base">Delete list</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
