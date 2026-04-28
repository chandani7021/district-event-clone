import { Pressable, View } from 'react-native';
import { ChevronRight, FileText, HelpCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { EventMoreSectionProps } from '@/interfaces/event-detail.interface';
import { ED_FAQ, ED_MORE, ED_TERMS } from '@/constants/event-detail.constants';

export function EventMoreSection({ onFaqPress, onTermsPress }: EventMoreSectionProps) {
  return (
    <View className="px-5 mb-6">
      <Text className="text-foreground text-lg font-primary-bold mb-3">{ED_MORE}</Text>

      <View className="rounded-xl overflow-hidden" style={{ backgroundColor: THEME.dark.secondary }}>
        {/* FAQ row */}
        <Pressable
          onPress={onFaqPress}
          className="flex-row items-center gap-3 px-4 py-4">
          <HelpCircle size={20} color={THEME.dark.foreground} />
          <Text className="text-foreground text-sm flex-1">{ED_FAQ}</Text>
          <ChevronRight size={18} color={THEME.dark.mutedForeground} />
        </Pressable>

        {/* Divider */}
        <View className="mx-4 h-px" style={{ backgroundColor: THEME.dark.border }} />

        {/* Terms row */}
        <Pressable
          onPress={onTermsPress}
          className="flex-row items-center gap-3 px-4 py-4">
          <FileText size={20} color={THEME.dark.foreground} />
          <Text className="text-foreground text-sm flex-1">{ED_TERMS}</Text>
          <ChevronRight size={18} color={THEME.dark.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}
