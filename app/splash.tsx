import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const LOGO_SIZE = width * 0.4;

export default function SplashScreen() {
  const { session, loading } = useAuth();

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const ring1Scale = useSharedValue(0);
  const ring2Scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animate logo entrance
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });

    // Animate rings
    ring1Scale.value = withDelay(400, withSpring(1, { damping: 15, stiffness: 100 }));
    ring2Scale.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 100 }));

    // Animate text
    textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(800, withSpring(0));

    // Navigate after animations and auth check
    const timer = setTimeout(() => {
      if (!loading) {
        // The root layout will handle redirection based on auth state
        // This splash screen's only job is to be displayed initially.
        // The router.replace logic is handled in `app/_layout.tsx`
      }
    }, 2500); // Keep splash visible for a minimum duration

    return () => clearTimeout(timer);
  }, [session, loading]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#111827']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
          <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoCore}
          >
            <Text style={styles.logoText}>FZ</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.titleContainer, textContainerStyle]}>
          <Text style={styles.title}>FinanceZ</Text>
          <Text style={styles.subtitle}>Your money, your future.</Text>
        </Animated.View>
      </View>
      
      <Animated.View style={[styles.footer, textContainerStyle]}>
        <Text style={styles.footerText}>Building your financial freedom</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: LOGO_SIZE * 1.5,
  },
  ring1: {
    width: LOGO_SIZE * 1.5,
    height: LOGO_SIZE * 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  ring2: {
    width: LOGO_SIZE * 2,
    height: LOGO_SIZE * 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  logoCore: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: LOGO_SIZE * 0.4,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: height * 0.05,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: width * 0.035,
  },
});
