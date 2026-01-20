# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2026-01-20

### Added
- `initialDelay` prop - Add delay before the first animation starts (useful for staggered effects)
- `respectReduceMotion` prop - Respect system's "Reduce Motion" accessibility setting
- `opacity` prop - Control the overall opacity of the shimmer effect
- Accessibility demo section in example app

### Changed
- Performance optimization: Reduced View count by 40% (shimmerWidth=60: 220 → 132 Views)
- Added style memoization for segment styles

### Fixed
- Fixed typo in `lefthook.yml` glob pattern

## [1.0.6] - 2026-01-19

### Added
- `direction` prop - Control shimmer direction (left-to-right or right-to-left)
- `iterations` prop - Set number of animation cycles (-1 for infinite)
- `onAnimationStart` callback - Called when animation starts
- `onAnimationComplete` callback - Called when all iterations complete
- `testID` prop - For e2e testing frameworks
- `accessibilityLabel` prop - For screen readers
- `accessible` prop - Control component accessibility
- Ref API with `start()`, `stop()`, `restart()`, `isAnimating()` methods

## [1.0.5] - 2026-01-18

### Added
- `mode` prop - Animation modes: normal, expand, shrink
- `position` prop - Control shrink/expand position: top, center, bottom

## [1.0.0] - 2026-01-15

### Added
- Initial release
- Basic shimmer/glitter effect component
- `duration` prop - Animation cycle duration
- `delay` prop - Delay between cycles
- `color` prop - Shimmer color
- `angle` prop - Shimmer angle
- `shimmerWidth` prop - Width of shimmer band
- `active` prop - Toggle animation
- `style` prop - Container styles
- `easing` prop - Custom easing function
