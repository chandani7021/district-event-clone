import { Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';


interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: (scope: 'device' | 'all') => void;
}

export function LogoutModal({ visible, onClose, onLogout }: LogoutModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-overlay items-center justify-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-secondary rounded-xl w-[80%] overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-foreground text-base font-primary-semibold text-center py-md px-lg">
            Log out from
          </Text>
          <View className="h-[0.5px] bg-border mx-lg" />
          <Pressable className="py-md px-lg items-center" onPress={() => onLogout('device')}>
            <Text className="text-destructive text-base">This device</Text>
          </Pressable>
          <View className="h-[0.5px] bg-border mx-lg" />
          <Pressable className="py-md px-lg items-center" onPress={() => onLogout('all')}>
            <Text className="text-destructive text-base">All devices</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
