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
  mode = 'normal',
  position = 'center',
  direction = 'left-to-right',
}: GlitterProps): ReactElement {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const animationRef = useRef<ReturnType<typeof Animated.loop> | null>(null);

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
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  }, []);

  const extraWidth = Math.tan((angle * Math.PI) / 180) * 200;

  const isLeftToRight = direction === 'left-to-right';
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: isLeftToRight
      ? [-shimmerWidth - extraWidth, containerWidth + shimmerWidth]
      : [containerWidth + shimmerWidth, -shimmerWidth - extraWidth],
  });

  const heightMultiplier = 1.5;
  const lineHeight = containerHeight * heightMultiplier;

  const getScaleY = (): Animated.AnimatedInterpolation<number> | number => {
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
  };

  const halfHeight = lineHeight / 2;
  const startOffset = 0;

  const getTransformOriginOffset = (): number => {
    if (mode === 'normal' || position === 'center') {
      return 0;
    }

    if (position === 'top') {
      return -halfHeight;
    } else {
      return halfHeight;
    }
  };

  const layerCount = Math.max(11, Math.round(shimmerWidth / 3));
  const horizontalOpacities = generateGlitterOpacities(layerCount, 1);
  const layerWidth = shimmerWidth / layerCount;

  const normalFadeRatio = (heightMultiplier - 1) / heightMultiplier / 2;
  const normalSegments = generateVerticalSegments(normalFadeRatio);
  const animatedSegments = generateVerticalSegments(0.25);

  const shimmerLayers = horizontalOpacities.map((opacity, index) => ({
    opacity,
    position: index * layerWidth - shimmerWidth / 2 + layerWidth / 2,
  }));

  const scaleY = getScaleY();
  const transformOriginOffset = getTransformOriginOffset();
  const isAnimated = mode !== 'normal';

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {children}
      {active && containerWidth > 0 && containerHeight > 0 && (
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
              styles.rotationWrapper,
              {
                width: shimmerWidth,
                height: lineHeight,
                transform: [{ skewX: `${-angle}deg` }],
              },
            ]}
          >
            {shimmerLayers.map((layer, layerIndex) => (
              <Animated.View
                key={layerIndex}
                style={[
                  styles.shimmerLine,
                  {
                    width: layerWidth + 0.5,
                    height: lineHeight,
                    left: layer.position,
                    transform: isAnimated
                      ? [
                          { translateY: startOffset + transformOriginOffset },
                          {
                            scaleY:
                              scaleY as Animated.AnimatedInterpolation<number>,
                          },
                          { translateY: -transformOriginOffset },
                        ]
                      : [{ translateY: startOffset }],
                  },
                ]}
              >
                {(isAnimated ? animatedSegments : normalSegments).map(
                  (segment, vIndex) => (
                    <View
                      key={vIndex}
                      style={{
                        width: '100%',
                        height: lineHeight * segment.heightRatio,
                        backgroundColor: color,
                        opacity: layer.opacity * segment.opacity,
                      }}
                    />
                  )
                )}
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
});

export default Glitter;
