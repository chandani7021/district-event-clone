import { Heart, Sparkles } from 'lucide-react-native';

interface HotlistIconProps {
  iconType: 'heart' | 'sparkle';
  size?: number;
  color?: string;
}

export function HotlistIcon({ iconType, size = 40, color = 'rgba(255,255,255,0.9)' }: HotlistIconProps) {
  if (iconType === 'heart') {
    return <Heart size={size} color={color} fill={color} />;
  }
  return <Sparkles size={size} color={color} fill={color} />;
}
