import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  withRepeat,
} from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const AnimatedZap = Animated.createAnimatedComponent(Zap);

export default function SplashScreen() {
  const { session, loading } = useAuth();
  
  // Animation values
  const progress = useSharedValue(0);
  const logoTranslateY = useSharedValue(40);
  const logoOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Main animation sequence
    progress.value = withDelay(200, withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }));
    
    // Logo animation
    logoTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    logoOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Tagline animation
    taglineTranslateY.value = withDelay(800, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));

    // Navigation logic is handled in `app/_layout.tsx`.
    // This timeout just ensures the splash is visible for the animation duration.
    const timer = setTimeout(() => {
      if (!loading) {
        // Let the root layout handle redirection
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [session, loading]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const loadingBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const zapAnimatedStyle = useAnimatedStyle(() => {
    const zapTranslateX = interpolate(
      progress.value,
      [0, 1],
      [-20, width * 0.8 - 20], // Animate across 80% of the screen width
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX: zapTranslateX }]
    }
  });

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#111827']}
      style={styles.container}
    >
      <BackgroundShape top={height * 0.1} left={width * 0.1} size={80} delay={0} />
      <BackgroundShape top={height * 0.2} right={width * 0.15} size={50} delay={500} />
      <BackgroundShape bottom={height * 0.3} left={width * 0.2} size={60} delay={1000} />
      <BackgroundShape bottom={height * 0.1} right={width * 0.25} size={90} delay={1500} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Text style={styles.title}>FinanceZ</Text>
        </Animated.View>
        <Animated.View style={taglineAnimatedStyle}>
          <Text style={styles.subtitle}>Your money, your future.</Text>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.loadingBarContainer}>
          <Animated.View style={[styles.loadingBar, loadingBarAnimatedStyle]} />
          <Animated.View style={[styles.zapIconContainer, zapAnimatedStyle]}>
            <AnimatedZap color="#F59E0B" size={24} />
          </Animated.View>
        </View>
        <Text style={styles.footerText}>Building your financial freedom</Text>
      </View>
    </LinearGradient>
  );
}

const BackgroundShape = ({ top, left, right, bottom, size, delay }: any) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bgShape,
        { top, left, right, bottom, width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.1,
    width: '100%',
    alignItems: 'center',
  },
  loadingBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 2,
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  zapIconContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: width * 0.035,
  },
  bgShape: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});
