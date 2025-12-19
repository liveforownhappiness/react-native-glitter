import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type ReactElement,
} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  type LayoutChangeEvent,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

export interface GlitterProps {
  /** The content to apply the glitter effect to */
  children: ReactNode;
  /** Duration of one shimmer animation cycle in milliseconds (default: 1500) */
  duration?: number;
  /** Delay between animation cycles in milliseconds (default: 500) */
  delay?: number;
  /** Color of the shimmer effect (default: 'rgba(255, 255, 255, 0.4)') */
  color?: string;
  /** Angle of the shimmer in degrees (default: 20) */
  angle?: number;
  /** Width of the shimmer band (default: 60) */
  shimmerWidth?: number;
  /** Whether the animation is active (default: true) */
  active?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Easing function for the animation */
  easing?: (value: number) => number;
}

/**
 * Glitter component that adds a shimmer/glitter effect to its children.
 * The effect creates a diagonal light band that sweeps across the content.
 *
 * @example
 * ```tsx
 * <Glitter>
 *   <View style={styles.card}>
 *     <Text>Loading...</Text>
 *   </View>
 * </Glitter>
 * ```
 */
export function Glitter({
  children,
  duration = 1500,
  delay = 500,
  color = 'rgba(255, 255, 255, 0.4)',
  angle = 20,
  shimmerWidth = 60,
  active = true,
  style,
  easing,
}: GlitterProps): ReactElement {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const animationRef = useRef<ReturnType<typeof Animated.loop> | null>(null);

  const startAnimation = useCallback(() => {
    if (!active || containerWidth === 0) return;

    animatedValue.setValue(0);

    const timing = Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing,
    });

    animationRef.current = Animated.loop(
      Animated.sequence([timing, Animated.delay(delay)])
    );

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [active, containerWidth, duration, delay, animatedValue, easing]);

  useEffect(() => {
    const cleanup = startAnimation();
    return cleanup;
  }, [startAnimation]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Calculate the shimmer travel distance
  const extraWidth = Math.tan((angle * Math.PI) / 180) * 200;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth - extraWidth, containerWidth + shimmerWidth],
  });

  // Create gradient-like effect using multiple views with varying opacity
  const shimmerLayers = [
    { opacity: 0.1, offset: -shimmerWidth * 0.4 },
    { opacity: 0.2, offset: -shimmerWidth * 0.2 },
    { opacity: 0.4, offset: 0 },
    { opacity: 0.2, offset: shimmerWidth * 0.2 },
    { opacity: 0.1, offset: shimmerWidth * 0.4 },
  ];

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {children}
      {active && containerWidth > 0 && (
        <Animated.View
          style={[
            styles.shimmerContainer,
            {
              transform: [{ translateX }],
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.shimmerWrapper,
              {
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          >
            {shimmerLayers.map((layer, index) => (
              <View
                key={index}
                style={[
                  styles.shimmerLine,
                  {
                    backgroundColor: color,
                    opacity: layer.opacity,
                    width: shimmerWidth / shimmerLayers.length,
                    transform: [{ translateX: layer.offset }],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300%',
  },
  shimmerLine: {
    height: '100%',
  },
});

export default Glitter;
