import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TrendingUp, ArrowRight, BarChart3 } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withDelay,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingStep2() {
  const titleOpacity = useSharedValue(0);
  const chartScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  React.useEffect(() => {
    titleOpacity.value = withSpring(1, { duration: 600 });
    chartScale.value = withDelay(300, withSpring(1, { duration: 800 }));
    contentOpacity.value = withDelay(600, withSpring(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const chartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chartScale.value }],
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>2 of 3</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>Grow Your Money</Text>
          <Text style={styles.subtitle}>
            Start investing with as little as $1 and watch your wealth grow
          </Text>
        </Animated.View>

        <Animated.View style={[styles.chartContainer, chartStyle]}>
          <View style={styles.investmentChart}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Portfolio Growth</Text>
              <View style={styles.chartValue}>
                <Text style={styles.chartAmount}>$5,247</Text>
                <View style={styles.chartChange}>
                  <TrendingUp color="#10B981" size={16} />
                  <Text style={styles.chartChangeText}>+18.5%</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartBars}>
              {[40, 65, 55, 80, 75, 90, 100].map((height, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: `${height}%` }]}>
                    <LinearGradient
                      colors={index >= 5 ? ['#8B5CF6', '#EC4899'] : ['#374151', '#4B5563']}
                      style={styles.barGradient}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.investmentCards}>
            <View style={styles.investmentCard}>
              <Text style={styles.cardEmoji}>📈</Text>
              <Text style={styles.cardTitle}>Tech ETF</Text>
              <Text style={styles.cardValue}>$1,245</Text>
              <Text style={styles.cardChange}>+12.3%</Text>
            </View>
            <View style={styles.investmentCard}>
              <Text style={styles.cardEmoji}>🌱</Text>
              <Text style={styles.cardTitle}>Green Energy</Text>
              <Text style={styles.cardValue}>$856</Text>
              <Text style={styles.cardChange}>+8.7%</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.features, contentStyle]}>
          <View style={styles.feature}>
            <BarChart3 color="#3B82F6" size={24} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Diversified Portfolios</Text>
              <Text style={styles.featureDescription}>
                Pre-built portfolios designed for different risk levels
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/onboarding/step3')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
  },
  progressBar: {
    width: width * 0.5,
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  investmentChart: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    marginBottom: 20,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  chartValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  chartChangeText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 8,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  barGradient: {
    flex: 1,
  },
  investmentCards: {
    flexDirection: 'row',
    gap: 12,
  },
  investmentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardChange: {
    color: '#10B981',
    fontSize: 12,
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
