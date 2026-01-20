import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
  useImperativeHandle,
  forwardRef,
  type ReactNode,
  type ReactElement,
  type ForwardedRef,
} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  AccessibilityInfo,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

/**
 * Animation mode for the shimmer effect.
 * - `normal`: Constant size shimmer line
 * - `expand`: Shimmer line starts small and grows
 * - `shrink`: Shimmer line starts full size and shrinks
 */
export type GlitterMode = 'normal' | 'expand' | 'shrink';

/**
 * Position where the shimmer line shrinks to or expands from.
 * Only applies when mode is 'expand' or 'shrink'.
 * - `top`: Shrinks to/expands from the top
 * - `center`: Shrinks to/expands from the center
 * - `bottom`: Shrinks to/expands from the bottom
 */
export type GlitterPosition = 'top' | 'center' | 'bottom';

/**
 * Direction of the shimmer animation movement.
 * - `left-to-right`: Shimmer moves from left to right
 * - `right-to-left`: Shimmer moves from right to left
 */
export type GlitterDirection = 'left-to-right' | 'right-to-left';

/**
 * Props for the Glitter component.
 *
 * @example
 * ```tsx
 * <Glitter
 *   duration={1500}
 *   color="rgba(255, 255, 255, 0.8)"
 *   mode="expand"
 * >
 *   <View style={styles.card} />
 * </Glitter>
 * ```
 */
export interface GlitterProps {
  /**
   * The content to apply the shimmer effect to.
   * Can be any valid React node.
   */
  children: ReactNode;

  /**
   * Duration of one shimmer animation cycle in milliseconds.
   * @default 1500
   */
  duration?: number;

  /**
   * Delay between animation cycles in milliseconds.
   * @default 400
   */
  delay?: number;

  /**
   * Initial delay before the first animation cycle starts in milliseconds.
   * Useful for staggering multiple shimmer effects.
   * @default 0
   * @example 500 // Wait 500ms before starting the first animation
   */
  initialDelay?: number;

  /**
   * Color of the shimmer effect.
   * Supports any valid React Native color format (rgba, hex, rgb, named colors).
   * @default 'rgba(255, 255, 255, 0.8)'
   * @example 'rgba(255, 215, 0, 0.5)' // Gold shimmer
   */
  color?: string;

  /**
   * Angle of the shimmer in degrees.
   * 0 = horizontal, 45 = diagonal.
   * @default 20
   */
  angle?: number;

  /**
   * Width of the shimmer band in pixels.
   * @default 60
   */
  shimmerWidth?: number;

  /**
   * Overall opacity of the shimmer effect.
   * Value between 0 and 1.
   * @default 1
   * @example 0.5 // 50% opacity shimmer
   */
  opacity?: number;

  /**
   * Whether the animation is active.
   * Set to false to pause the animation.
   * @default true
   */
  active?: boolean;

  /**
   * Additional styles for the container View.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom easing function for the animation.
   * If not provided, uses a smooth bezier curve (0.4, 0, 0.2, 1).
   * @param value - Input value between 0 and 1
   * @returns Output value between 0 and 1
   * @example (value) => value * value // Ease in quad
   */
  easing?: (value: number) => number;

  /**
   * Animation mode for the shimmer line.
   * @default 'normal'
   */
  mode?: GlitterMode;

  /**
   * Position where the line shrinks/expands.
   * Only applies when mode is 'expand' or 'shrink'.
   * @default 'center'
   */
  position?: GlitterPosition;

  /**
   * Direction of the shimmer animation.
   * @default 'left-to-right'
   */
  direction?: GlitterDirection;

  /**
   * Number of animation cycles.
   * Set to -1 for infinite loop.
   * @default -1
   */
  iterations?: number;

  /**
   * Callback fired when the animation starts.
   * Called once at the beginning of the animation sequence.
   */
  onAnimationStart?: () => void;

  /**
   * Callback fired when all iterations complete.
   * Only called when iterations is a positive number.
   */
  onAnimationComplete?: () => void;

  /**
   * Test ID for e2e testing frameworks like Detox.
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * Describes the shimmer effect to visually impaired users.
   */
  accessibilityLabel?: string;

  /**
   * Whether the component is accessible.
   * @default true
   */
  accessible?: boolean;

  /**
   * Whether to respect the system's "Reduce Motion" accessibility setting.
   * When enabled and the user has reduced motion enabled, the shimmer animation will be disabled.
   * @default true
   */
  respectReduceMotion?: boolean;
}

/**
 * Ref methods exposed by the Glitter component for programmatic control.
 *
 * @example
 * ```tsx
 * const glitterRef = useRef<GlitterRef>(null);
 *
 * // Control animation programmatically
 * glitterRef.current?.start();
 * glitterRef.current?.stop();
 * glitterRef.current?.restart();
 *
 * // Check animation status
 * if (glitterRef.current?.isAnimating()) {
 *   console.log('Animation is running');
 * }
 * ```
 */
export interface GlitterRef {
  /**
   * Start the shimmer animation.
   * Has no effect if already animating or container has no size.
   */
  start: () => void;

  /**
   * Stop the shimmer animation immediately.
   * Cleans up all animation references.
   */
  stop: () => void;

  /**
   * Restart the shimmer animation from the beginning.
   * Stops current animation and starts fresh.
   */
  restart: () => void;

  /**
   * Check if animation is currently running.
   * @returns true if animation is active, false otherwise
   */
  isAnimating: () => boolean;
}

function generateGlitterOpacities(count: number, peak: number = 1): number[] {
  const opacities: number[] = [];
  const center = (count - 1) / 2;

  for (let i = 0; i < count; i++) {
    const distance = Math.abs(i - center);
    const normalizedDistance = distance / center;

    let opacity: number;
    if (normalizedDistance < 0.15) {
      opacity = peak;
    } else if (normalizedDistance < 0.3) {
      const t = (normalizedDistance - 0.15) / 0.15;
      opacity = peak * (1 - t * 0.6);
    } else {
      const t = (normalizedDistance - 0.3) / 0.7;
      opacity = peak * 0.4 * Math.pow(1 - t, 2);
    }

    opacities.push(Math.max(0, opacity));
  }

  return opacities;
}

interface VerticalSegment {
  heightRatio: number;
  opacity: number;
}

function generateVerticalSegments(fadeRatioParam?: number): VerticalSegment[] {
  const fadeRatio = fadeRatioParam ?? 0.25;
  const solidRatio = 1 - fadeRatio * 2;
  const fadeSegments = 5;

  const segments: VerticalSegment[] = [];

  for (let i = 0; i < fadeSegments; i++) {
    const opacity = (i + 1) / fadeSegments;
    segments.push({
      heightRatio: fadeRatio / fadeSegments,
      opacity: Math.pow(opacity, 2),
    });
  }

  segments.push({
    heightRatio: solidRatio,
    opacity: 1,
  });

  for (let i = fadeSegments - 1; i >= 0; i--) {
    const opacity = (i + 1) / fadeSegments;
    segments.push({
      heightRatio: fadeRatio / fadeSegments,
      opacity: Math.pow(opacity, 2),
    });
  }

  return segments;
}

const HEIGHT_MULTIPLIER = 1.5;
const NORMAL_FADE_RATIO = (HEIGHT_MULTIPLIER - 1) / HEIGHT_MULTIPLIER / 2;
const ANIMATED_SEGMENTS = generateVerticalSegments(0.25);
const NORMAL_SEGMENTS = generateVerticalSegments(NORMAL_FADE_RATIO);

function GlitterComponent(
  {
    children,
    duration = 1500,
    delay = 400,
    color = 'rgba(255, 255, 255, 0.8)',
    angle = 20,
    shimmerWidth = 60,
    opacity: shimmerOpacity = 1,
    active = true,
    style,
    easing,
    mode = 'normal',
    position = 'center',
    direction = 'left-to-right',
    iterations = -1,
    initialDelay = 0,
    onAnimationStart,
    onAnimationComplete,
    testID,
    accessibilityLabel,
    accessible = true,
    respectReduceMotion = true,
  }: GlitterProps,
  ref: ForwardedRef<GlitterRef>
): ReactElement {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  // Detect system reduce motion preference
  useEffect(() => {
    if (!respectReduceMotion) {
      setReduceMotionEnabled(false);
      return;
    }

    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReduceMotionEnabled(enabled);
        }
      })
      .catch(() => {
        // Ignore errors (e.g., on web where this might not be supported)
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (isMounted) {
          setReduceMotionEnabled(enabled);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [respectReduceMotion]);
  const animationRef = useRef<ReturnType<typeof Animated.loop> | null>(null);
  const currentIterationRef = useRef<ReturnType<
    typeof Animated.sequence
  > | null>(null);
  const initialDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterationCount = useRef(0);
  const isAnimatingRef = useRef(false);

  const defaultEasing = useMemo(() => Easing.bezier(0.4, 0, 0.2, 1), []);

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
    if (initialDelayRef.current) {
      clearTimeout(initialDelayRef.current);
      initialDelayRef.current = null;
    }
    animationRef.current?.stop();
    animationRef.current = null;
    currentIterationRef.current?.stop();
    currentIterationRef.current = null;
  }, []);

  const restartAnimation = useCallback(() => {
    stopAnimation();
    animatedValue.setValue(0);
    // Trigger re-render to start animation
    setContainerWidth((prev) => prev);
  }, [stopAnimation, animatedValue]);

  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        if (!isAnimatingRef.current && containerWidth > 0) {
          // Force start by triggering the effect
          setContainerWidth((prev) => prev);
        }
      },
      stop: stopAnimation,
      restart: restartAnimation,
      isAnimating: () => isAnimatingRef.current,
    }),
    [stopAnimation, restartAnimation, containerWidth]
  );

  const startAnimation = useCallback(() => {
    if (!active || containerWidth === 0 || reduceMotionEnabled) return;

    stopAnimation();
    animatedValue.setValue(0);
    iterationCount.current = 0;
    isAnimatingRef.current = true;

    const createSingleIteration = () =>
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: easing ?? defaultEasing,
        }),
        Animated.delay(delay),
      ]);

    const runIteration = () => {
      if (!isAnimatingRef.current) return;

      animatedValue.setValue(0);
      currentIterationRef.current = createSingleIteration();
      currentIterationRef.current.start(
        ({ finished }: { finished: boolean }) => {
          if (finished && isAnimatingRef.current) {
            iterationCount.current += 1;
            if (iterations === -1 || iterationCount.current < iterations) {
              runIteration();
            } else {
              isAnimatingRef.current = false;
              onAnimationComplete?.();
            }
          }
        }
      );
    };

    const beginAnimation = () => {
      if (!isAnimatingRef.current) return;

      onAnimationStart?.();

      if (iterations === -1) {
        animationRef.current = Animated.loop(createSingleIteration());
        animationRef.current.start();
      } else {
        runIteration();
      }
    };

    // Apply initial delay before first animation
    if (initialDelay > 0) {
      initialDelayRef.current = setTimeout(beginAnimation, initialDelay);
    } else {
      beginAnimation();
    }
  }, [
    active,
    containerWidth,
    duration,
    delay,
    initialDelay,
    animatedValue,
    easing,
    defaultEasing,
    iterations,
    onAnimationStart,
    onAnimationComplete,
    stopAnimation,
    reduceMotionEnabled,
  ]);

  useEffect(() => {
    startAnimation();
    return stopAnimation;
  }, [startAnimation, stopAnimation]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  }, []);

  const extraWidth = useMemo(
    () => Math.tan((angle * Math.PI) / 180) * 200,
    [angle]
  );

  const isLeftToRight = direction === 'left-to-right';

  const translateX = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: isLeftToRight
          ? [-shimmerWidth - extraWidth, containerWidth + shimmerWidth]
          : [containerWidth + shimmerWidth, -shimmerWidth - extraWidth],
      }),
    [animatedValue, isLeftToRight, shimmerWidth, extraWidth, containerWidth]
  );

  const lineHeight = containerHeight * HEIGHT_MULTIPLIER;

  const scaleY = useMemo(():
    | Animated.AnimatedInterpolation<number>
    | number => {
    if (mode === 'normal') {
      return 1;
    }

    if (mode === 'expand') {
      return animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.01, 1],
      });
    }

    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.01],
    });
  }, [mode, animatedValue]);

  const halfHeight = lineHeight / 2;

  const transformOriginOffset = useMemo((): number => {
    if (mode === 'normal' || position === 'center') {
      return 0;
    }
    return position === 'top' ? -halfHeight : halfHeight;
  }, [mode, position, halfHeight]);

  // Optimized: reduced layer count for better performance
  // shimmerWidth=60 → 12 layers (was 20), shimmerWidth=100 → 14 layers (was 33)
  const layerCount = useMemo(
    () => Math.max(7, Math.round(shimmerWidth / 5)),
    [shimmerWidth]
  );

  const layerWidth = useMemo(
    () => shimmerWidth / layerCount,
    [shimmerWidth, layerCount]
  );

  const horizontalOpacities = useMemo(
    () => generateGlitterOpacities(layerCount, 1),
    [layerCount]
  );

  const shimmerLayers = useMemo(
    () =>
      horizontalOpacities.map((opacity, index) => ({
        opacity,
        position: index * layerWidth - shimmerWidth / 2 + layerWidth / 2,
      })),
    [horizontalOpacities, layerWidth, shimmerWidth]
  );

  const isAnimated = mode !== 'normal';
  const segments = isAnimated ? ANIMATED_SEGMENTS : NORMAL_SEGMENTS;

  // Memoize segment styles to avoid creating new objects on every render
  const segmentStyles = useMemo(
    () =>
      segments.map((segment) => ({
        height: lineHeight * segment.heightRatio,
        backgroundColor: color,
        baseOpacity: segment.opacity,
      })),
    [segments, lineHeight, color]
  );

  const shimmerContainerStyle = useMemo(
    () => [
      styles.shimmerContainer,
      { transform: [{ translateX }], opacity: shimmerOpacity },
    ],
    [translateX, shimmerOpacity]
  );

  const rotationWrapperStyle = useMemo(
    () => [
      styles.rotationWrapper,
      {
        width: shimmerWidth,
        height: lineHeight,
        transform: [{ skewX: `${-angle}deg` }],
      },
    ],
    [shimmerWidth, lineHeight, angle]
  );

  const getShimmerLineStyle = useCallback(
    (layerPosition: number) => [
      styles.shimmerLine,
      {
        width: layerWidth + 0.5,
        height: lineHeight,
        left: layerPosition,
        transform: isAnimated
          ? [
              { translateY: transformOriginOffset },
              {
                scaleY: scaleY as Animated.AnimatedInterpolation<number>,
              },
              { translateY: -transformOriginOffset },
            ]
          : [],
      },
    ],
    [layerWidth, lineHeight, isAnimated, transformOriginOffset, scaleY]
  );

  return (
    <View
      style={[styles.container, style]}
      onLayout={onLayout}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
    >
      {children}
      {active &&
        !reduceMotionEnabled &&
        containerWidth > 0 &&
        containerHeight > 0 && (
          <Animated.View style={shimmerContainerStyle} pointerEvents="none">
            <View style={rotationWrapperStyle}>
              {shimmerLayers.map((layer, layerIndex) => (
                <Animated.View
                  key={layerIndex}
                  style={getShimmerLineStyle(layer.position)}
                >
                  {segmentStyles.map((segmentStyle, vIndex) => (
                    <View
                      key={vIndex}
                      style={[
                        styles.segment,
                        {
                          height: segmentStyle.height,
                          backgroundColor: segmentStyle.backgroundColor,
                          opacity: layer.opacity * segmentStyle.baseOpacity,
                        },
                      ]}
                    />
                  ))}
                </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerLine: {
    position: 'absolute',
    flexDirection: 'column',
  },
  segment: {
    width: '100%',
  },
});

const ForwardedGlitter = forwardRef(GlitterComponent);

/**
 * A beautiful shimmer/glitter effect component for React Native.
 * Wrap any component to add a sparkling diagonal shine animation.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Glitter>
 *   <View style={styles.card}>
 *     <Text>This content will shimmer!</Text>
 *   </View>
 * </Glitter>
 *
 * // With custom options
 * <Glitter
 *   duration={2000}
 *   color="rgba(255, 215, 0, 0.5)"
 *   mode="expand"
 *   direction="right-to-left"
 * >
 *   <View style={styles.premiumButton} />
 * </Glitter>
 *
 * // With ref for programmatic control
 * const glitterRef = useRef<GlitterRef>(null);
 * <Glitter ref={glitterRef} active={false}>
 *   <View style={styles.box} />
 * </Glitter>
 * // Later: glitterRef.current?.start();
 * ```
 *
 * @see {@link GlitterProps} for available props
 * @see {@link GlitterRef} for ref methods
 */
export const Glitter = memo(ForwardedGlitter);

// Set display name for React DevTools
Glitter.displayName = 'Glitter';

export default Glitter;
