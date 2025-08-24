import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PlusCircle,
  ArrowUpRight,
  Target,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react-native';
import { useFocusEffect, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Database } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const { width } = Dimensions.get('window');

type Profile = Database['public']['Tables']['user_profiles']['Row'];
type Goal = Database['public']['Tables']['savings_goals']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Investment = Database['public']['Tables']['investments']['Row'];
type Card = Database['public']['Tables']['cards']['Row'];

export default function HomeScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch Goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (goalsError) throw goalsError;
      setGoals(goalsData);

      // Fetch Transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData);

      // Fetch Investments and Cards for total balance
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments')
        .select('value')
        .eq('user_id', user.id);
      if (investmentsError) throw investmentsError;

      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('balance')
        .eq('user_id', user.id);
      if (cardsError) throw cardsError;

      const investmentTotal = investmentsData?.reduce((sum, item) => sum + item.value, 0) || 0;
      const cardTotal = cardsData?.reduce((sum, item) => sum + item.balance, 0) || 0;
      setTotalBalance(investmentTotal + cardTotal);

    } catch (error) {
      console.error('Error fetching home screen data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {profile?.full_name?.split(' ')[0] || 'there'}! 👋</Text>
          <Text style={styles.subtitle}>Ready to grow your money?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileText}>{profile?.full_name?.[0] || 'U'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.balanceChange}>
            <TrendingUp color="#ffffff" size={16} />
            <Text style={styles.changeText}>Growth this month</Text>
          </View>
        </View>
        <View style={styles.cardDecoration}>
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle2} />
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/wallet')}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <PlusCircle color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/wallet')}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/goals')}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Target color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>New Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/invest')}>
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
              <Zap color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Savings Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {goals.length > 0 ? goals.map(goal => (
            <GoalCard
              key={goal.id}
              title={goal.title}
              target={goal.target_amount}
              current={goal.current_amount}
              color={goal.color}
              emoji={goal.emoji}
            />
          )) : <Text style={styles.emptyStateText}>No active goals yet. Create one!</Text>}
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {transactions.length > 0 ? transactions.map(tx => (
            <TransactionItem
              key={tx.id}
              type={tx.type as 'income' | 'expense' | 'savings'}
              title={tx.title}
              amount={tx.amount}
              time={formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
              icon={tx.icon}
            />
          )) : <Text style={styles.emptyStateText}>No recent transactions.</Text>}
        </View>
      </View>

      {/* Achievement */}
      <View style={styles.achievementCard}>
        <View style={styles.achievementIcon}>
          <Award color="#F59E0B" size={24} />
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>Streak Master! 🔥</Text>
          <Text style={styles.achievementText}>
            You've saved money for 7 days straight!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function GoalCard({ title, target, current, color, emoji }: {
  title: string;
  target: number;
  current: number;
  color: string;
  emoji: string;
}) {
  const progress = target > 0 ? (current / target) * 100 : 0;

  return (
    <View style={[styles.goalCard, { borderLeftColor: color }]}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalEmoji}>{emoji}</Text>
        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <Text style={styles.goalAmount}>${current.toLocaleString()}</Text>
      <Text style={styles.goalTarget}>of ${target.toLocaleString()}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
    </View>
  );
}

function TransactionItem({ type, title, amount, time, icon }: {
  type: 'income' | 'expense' | 'savings';
  title: string;
  amount: number;
  time: string;
  icon: string;
}) {
  const isPositive = amount > 0;
  const getColor = () => {
    if (type === 'income') return '#10B981';
    if (type === 'expense') return '#EF4444';
    return '#8B5CF6';
  };

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{icon}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionTime}>{time}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: getColor() }]}>
        {isPositive ? '+' : ''}${Math.abs(amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  balanceContent: {
    zIndex: 1,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  decorationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    right: 40,
    top: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.65,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  goalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalTarget: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionTime: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    width: width - 40,
  },
});
