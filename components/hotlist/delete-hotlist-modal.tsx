import { Modal, Pressable, View, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';

interface DeleteHotlistModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotlistName: string;
}

export function DeleteHotlistModal({ visible, onClose, onConfirm, hotlistName }: DeleteHotlistModalProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Dim backdrop */}
        <Pressable className="absolute inset-0 bg-black/60" onPress={onClose} />
        
        <BottomSheet
          coverage={0.48}
          className="bg-secondary"
          onClose={onClose}
          footer={
            <View className="gap-3 px-6 pb-6">
              <TouchableOpacity
                onPress={onConfirm}
                className="bg-foreground rounded-2xl py-4 items-center"
              >
                <Text className="text-background text-base font-primary-bold">
                  Delete List
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} className="py-2 items-center">
                <Text
                  className="text-base font-primary-bold underline"
                  style={{ color: THEME.dark.mutedForeground, textDecorationLine: 'underline' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          }
        >
          <View className="items-center gap-6 pt-4">
            {/* Trash Icon Container */}
            <View className="w-16 h-16 rounded-2xl items-center justify-center bg-white/5">
              <Trash2 size={32} color={THEME.dark.destructive} />
            </View>

            {/* Text Content */}
            <View className="items-center gap-2 px-8">
              <Text className="text-foreground text-xl font-primary-bold text-center">
                Delete this hotlist?
              </Text>
              <Text className="text-muted-foreground text-sm text-center leading-5">
                '{hotlistName}' will be deleted for you and anyone you may have shared it with
              </Text>
            </View>
          </View>
        </BottomSheet>
      </View>
    </Modal>
  );
}
