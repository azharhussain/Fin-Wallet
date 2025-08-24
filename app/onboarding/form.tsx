import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Briefcase, DollarSign, Target, Shield, TrendingUp, ArrowRight } from 'lucide-react-native';

const financialGoalsOptions = [
  { label: 'New House', emoji: '🏠' },
  { label: 'New Car', emoji: '🚗' },
  { label: 'Dream Vacation', emoji: '🏖️' },
  { label: 'Education', emoji: '🎓' },
  { label: 'Retirement', emoji: '👴' },
  { label: 'Emergency Fund', emoji: '🛡️' },
];

const riskToleranceOptions = [
  { label: 'Conservative', icon: Shield, color: '#3B82F6' },
  { label: 'Moderate', icon: Target, color: '#F59E0B' },
  { label: 'Aggressive', icon: TrendingUp, color: '#EF4444' },
];

export default function OnboardingFormScreen() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [financialGoals, setFinancialGoals] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal: string) => {
    setFinancialGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSaveProfile = async () => {
    if (!fullName || !age || !occupation || !monthlyIncome || financialGoals.length === 0 || !riskTolerance) {
      Alert.alert('Incomplete Form', 'Please fill out all fields to continue.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save your profile.');
      router.replace('/login');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: fullName,
        age: parseInt(age, 10),
        occupation,
        monthly_income: parseFloat(monthlyIncome),
        financial_goals: financialGoals,
        risk_tolerance: riskTolerance.toLowerCase() as 'conservative' | 'moderate' | 'aggressive',
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
      console.error('Error updating profile:', error);
    } else {
      Alert.alert('Profile Complete!', 'Welcome to FinanceZ. Let\'s get started!');
      router.replace('/(tabs)');
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Tell Us About Yourself</Text>
            <Text style={styles.subtitle}>This helps us personalize your experience.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.inputContainer}>
              <User color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#6B7280"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.ageIcon}>🎂</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#6B7280"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
            </View>

            <Text style={styles.sectionTitle}>Financial Snapshot</Text>
            <View style={styles.inputContainer}>
              <Briefcase color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Occupation"
                placeholderTextColor="#6B7280"
                value={occupation}
                onChangeText={setOccupation}
              />
            </View>
            <View style={styles.inputContainer}>
              <DollarSign color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Monthly Income (USD)"
                placeholderTextColor="#6B7280"
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.sectionTitle}>What are your financial goals?</Text>
            <View style={styles.optionsGrid}>
              {financialGoalsOptions.map((goal) => (
                <TouchableOpacity
                  key={goal.label}
                  style={[
                    styles.optionChip,
                    financialGoals.includes(goal.label) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleGoal(goal.label)}
                >
                  <Text style={styles.optionEmoji}>{goal.emoji}</Text>
                  <Text style={styles.optionLabel}>{goal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>What's your investment style?</Text>
            <View style={styles.riskOptionsContainer}>
              {riskToleranceOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.riskOption,
                    riskTolerance === option.label && styles.riskOptionSelected,
                    { borderTopColor: option.color }
                  ]}
                  onPress={() => setRiskTolerance(option.label)}
                >
                  <option.icon color={riskTolerance === option.label ? option.color : "#9CA3AF"} size={32} />
                  <Text style={[styles.riskLabel, riskTolerance === option.label && { color: option.color }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Saving...' : 'Complete Profile'}
              </Text>
              <ArrowRight color="#ffffff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  form: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  ageIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    fontSize: 20,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 18,
    paddingLeft: 50,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  optionChipSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  optionEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  optionLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  riskOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  riskOption: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
    borderTopWidth: 4,
  },
  riskOptionSelected: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  riskLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  submitButton: {},
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
