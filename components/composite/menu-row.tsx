import type {  LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { ChevronRight } from 'lucide-react-native';
import { THEME } from '@/lib/theme';

interface MenuRowProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export function MenuRow({ icon: Icon, label, onPress, disabled, destructive }: MenuRowProps) {
  return (
    <Pressable
      className="flex-row items-center gap-md px-lg py-[14px]"
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        size={20}
        color={disabled ? THEME.dark.mutedForeground : THEME.dark.input}
      />
      <Text
        className={`flex-1 text-base ${
          destructive
            ? 'text-destructive'
            : disabled
              ? 'text-muted-foreground'
              : 'text-foreground'
        }`}
      >
        {label}
      </Text>
      <ChevronRight size={18} color={THEME.dark.mutedForeground} />
    </Pressable>
  );
}
