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
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type GlitterMode = 'normal' | 'expand' | 'shrink';

export type GlitterPosition = 'top' | 'center' | 'bottom';

export type GlitterDirection = 'left-to-right' | 'right-to-left';

export interface GlitterProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  color?: string;
  angle?: number;
  shimmerWidth?: number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  easing?: (value: number) => number;
  mode?: GlitterMode;
  position?: GlitterPosition;
  direction?: GlitterDirection;
  iterations?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  /** Test ID for e2e testing */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Whether the component is accessible (default: true) */
  accessible?: boolean;
}

/** Ref methods exposed by Glitter component */
export interface GlitterRef {
  /** Start the shimmer animation */
  start: () => void;
  /** Stop the shimmer animation */
  stop: () => void;
  /** Restart the shimmer animation from the beginning */
  restart: () => void;
  /** Check if animation is currently running */
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
    active = true,
    style,
    easing,
    mode = 'normal',
    position = 'center',
    direction = 'left-to-right',
    iterations = -1,
    onAnimationStart,
    onAnimationComplete,
    testID,
    accessibilityLabel,
    accessible = true,
  }: GlitterProps,
  ref: ForwardedRef<GlitterRef>
): ReactElement {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const animationRef = useRef<ReturnType<typeof Animated.loop> | null>(null);
  const currentIterationRef = useRef<ReturnType<
    typeof Animated.sequence
  > | null>(null);
  const iterationCount = useRef(0);
  const isAnimatingRef = useRef(false);

  const defaultEasing = useMemo(() => Easing.bezier(0.4, 0, 0.2, 1), []);

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
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
    if (!active || containerWidth === 0) return;

    stopAnimation();
    animatedValue.setValue(0);
    iterationCount.current = 0;
    isAnimatingRef.current = true;

    onAnimationStart?.();

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

    if (iterations === -1) {
      animationRef.current = Animated.loop(createSingleIteration());
      animationRef.current.start();
    } else {
      runIteration();
    }
  }, [
    active,
    containerWidth,
    duration,
    delay,
    animatedValue,
    easing,
    defaultEasing,
    iterations,
    onAnimationStart,
    onAnimationComplete,
    stopAnimation,
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

  const layerCount = useMemo(
    () => Math.max(11, Math.round(shimmerWidth / 3)),
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

  const shimmerContainerStyle = useMemo(
    () => [styles.shimmerContainer, { transform: [{ translateX }] }],
    [translateX]
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
      {active && containerWidth > 0 && containerHeight > 0 && (
        <Animated.View style={shimmerContainerStyle} pointerEvents="none">
          <View style={rotationWrapperStyle}>
            {shimmerLayers.map((layer, layerIndex) => (
              <Animated.View
                key={layerIndex}
                style={getShimmerLineStyle(layer.position)}
              >
                {segments.map((segment, vIndex) => (
                  <View
                    key={vIndex}
                    style={[
                      styles.segment,
                      {
                        height: lineHeight * segment.heightRatio,
                        backgroundColor: color,
                        opacity: layer.opacity * segment.opacity,
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
export const Glitter = memo(ForwardedGlitter);

export default Glitter;
