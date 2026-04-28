import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';
import { THEME } from '@/lib/theme';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: THEME.dark.secondary,
          opacity,
          ...(width === undefined && { alignSelf: 'stretch' }),
        },
        style,
      ]}
    />
  );
}
