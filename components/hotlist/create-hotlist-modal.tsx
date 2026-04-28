import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { X } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import {
  HOTLIST_CREATE_MODAL_TITLE,
  HOTLIST_INPUT_PLACEHOLDER,
  HOTLIST_CREATE_CONFIRM,
} from '@/constants/hotlist.constants';
import { BottomSheet } from '../ui/bottom-sheet';

interface CreateHotlistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateHotlistModal({ visible, onClose, onCreate }: CreateHotlistModalProps) {
  const [name, setName] = useState('');

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
    onClose();
  }

  function handleClose() {
    setName('');
    onClose();
  }

  return (
    <BottomSheet
      isVisible={visible}
      onClose={handleClose}
      coverage={0.4}
      className="bg-secondary"
    >
      <View className="gap-6">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-xl font-primary-bold">
            {HOTLIST_CREATE_MODAL_TITLE}
          </Text>
          <Pressable onPress={handleClose} className="p-1">
            <X size={22} color={THEME.dark.foreground} />
          </Pressable>
        </View>

        {/* Input */}
        <TextInput
          className="bg-muted rounded-xl px-md py-[14px] text-foreground text-base"
          placeholder={HOTLIST_INPUT_PLACEHOLDER}
          placeholderTextColor={THEME.dark.mutedForeground}
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        {/* Create Button */}
        <Pressable
          className={`rounded-full py-[14px] items-center ${name.trim() ? 'bg-foreground' : 'bg-muted'}`}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text className={`text-base font-primary-semibold ${name.trim() ? 'text-background' : 'text-muted-foreground'}`}>
            {HOTLIST_CREATE_CONFIRM}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
