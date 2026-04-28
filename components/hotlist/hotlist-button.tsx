import { Pressable, type ViewStyle, type GestureResponderEvent } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { THEME } from '@/lib/theme';

interface HotlistButtonProps {
  isWishlisted: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  containerStyle?: string;
  style?: ViewStyle;
}

export function HotlistButton({ isWishlisted, onPress, size = 16, containerStyle, style }: HotlistButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      className={`rounded-md bg-secondary items-center justify-center border border-foreground/10 ${containerStyle}`}
      style={[
        { width: 32, height: 32 },
        style
      ]}
    >
      <Bookmark
        size={size}
        color={isWishlisted ? THEME.dark.primary : 'white'}
        fill={isWishlisted ? THEME.dark.primary : 'transparent'}
      />
    </Pressable>
  );
}
