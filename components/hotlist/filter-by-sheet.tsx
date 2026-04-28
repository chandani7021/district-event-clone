import { Pressable, View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

import { X } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useState, useEffect } from 'react';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { HotlistSortOption, HOTLIST_SORT_OPTIONS } from '@/constants/hotlist.constants';

interface FilterBySheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (sort: HotlistSortOption) => void;
}

export function FilterBySheet({ visible, onClose, onApply }: FilterBySheetProps) {
  const [selectedSort, setSelectedSort] = useState<HotlistSortOption>('date-new');

  useEffect(() => {
    if (visible) {
      setSelectedSort('date-new');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <BottomSheet
      isVisible={visible}
      onClose={onClose}
      coverage={0.55}
      className="bg-secondary"
      footer={
        <View className="flex-row items-center justify-between px-lg pt-md pb-xxxl border-t border-white/5 bg-secondary">
          <Pressable onPress={() => {
            setSelectedSort('date-new');
            onApply?.('date-new');
          }}>
            <Text className="text-muted-foreground text-base font-primary-semibold">Clear all</Text>
          </Pressable>
          <Pressable
            className="bg-white rounded-full px-xl py-md min-w-sidebar items-center"
            onPress={() => {
              onApply?.(selectedSort);
              onClose();
            }}
          >
            <Text className="text-black text-base font-primary-bold">Apply</Text>
          </Pressable>
        </View>
      }
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-xl py-lg border-b border-white/5">
        <Text className="text-foreground text-lg font-primary-bold">Sort by</Text>
        <Pressable onPress={onClose} className="p-1">
          <X size={20} color={THEME.dark.foreground} />
        </Pressable>
      </View>

      {/* Body */}
      <View className="flex-1">
        {/* Options */}
        <ScrollView className="flex-1 bg-secondary pt-md px-xl">
          {HOTLIST_SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              className="flex-row items-center py-md gap-md"
              onPress={() => setSelectedSort(option.id)}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 1.5,
                  borderColor: selectedSort === option.id ? THEME.dark.primary : THEME.dark.mutedForeground,
                  padding: 4
                }}
              >
                {selectedSort === option.id && (
                  <View style={{ flex: 1, borderRadius: 10, backgroundColor: THEME.dark.primary }} />
                )}
              </View>
              <Text
                className={`text-base ${selectedSort === option.id ? 'text-foreground font-primary-medium' : 'text-muted-foreground'}`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
