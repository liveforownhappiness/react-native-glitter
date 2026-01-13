import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import { Glitter } from 'react-native-glitter';

export default function App() {
  const [active, setActive] = useState(true);
  const [respectReduceMotion, setRespectReduceMotion] = useState(true);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  // Detect system reduce motion setting
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setSystemReduceMotion)
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setSystemReduceMotion
    );

    return () => subscription.remove();
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>React Native Glitter</Text>
      <Text style={styles.subtitle}>✨ Shimmer Effect Examples</Text>

      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setActive(!active)}
      >
        <Text style={styles.toggleButtonText}>
          {active ? '🔴 Stop Animation' : '🟢 Start Animation'}
        </Text>
      </TouchableOpacity>

      {/* Basic Card Example */}
      <Text style={styles.sectionTitle}>Basic Card</Text>
      <Glitter active={active} style={styles.cardGlitter}>
        <View style={styles.cardInner}>
          <Text style={styles.cardTitle}>Loading Content</Text>
          <Text style={styles.cardText}>
            This card has a beautiful shimmer effect that makes it look like
            it's glittering!
          </Text>
        </View>
      </Glitter>

      {/* Button Example */}
      <Text style={styles.sectionTitle}>Premium Button</Text>
      <Glitter
        active={active}
        color="rgba(255, 215, 0, 0.5)"
        angle={25}
        style={styles.premiumButtonContainer}
      >
        <TouchableOpacity style={styles.premiumButtonInner}>
          <Text style={styles.premiumButtonText}>✨ Premium Feature</Text>
        </TouchableOpacity>
      </Glitter>

      {/* Skeleton Loading Example */}
      <Text style={styles.sectionTitle}>Skeleton Loading</Text>
      <View style={styles.skeletonContainer}>
        <Glitter active={active} duration={1200} delay={300}>
          <View style={styles.skeletonAvatar} />
        </Glitter>
        <View style={styles.skeletonContent}>
          <Glitter active={active} duration={1200} delay={300}>
            <View style={styles.skeletonTitle} />
          </Glitter>
          <Glitter active={active} duration={1200} delay={300}>
            <View style={styles.skeletonSubtitle} />
          </Glitter>
        </View>
      </View>

      {/* Different Colors Example */}
      <Text style={styles.sectionTitle}>Custom Colors</Text>
      <View style={styles.colorRow}>
        <Glitter active={active} color="rgba(36, 33, 33, 0.2)">
          <View style={[styles.colorBox, styles.colorBoxRed]} />
        </Glitter>
        <Glitter active={active} color="rgba(100, 255, 100, 0.5)">
          <View style={[styles.colorBox, styles.colorBoxGreen]} />
        </Glitter>
        <Glitter active={active} color="rgba(100, 100, 255, 0.5)">
          <View style={[styles.colorBox, styles.colorBoxBlue]} />
        </Glitter>
      </View>

      {/* Different Speeds Example */}
      <Text style={styles.sectionTitle}>Animation Speeds</Text>
      <View style={styles.speedRow}>
        <View style={styles.speedItem}>
          <Text style={styles.speedLabel}>Fast</Text>
          <Glitter active={active} duration={800} delay={200}>
            <View style={styles.speedBox} />
          </Glitter>
        </View>
        <View style={styles.speedItem}>
          <Text style={styles.speedLabel}>Normal</Text>
          <Glitter active={active} duration={1500} delay={500}>
            <View style={styles.speedBox} />
          </Glitter>
        </View>
        <View style={styles.speedItem}>
          <Text style={styles.speedLabel}>Slow</Text>
          <Glitter active={active} duration={3000} delay={1000}>
            <View style={styles.speedBox} />
          </Glitter>
        </View>
      </View>

      {/* Different Angles Example */}
      <Text style={styles.sectionTitle}>Shimmer Angles</Text>
      <View style={styles.angleRow}>
        <View style={styles.angleItem}>
          <Glitter active={active} angle={0}>
            <View style={styles.angleBox}>
              <Text style={styles.angleText}>0°</Text>
            </View>
          </Glitter>
        </View>
        <View style={styles.angleItem}>
          <Glitter active={active} angle={20}>
            <View style={styles.angleBox}>
              <Text style={styles.angleText}>20°</Text>
            </View>
          </Glitter>
        </View>
        <View style={styles.angleItem}>
          <Glitter active={active} angle={45}>
            <View style={styles.angleBox}>
              <Text style={styles.angleText}>45°</Text>
            </View>
          </Glitter>
        </View>
      </View>

      {/* Animation Modes */}
      <Text style={styles.sectionTitle}>Animation Modes</Text>
      <View style={styles.modeRow}>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Normal</Text>
          <Glitter active={active} mode="normal">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Expand</Text>
          <Glitter active={active} mode="expand">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Shrink</Text>
          <Glitter active={active} mode="shrink">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
      </View>

      {/* Expand Positions */}
      <Text style={styles.sectionTitle}>Expand Positions</Text>
      <View style={styles.modeRow}>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Top</Text>
          <Glitter active={active} mode="expand" position="top">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Center</Text>
          <Glitter active={active} mode="expand" position="center">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Bottom</Text>
          <Glitter active={active} mode="expand" position="bottom">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
      </View>

      {/* Shrink Positions */}
      <Text style={styles.sectionTitle}>Shrink Positions</Text>
      <View style={styles.modeRow}>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Top</Text>
          <Glitter active={active} mode="shrink" position="top">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Center</Text>
          <Glitter active={active} mode="shrink" position="center">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
        <View style={styles.modeItem}>
          <Text style={styles.modeLabel}>Bottom</Text>
          <Glitter active={active} mode="shrink" position="bottom">
            <View style={styles.modeBox} />
          </Glitter>
        </View>
      </View>

      {/* Accessibility - Reduce Motion */}
      <Text style={styles.sectionTitle}>♿ Accessibility</Text>
      <View style={styles.accessibilityContainer}>
        <View style={styles.accessibilityInfo}>
          <Text style={styles.accessibilityLabel}>System "Reduce Motion":</Text>
          <Text
            style={[
              styles.accessibilityValue,
              systemReduceMotion ? styles.valueOn : styles.valueOff,
            ]}
          >
            {systemReduceMotion ? 'ON' : 'OFF'}
          </Text>
        </View>
        <Text style={styles.accessibilityHint}>
          {systemReduceMotion
            ? '💡 Go to Settings → Accessibility → Motion to turn off'
            : '💡 Go to Settings → Accessibility → Motion to turn on'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.reduceMotionButton,
          respectReduceMotion
            ? styles.reduceMotionButtonOn
            : styles.reduceMotionButtonOff,
        ]}
        onPress={() => setRespectReduceMotion(!respectReduceMotion)}
      >
        <Text style={styles.reduceMotionButtonText}>
          respectReduceMotion: {respectReduceMotion ? 'true' : 'false'}
        </Text>
      </TouchableOpacity>

      <View style={styles.modeRow}>
        <View style={styles.accessibilityDemoItem}>
          <Text style={styles.modeLabel}>Respects Setting</Text>
          <Glitter active={active} respectReduceMotion={respectReduceMotion}>
            <View style={styles.accessibilityBox}>
              <Text style={styles.accessibilityBoxText}>
                {systemReduceMotion && respectReduceMotion
                  ? '🚫 No Animation'
                  : '✨ Animating'}
              </Text>
            </View>
          </Glitter>
        </View>
        <View style={styles.accessibilityDemoItem}>
          <Text style={styles.modeLabel}>Always Animates</Text>
          <Glitter active={active} respectReduceMotion={false}>
            <View style={styles.accessibilityBox}>
              <Text style={styles.accessibilityBoxText}>✨ Always On</Text>
            </View>
          </Glitter>
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
  },
  toggleButton: {
    backgroundColor: '#2d2d44',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    marginTop: 10,
  },
  cardGlitter: {
    borderRadius: 16,
    marginBottom: 20,
  },
  cardInner: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 22,
  },
  premiumButtonContainer: {
    marginBottom: 20,
  },
  premiumButtonInner: {
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skeletonContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  skeletonAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#404060',
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: '#404060',
    borderRadius: 4,
    marginBottom: 10,
    width: '80%',
  },
  skeletonSubtitle: {
    height: 14,
    backgroundColor: '#404060',
    borderRadius: 4,
    width: '60%',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorBox: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  colorBoxRed: {
    backgroundColor: '#ff6b6b',
  },
  colorBoxGreen: {
    backgroundColor: '#51cf66',
  },
  colorBoxBlue: {
    backgroundColor: '#339af0',
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  speedItem: {
    alignItems: 'center',
  },
  speedLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 8,
  },
  speedBox: {
    width: 100,
    height: 60,
    backgroundColor: '#2d2d44',
    borderRadius: 10,
  },
  angleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  angleItem: {
    alignItems: 'center',
  },
  angleBox: {
    width: 100,
    height: 80,
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  angleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeItem: {
    alignItems: 'center',
  },
  modeLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 8,
  },
  modeBox: {
    width: 100,
    height: 80,
    backgroundColor: '#2d2d44',
    borderRadius: 10,
  },
  accessibilityContainer: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  accessibilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  accessibilityLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  accessibilityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  valueOn: {
    backgroundColor: '#51cf66',
    color: '#ffffff',
  },
  valueOff: {
    backgroundColor: '#666',
    color: '#ffffff',
  },
  accessibilityHint: {
    color: '#a0a0a0',
    fontSize: 12,
  },
  reduceMotionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  reduceMotionButtonOn: {
    backgroundColor: '#00b894',
  },
  reduceMotionButtonOff: {
    backgroundColor: '#636e72',
  },
  reduceMotionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  accessibilityDemoItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  accessibilityBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessibilityBoxText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    height: 50,
  },
});
