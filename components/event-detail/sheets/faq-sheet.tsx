import { useState, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { DetailSheetModal } from '@/components/event-detail/detail-sheet-modal';
import type { FaqItemProps, FaqSheetProps } from '@/interfaces/event-detail.interface';
import { ED_FAQ_TITLE } from '@/constants/event-detail.constants';

function FaqAccordionItem({ item, isOpen, onToggle, showDivider }: FaqItemProps) {
  return (
    <Animated.View layout={LinearTransition.duration(250)}>
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between pt-4 pb-2 gap-3">
        <Text className="text-foreground text-sm font-primary-semibold flex-1">{item.question}</Text>
        {isOpen ? (
          <ChevronUp size={18} color={THEME.dark.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={THEME.dark.mutedForeground} />
        )}
      </Pressable>

      {isOpen && (
        <Animated.Text
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="text-sm leading-5 pb-4"
          style={{ color: THEME.dark.mutedForeground }}>
          {item.answer}
        </Animated.Text>
      )}

      {showDivider && (
        <View className="h-px" style={{ backgroundColor: THEME.dark.border }} />
      )}
    </Animated.View>
  );
}

export function FaqSheet({ isVisible, onClose, items }: FaqSheetProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setOpenId(null);
    }
  }, [isVisible]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <DetailSheetModal isVisible={isVisible} onClose={onClose} title={ED_FAQ_TITLE}>
      <View
        className="rounded-xl p-4 mt-2"
        style={{ backgroundColor: THEME.dark.secondary }}>
        {items.map((item, index) => (
          <FaqAccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => toggle(item.id)}
            showDivider={index < items.length - 1}
          />
        ))}
      </View>
    </DetailSheetModal>
  );
}
