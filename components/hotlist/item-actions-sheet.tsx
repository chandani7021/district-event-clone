import { Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { Plus, Trash2, Share } from 'lucide-react-native';
import { THEME } from '@/lib/theme';

interface ItemActionsSheetProps {
  visible: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onRemove?: () => void;
  onAddToList?: () => void;
  onShare?: () => void;
}

export function ItemActionsSheet({ visible, position, onClose, onRemove, onAddToList, onShare }: ItemActionsSheetProps) {
  if (!position) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Transparent backdrop */}
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <View 
          className="bg-popover rounded-2xl w-menu overflow-hidden shadow-2xl border border-white/10 absolute"
          style={{ 
            top: position.y + 4,
            right: 20,
          }}
        >
          {/* Add to another list */}
          <Pressable 
            className="flex-row items-center px-md py-md gap-sm border-b border-white/5 active:bg-white/10"
            onPress={() => {
              onAddToList?.();
              onClose();
            }}
          >
            <Plus size={18} color={THEME.dark.foreground} />
            <Text className="text-foreground text-sm font-primary-medium">Add to another list</Text>
          </Pressable>

          {/* Share */}
          <Pressable 
            className="flex-row items-center px-md py-md gap-sm border-b border-white/5 active:bg-white/10"
            onPress={() => {
              onShare?.();
              onClose();
            }}
          >
            <Share size={18} color={THEME.dark.foreground} />
            <Text className="text-foreground text-sm font-primary-medium">Share event</Text>
          </Pressable>

          {/* Remove from list */}
          <Pressable 
            className="px-md py-md active:bg-white/10"
            onPress={() => {
              onRemove?.();
              onClose();
            }}
          >
            <View className="flex-row items-center gap-sm">
              <Trash2 size={18} color={THEME.dark.destructive} />
              <Text className="text-brand-red text-sm font-primary-medium">Remove from list</Text>
            </View>
            <Text className="text-muted-foreground text-[10px] mt-[2px] ml-7">
              Comments and reactions will be removed
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
