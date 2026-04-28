import { useState, useEffect } from 'react';
import { View, Pressable, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { X, CircleX } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { THEME } from '@/lib/theme';

interface RenameHotlistSheetProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
}

export function RenameHotlistSheet({ visible, onClose, currentName }: RenameHotlistSheetProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (visible) {
      setName(currentName);
    }
  }, [visible, currentName]);

  const handleSave = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable className="absolute inset-0 bg-black/60" onPress={onClose} />

        <BottomSheet
          coverage={0.4}
          className="bg-[#111111]"
          onClose={onClose}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-foreground text-xl font-primary-bold">Rename</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-white/10 rounded-full"
            >
              <X size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Input Area */}
          <View className="relative mb-8">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="List name"
              placeholderTextColor="#666"
              className="bg-[#1C1C1E] text-foreground text-lg px-4 py-4 rounded-2xl border border-white/5 pr-12"
              autoFocus
              selectionColor={THEME.dark.primary}
            />
            {name.length > 0 && (
              <TouchableOpacity
                onPress={() => setName('')}
                className="absolute right-4 top-4"
              >
                <CircleX size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Save Button */}
          <Pressable
            className={`rounded-full py-[14px] items-center mb-4 ${name.trim() ? 'bg-foreground' : 'bg-muted'}`}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text className={`text-base font-primary-semibold ${name.trim() ? 'text-background' : 'text-muted-foreground'}`}>
              Save
            </Text>
          </Pressable>
        </BottomSheet>
      </View>
    </Modal>
  );
}
