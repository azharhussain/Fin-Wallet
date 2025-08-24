import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withDelay,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const { session, loading } = useAuth();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, { duration: 1000 });
    opacity.value = withSpring(1, { duration: 800 });
    titleOpacity.value = withDelay(500, withSpring(1, { duration: 600 }));

    // Navigate after animations and auth check
    const timer = setTimeout(() => {
      if (!loading) {
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [session, loading]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#8B5CF6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={titleStyle}>
          <Text style={styles.title}>FinanceZ</Text>
          <Text style={styles.subtitle}>Your money, your future</Text>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Building your financial freedom</Text>
      </View>
    </LinearGradient>
  );
}

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
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});
