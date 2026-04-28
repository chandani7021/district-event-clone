import { View, Pressable, Animated } from 'react-native';
import { Text } from '@/components/ui/text';

import { Bookmark } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { THEME } from '@/lib/theme';
import { useEffect, useRef, useState } from 'react';
import { getToastState, subscribeToToast, hideToast } from '@/store/toast-store';

export function GlobalToast() {
  const [state, setState] = useState(getToastState());
  const [shouldRender, setShouldRender] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    return subscribeToToast(() => {
      const newState = getToastState();
      setState(newState);
      
      if (newState.visible) {
        setShouldRender(true);
        Animated.parallel([
          Animated.timing(opacity, { 
            toValue: 1, 
            duration: 300, 
            useNativeDriver: true 
          }),
          Animated.timing(translateY, { 
            toValue: 0, 
            duration: 300, 
            useNativeDriver: true 
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(opacity, { 
            toValue: 0, 
            duration: 300, 
            useNativeDriver: true 
          }),
          Animated.timing(translateY, { 
            toValue: 20, 
            duration: 300, 
            useNativeDriver: true 
          }),
        ]).start(() => setShouldRender(false));
      }
    });
  }, [opacity, translateY]);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={{ 
        position: 'absolute',
        bottom: 40,
        left: 24,
        right: 24,
        zIndex: 9999,
        opacity, 
        transform: [{ translateY }] 
      }}
    >
      <BlurView intensity={80} tint="dark" className="rounded-2xl overflow-hidden border border-white/10">
        <View className="flex-row items-center justify-between px-4 py-4 bg-black/60">
          <View className="flex-row items-center gap-3">
            <Bookmark size={20} color="#F97316" fill="#F97316" />
            <Text className="text-foreground text-base font-primary-semibold">{state.message}</Text>
          </View>
          {state.actionLabel && (
            <Pressable onPress={() => {
              state.onAction?.();
              hideToast();
            }}>
              <Text 
                className="text-foreground text-base font-primary-bold"
                style={{ textDecorationLine: 'underline' }}
              >
                {state.actionLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
}
