import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Target, ArrowRight } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingStep1() {
  const titleOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  React.useEffect(() => {
    titleOpacity.value = withSpring(1, { duration: 600 });
    imageScale.value = withDelay(300, withSpring(1, { duration: 800 }));
    contentOpacity.value = withDelay(600, withSpring(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>1 of 3</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>Set Your Goals</Text>
          <Text style={styles.subtitle}>
            Define what you're saving for and we'll help you achieve it
          </Text>
        </Animated.View>

        <Animated.View style={[styles.imageContainer, imageStyle]}>
          <View style={styles.illustration}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalEmoji}>🎯</Text>
                <Text style={styles.goalTitle}>Dream Vacation</Text>
              </View>
              <Text style={styles.goalAmount}>$3,000</Text>
              <View style={styles.goalProgress}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.goalProgressFill}
                />
              </View>
              <Text style={styles.goalProgressText}>65% complete</Text>
            </View>
            
            <View style={[styles.goalCard, styles.goalCardSecondary]}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalEmoji}>📱</Text>
                <Text style={styles.goalTitle}>New iPhone</Text>
              </View>
              <Text style={styles.goalAmount}>$1,200</Text>
              <View style={styles.goalProgress}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.goalProgressFill, { width: '80%' }]}
                />
              </View>
              <Text style={styles.goalProgressText}>80% complete</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.features, contentStyle]}>
          <View style={styles.feature}>
            <Target color="#8B5CF6" size={24} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Goal Tracking</Text>
              <Text style={styles.featureDescription}>
                Visual progress tracking with milestone celebrations
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/onboarding/step2')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <ArrowRight color="#ffffff" size={20} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/onboarding/form')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: width * 0.6,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 26,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  illustration: {
    alignItems: 'center',
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    width: width * 0.7,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  goalCardSecondary: {
    borderLeftColor: '#10B981',
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  goalProgress: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    width: '65%',
    borderRadius: 3,
  },
  goalProgressText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    alignItems: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  featureContent: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 40,
  },
  nextButton: {
    marginBottom: 16,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 18,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
});
