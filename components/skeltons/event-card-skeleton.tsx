import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

function ShimmerOverlay() {
  const translateX = useSharedValue(-SCREEN_WIDTH);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH, {
        duration: 1400,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, animatedStyle]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

function SkeletonShape({ className }: { className?: string }) {
  return (
    <View
      className={`bg-secondary ${className ?? ''}`}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <View className="flex-1 overflow-hidden rounded-3xl bg-secondary">
      {/* Status badge */}
      <View className="absolute right-4 top-4">
        <SkeletonShape className="h-7 w-24 rounded-full" />
      </View>

      {/* Bottom placeholders */}
      <View className="absolute bottom-0 left-0 right-0 gap-3 p-6">
        <SkeletonShape className="h-8 w-3/4 self-center rounded-xl" />
        <SkeletonShape className="h-8 w-1/2 self-center rounded-xl" />

        <View className="flex-row justify-center gap-2">
          <SkeletonShape className="h-7 w-20 rounded-full" />
          <SkeletonShape className="h-7 w-24 rounded-full" />
        </View>

        <SkeletonShape className="h-4 w-full rounded-md" />
        <SkeletonShape className="h-4 w-4/5 self-center rounded-md" />

        <SkeletonShape className="mt-2 h-10 w-36 self-center rounded-full" />
      </View>

      <ShimmerOverlay />
    </View>
  );
}
