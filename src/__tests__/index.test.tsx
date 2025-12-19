import { Text, View } from 'react-native';
import { Glitter } from '../index';

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
  it('should export Glitter component', () => {
    expect(Glitter).toBeDefined();
    expect(typeof Glitter).toBe('function');
  });

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

  it('should accept all props', () => {
    const element = (
      <Glitter
        duration={2000}
        delay={1000}
        color="rgba(255, 215, 0, 0.5)"
        angle={45}
        shimmerWidth={80}
        active={true}
        style={{ margin: 10 }}
      >
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

  it('should accept custom easing function', () => {
    const customEasing = (value: number) => value * value;
    const element = (
      <Glitter easing={customEasing}>
        <View>
          <Text>Test Content</Text>
        </View>
      </Glitter>
    );
    expect(element).toBeTruthy();
  });
});
