# react-native-glitter

✨ A beautiful shimmer/glitter effect component for React Native. Add a sparkling diagonal shine animation to any component!

Works with both **React Native CLI** and **Expo** projects - no native dependencies required!

![npm](https://img.shields.io/npm/v/react-native-glitter)
![license](https://img.shields.io/npm/l/react-native-glitter)

## Features

- 🚀 **Zero native dependencies** - Pure JavaScript/TypeScript implementation
- 📱 **Cross-platform** - Works on iOS, Android, and Web
- 🎨 **Customizable** - Control color, speed, angle, and more
- ⚡ **Performant** - Uses native driver for smooth 60fps animations
- 🔧 **TypeScript** - Full TypeScript support with type definitions

## Installation

```bash
# Using npm
npm install react-native-glitter

# Using yarn
yarn add react-native-glitter
```

## Usage

### Basic Usage

Wrap any component with `<Glitter>` to add a shimmer effect:

```tsx
import { Glitter } from 'react-native-glitter';

function MyComponent() {
  return (
    <Glitter>
      <View style={styles.card}>
        <Text>This content will shimmer!</Text>
      </View>
    </Glitter>
  );
}
```

### Skeleton Loading

Create beautiful skeleton loading states:

```tsx
import { Glitter } from 'react-native-glitter';

function SkeletonLoader() {
  return (
    <Glitter duration={1200} delay={300}>
      <View style={styles.skeletonBox} />
    </Glitter>
  );
}
```

### Premium Button

Add a luxurious shimmer to buttons:

```tsx
import { Glitter } from 'react-native-glitter';

function PremiumButton() {
  return (
    <Glitter color="rgba(255, 215, 0, 0.5)" angle={25}>
      <TouchableOpacity style={styles.button}>
        <Text>✨ Premium Feature</Text>
      </TouchableOpacity>
    </Glitter>
  );
}
```

### Controlled Animation

Control when the animation runs:

```tsx
import { Glitter } from 'react-native-glitter';

function ControlledGlitter() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Glitter active={isLoading}>
      <View style={styles.content}>
        <Text>Loading...</Text>
      </View>
    </Glitter>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | The content to apply the shimmer effect to |
| `duration` | `number` | `1500` | Duration of one shimmer animation cycle in milliseconds |
| `delay` | `number` | `500` | Delay between animation cycles in milliseconds |
| `color` | `string` | `'rgba(255, 255, 255, 0.4)'` | Color of the shimmer effect |
| `angle` | `number` | `20` | Angle of the shimmer in degrees |
| `shimmerWidth` | `number` | `60` | Width of the shimmer band in pixels |
| `active` | `boolean` | `true` | Whether the animation is active |
| `style` | `ViewStyle` | - | Additional styles for the container |
| `easing` | `(value: number) => number` | - | Custom easing function for the animation |

## Examples

### Different Speeds

```tsx
// Fast shimmer
<Glitter duration={800} delay={200}>
  <View style={styles.box} />
</Glitter>

// Slow shimmer
<Glitter duration={3000} delay={1000}>
  <View style={styles.box} />
</Glitter>
```

### Different Colors

```tsx
// Gold shimmer
<Glitter color="rgba(255, 215, 0, 0.5)">
  <View style={styles.box} />
</Glitter>

// Blue shimmer
<Glitter color="rgba(100, 149, 237, 0.5)">
  <View style={styles.box} />
</Glitter>
```

### Different Angles

```tsx
// Horizontal shimmer
<Glitter angle={0}>
  <View style={styles.box} />
</Glitter>

// Diagonal shimmer
<Glitter angle={45}>
  <View style={styles.box} />
</Glitter>
```

## TypeScript

This library is written in TypeScript and includes type definitions:

```tsx
import { Glitter, type GlitterProps } from 'react-native-glitter';

const customProps: GlitterProps = {
  children: <View />,
  duration: 2000,
  color: 'rgba(255, 255, 255, 0.3)',
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ by [liveforownhappiness](https://github.com/liveforownhappiness)

todo
1.영상 readme 에 넣기
2.line 말고, 전체 컴포넌트감싸고 거기서 라인 조절해보기