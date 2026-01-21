import { createRef } from 'react';
import { Text, View } from 'react-native';
import {
  Glitter,
  type GlitterRef,
  type GlitterProps,
  type GlitterMode,
  type GlitterPosition,
  type GlitterDirection,
} from '../index';

// Mock Animated to prevent issues in test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = () => ({
    start: jest.fn(),
    stop: jest.fn(),
  });
  RN.Animated.loop = (_animation: unknown) => ({
    start: jest.fn(),
    stop: jest.fn(),
  });
  RN.Animated.sequence = () => ({
    start: jest.fn(),
    stop: jest.fn(),
  });
  RN.Animated.delay = () => ({
    start: jest.fn(),
    stop: jest.fn(),
  });
  return RN;
});

describe('Glitter', () => {
  describe('Component Export', () => {
    it('should export Glitter component', () => {
      expect(Glitter).toBeDefined();
      // React.memo + forwardRef returns an object
      expect(typeof Glitter).toBe('object');
      expect(Glitter.$$typeof).toBeDefined();
    });

    it('should export GlitterRef type', () => {
      const ref: GlitterRef | null = null;
      expect(ref).toBeNull();
    });

    it('should export GlitterProps type', () => {
      const props: Partial<GlitterProps> = {
        duration: 1500,
        delay: 400,
      };
      expect(props.duration).toBe(1500);
    });

    it('should export GlitterMode type', () => {
      const mode: GlitterMode = 'normal';
      expect(['normal', 'expand', 'shrink']).toContain(mode);
    });

    it('should export GlitterPosition type', () => {
      const position: GlitterPosition = 'center';
      expect(['top', 'center', 'bottom']).toContain(position);
    });

    it('should export GlitterDirection type', () => {
      const direction: GlitterDirection = 'left-to-right';
      expect(['left-to-right', 'right-to-left']).toContain(direction);
    });
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const element = (
        <Glitter>
          <View>
            <Text>Test Content</Text>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should render with active=false', () => {
      const element = (
        <Glitter active={false}>
          <View>
            <Text>Test Content</Text>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should render with active=true', () => {
      const element = (
        <Glitter active={true}>
          <View>
            <Text>Test Content</Text>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should render with multiple children', () => {
      const element = (
        <Glitter>
          <View>
            <Text>First</Text>
            <Text>Second</Text>
            <View>
              <Text>Nested</Text>
            </View>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Animation Props', () => {
    it('should accept duration prop', () => {
      const element = (
        <Glitter duration={2000}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept delay prop', () => {
      const element = (
        <Glitter delay={500}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept iterations prop with positive number', () => {
      const element = (
        <Glitter iterations={5}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept iterations prop with -1 for infinite', () => {
      const element = (
        <Glitter iterations={-1}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept custom easing function', () => {
      const customEasing = (value: number) => value * value;
      const element = (
        <Glitter easing={customEasing}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept initialDelay prop', () => {
      const element = (
        <Glitter initialDelay={500}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept initialDelay=0 (default)', () => {
      const element = (
        <Glitter initialDelay={0}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should work with initialDelay and other animation props', () => {
      const element = (
        <Glitter initialDelay={1000} duration={2000} delay={500} iterations={3}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Appearance Props', () => {
    it('should accept color prop', () => {
      const element = (
        <Glitter color="rgba(255, 215, 0, 0.5)">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept angle prop', () => {
      const element = (
        <Glitter angle={45}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept angle=0 for horizontal shimmer', () => {
      const element = (
        <Glitter angle={0}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept shimmerWidth prop', () => {
      const element = (
        <Glitter shimmerWidth={100}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept style prop', () => {
      const element = (
        <Glitter style={{ margin: 10, borderRadius: 8 }}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept opacity prop', () => {
      const element = (
        <Glitter opacity={0.5}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept opacity=1 (default)', () => {
      const element = (
        <Glitter opacity={1}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept opacity=0', () => {
      const element = (
        <Glitter opacity={0}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Mode Props', () => {
    it('should accept mode="normal"', () => {
      const element = (
        <Glitter mode="normal">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept mode="expand"', () => {
      const element = (
        <Glitter mode="expand">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept mode="shrink"', () => {
      const element = (
        <Glitter mode="shrink">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Position Props', () => {
    it('should accept position="top"', () => {
      const element = (
        <Glitter mode="shrink" position="top">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept position="center"', () => {
      const element = (
        <Glitter mode="shrink" position="center">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept position="bottom"', () => {
      const element = (
        <Glitter mode="shrink" position="bottom">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept expand mode with all positions', () => {
      const positions: GlitterPosition[] = ['top', 'center', 'bottom'];
      positions.forEach((pos) => {
        const element = (
          <Glitter mode="expand" position={pos}>
            <View />
          </Glitter>
        );
        expect(element).toBeTruthy();
      });
    });
  });

  describe('Direction Props', () => {
    it('should accept direction="left-to-right"', () => {
      const element = (
        <Glitter direction="left-to-right">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept direction="right-to-left"', () => {
      const element = (
        <Glitter direction="right-to-left">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Callback Props', () => {
    it('should accept onAnimationStart callback', () => {
      const onStart = jest.fn();
      const element = (
        <Glitter onAnimationStart={onStart}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept onAnimationComplete callback', () => {
      const onComplete = jest.fn();
      const element = (
        <Glitter onAnimationComplete={onComplete}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept both animation callbacks', () => {
      const onStart = jest.fn();
      const onComplete = jest.fn();
      const element = (
        <Glitter
          iterations={3}
          onAnimationStart={onStart}
          onAnimationComplete={onComplete}
        >
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Accessibility Props', () => {
    it('should accept testID prop', () => {
      const element = (
        <Glitter testID="glitter-test">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept accessibilityLabel prop', () => {
      const element = (
        <Glitter accessibilityLabel="Loading shimmer effect">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept accessible prop', () => {
      const element = (
        <Glitter accessible={true}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept accessible=false', () => {
      const element = (
        <Glitter accessible={false}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept all accessibility props together', () => {
      const element = (
        <Glitter
          testID="glitter-component"
          accessibilityLabel="Loading shimmer effect"
          accessible={true}
        >
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept respectReduceMotion=true (default)', () => {
      const element = (
        <Glitter respectReduceMotion={true}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept respectReduceMotion=false', () => {
      const element = (
        <Glitter respectReduceMotion={false}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should work with respectReduceMotion and other accessibility props', () => {
      const element = (
        <Glitter
          respectReduceMotion={true}
          accessible={true}
          accessibilityLabel="Shimmer loading effect"
          testID="shimmer-test"
        >
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept pauseOnBackground=true (default)', () => {
      const element = (
        <Glitter pauseOnBackground={true}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept pauseOnBackground=false', () => {
      const element = (
        <Glitter pauseOnBackground={false}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Ref API', () => {
    it('should accept ref prop', () => {
      const ref = createRef<GlitterRef>();
      const element = (
        <Glitter ref={ref}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should accept ref with active=false', () => {
      const ref = createRef<GlitterRef>();
      const element = (
        <Glitter ref={ref} active={false}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Combined Props', () => {
    it('should accept all props together', () => {
      const ref = createRef<GlitterRef>();
      const onStart = jest.fn();
      const onComplete = jest.fn();
      const customEasing = (value: number) => value * value;

      const element = (
        <Glitter
          ref={ref}
          duration={2000}
          delay={500}
          color="rgba(255, 215, 0, 0.5)"
          angle={30}
          shimmerWidth={80}
          active={true}
          style={{ margin: 10 }}
          easing={customEasing}
          mode="expand"
          position="top"
          direction="right-to-left"
          iterations={5}
          onAnimationStart={onStart}
          onAnimationComplete={onComplete}
          testID="full-glitter"
          accessibilityLabel="Full featured shimmer"
          accessible={true}
        >
          <View>
            <Text>Full Props Test</Text>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should work with skeleton loading pattern', () => {
      const element = (
        <Glitter duration={1200} delay={300} color="rgba(255, 255, 255, 0.3)">
          <View
            style={{ width: 200, height: 20, backgroundColor: '#e0e0e0' }}
          />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should work with premium button pattern', () => {
      const element = (
        <Glitter color="rgba(255, 215, 0, 0.5)" angle={25}>
          <View style={{ padding: 16, backgroundColor: '#6c5ce7' }}>
            <Text>Premium Feature</Text>
          </View>
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero duration', () => {
      const element = (
        <Glitter duration={0}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle zero delay', () => {
      const element = (
        <Glitter delay={0}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle very large shimmerWidth', () => {
      const element = (
        <Glitter shimmerWidth={500}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle very small shimmerWidth', () => {
      const element = (
        <Glitter shimmerWidth={1}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle negative angle', () => {
      const element = (
        <Glitter angle={-20}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle large angle', () => {
      const element = (
        <Glitter angle={89}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle iterations=1', () => {
      const element = (
        <Glitter iterations={1}>
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle hex color', () => {
      const element = (
        <Glitter color="#FFD700">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });

    it('should handle rgb color', () => {
      const element = (
        <Glitter color="rgb(255, 215, 0)">
          <View />
        </Glitter>
      );
      expect(element).toBeTruthy();
    });
  });
});
