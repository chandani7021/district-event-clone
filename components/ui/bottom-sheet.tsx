import { useEffect, useState, type ReactNode } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewStyle,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BottomSheetProps {
  /** Whether the sheet is currently shown */
  isVisible?: boolean;
  /** Fraction of screen height the sheet covers, e.g. 0.55 = 55% */
  coverage?: number;
  children: ReactNode;
  /** Fixed content at the bottom of the sheet */
  footer?: ReactNode;
  /** Extra className applied to the outer sheet container */
  className?: string;
  /** Optional style override — use to absolutely position stacked sheets */
  style?: ViewStyle;
  /** Called when the user swiped it down or clicked the backdrop */
  onClose?: () => void;
  /** Prevent the sheet from being swiped down */
  disableSwipe?: boolean;
  /** Prevent the sheet from closing when the backdrop is pressed */
  disableBackdropPress?: boolean;
  /** Whether to render as an inline view instead of a Modal (allows interaction with underlying views) */
  isInline?: boolean;
}

const SPRING_OPEN = { damping: 22, stiffness: 220, mass: 0.8 };
const SPRING_CLOSE = { damping: 20, stiffness: 160, mass: 0.8 };
const SPRING_SNAP_BACK = { damping: 25, stiffness: 300, mass: 0.7 };

export function BottomSheet({
  isVisible = true,
  coverage = 0.5,
  children,
  footer,
  className = '',
  style,
  onClose,
  disableSwipe = false,
  disableBackdropPress = false,
  isInline = false,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const responsiveCoverage = height < 750 && coverage < 1 ? Math.max(0.55, coverage) : coverage;
  const sheetHeight = Math.max(height * responsiveCoverage, 360);

  const [contentHeight, setContentHeight] = useState(sheetHeight);
  const [footerHeight, setFooterHeight] = useState(0);
  const actualHeight = Math.min(contentHeight + footerHeight, sheetHeight);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showModal, setShowModal] = useState(isVisible);

  // translateY: 0 = fully open, sheetHeight = fully hidden below screen
  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      translateY.value = withSpring(0, SPRING_OPEN);
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withSpring(sheetHeight, SPRING_CLOSE, (finished) => {
        if (finished) runOnJS(setShowModal)(false);
      });
    }
  }, [isVisible, sheetHeight]);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Dismiss logic for dragging
  const dismissThreshold = 60;

  const panGesture = Gesture.Pan()
    .activeOffsetY([0, 8])
    .failOffsetY(-5)
    .enabled(!disableSwipe)
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      const shouldDismiss = e.velocityY > 400 || translateY.value > dismissThreshold;
      if (shouldDismiss) {
        runOnJS(onClose!)();
      } else {
        translateY.value = withSpring(0, SPRING_SNAP_BACK);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate how much space is available between the top of the sheet and the status bar
    const headroom = (height - actualHeight) - (insets.top + 60);
    // Lift the sheet by growing its height, capped by the headroom
    const keyboardShift = Math.min(keyboardHeight, Math.max(0, headroom));

    return {
      transform: [{ translateY: translateY.value }],
      height: actualHeight + keyboardShift,
    };
  });

  const keyboardSpacerStyle = useAnimatedStyle(() => {
    const headroom = (height - actualHeight) - (insets.top + 60);
    const keyboardShift = Math.min(keyboardHeight, Math.max(0, headroom));
    return {
      height: keyboardShift,
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!showModal && !isInline) return null;

  const dynamicBottomPadding = Math.max(24, insets.bottom + 12);

  const content = (
    <View className="flex-1" pointerEvents="box-none">
      {/* Backdrop — only for non-inline modals */}
      {!isInline && (
        <Animated.View
          style={[{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }, backdropStyle]}>
          <Pressable
            className="flex-1"
            onPress={() => {
              if (!disableBackdropPress && onClose) onClose();
            }}
          />
        </Animated.View>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className={`bg-card rounded-t-3xl overflow-hidden ${className}`}
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: actualHeight,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 20,
            },
            animatedStyle,
            style,
          ]}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: footer ? 24 : dynamicBottomPadding,
              gap: 20,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            scrollEnabled={contentHeight + footerHeight >= sheetHeight}
            onContentSizeChange={(_, h) => setContentHeight(h)}>
            <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
          </ScrollView>

          {footer && (
            <View
              className="px-6"
              style={{ paddingBottom: Math.max(24, insets.bottom + 8) }}
              onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
              {footer}
            </View>
          )}

          {/* Spacer to push content above keyboard */}
          <Animated.View style={keyboardSpacerStyle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );

  if (isInline) {
    return content;
  }

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      {content}
    </Modal>
  );
}
