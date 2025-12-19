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
  Easing,
  type LayoutChangeEvent,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

export interface GlitterProps {
  /** The content to apply the glitter effect to */
  children: ReactNode;
  /** Duration of one shimmer animation cycle in milliseconds (default: 1500) */
  duration?: number;
  /** Delay between animation cycles in milliseconds (default: 400) */
  delay?: number;
  /** Color of the shimmer effect (default: 'rgba(255, 255, 255, 0.8)') */
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
 * Generate opacities with a sharp bright center and soft wide falloff.
 * Creates a "glitter" effect where the center is thin and bright,
 * while the edges fade out softly over a wider area.
 * @param count - Number of layers
 * @param peak - Maximum opacity at center
 */
function generateGlitterOpacities(count: number, peak: number = 1): number[] {
  const opacities: number[] = [];
  const center = (count - 1) / 2;

  for (let i = 0; i < count; i++) {
    const distance = Math.abs(i - center);
    const normalizedDistance = distance / center; // 0 at center, 1 at edges

    // Sharp peak at center, soft falloff at edges
    // Uses a combination of steep exponential for center and gentle curve for edges
    let opacity: number;
    if (normalizedDistance < 0.15) {
      // Very bright, thin center (only ~15% of width)
      opacity = peak;
    } else if (normalizedDistance < 0.3) {
      // Quick falloff from bright center
      const t = (normalizedDistance - 0.15) / 0.15;
      opacity = peak * (1 - t * 0.6); // Drop to 40% of peak
    } else {
      // Soft, wide glow (remaining 70% of width)
      const t = (normalizedDistance - 0.3) / 0.7;
      opacity = peak * 0.4 * Math.pow(1 - t, 2); // Quadratic falloff from 40% to 0
    }

    opacities.push(Math.max(0, opacity));
  }

  return opacities;
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
  delay = 400,
  color = 'rgba(255, 255, 255, 0.8)',
  angle = 20,
  shimmerWidth = 60,
  active = true,
  style,
  easing,
}: GlitterProps): ReactElement {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const animationRef = useRef<ReturnType<typeof Animated.loop> | null>(null);

  // Default easing: smooth ease-in-out for natural movement
  const defaultEasing = Easing.bezier(0.4, 0, 0.2, 1);

  const startAnimation = useCallback(() => {
    if (!active || containerWidth === 0) return;

    animatedValue.setValue(0);

    const timing = Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: easing ?? defaultEasing,
    });

    animationRef.current = Animated.loop(
      Animated.sequence([timing, Animated.delay(delay)])
    );

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [
    active,
    containerWidth,
    duration,
    delay,
    animatedValue,
    easing,
    defaultEasing,
  ]);

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

  // Generate opacities with sharp center and soft wide glow
  const layerCount = Math.max(11, Math.round(shimmerWidth / 3));
  const opacities = generateGlitterOpacities(layerCount, 1);
  const layerWidth = shimmerWidth / layerCount;

  const shimmerLayers = opacities.map((opacity, index) => ({
    opacity,
    position: index * layerWidth - shimmerWidth / 2 + layerWidth / 2,
  }));

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
                    width: layerWidth + 0.5,
                    left: layer.position,
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
    position: 'absolute',
    height: '100%',
  },
});

export default Glitter;
