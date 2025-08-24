import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  Plus,
  Banknote,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Database } from '../../lib/supabase';
import { useFocusEffect } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';

type Card = Database['public']['Tables']['cards']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

const CARD_GRADIENTS: { [key: string]: string[] } = {
  'Spending Card': ['#8B5CF6', '#EC4899'],
  'Savings Card': ['#10B981', '#059669'],
  'Default': ['#374151', '#4B5563'],
};

export default function WalletScreen() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id);
      if (cardsError) throw cardsError;
      setCards(cardsData || []);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', 'Failed to fetch wallet data.');
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
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity style={styles.addCardButton}>
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} showBalance={showBalance} />
          ))}
          <AddCardButton />
        </ScrollView>
      </View>

      {/* Balance Visibility Toggle */}
      <View style={styles.balanceToggle}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowBalance(!showBalance)}
        >
          {showBalance ? (
            <EyeOff color="#9CA3AF" size={20} />
          ) : (
            <Eye color="#9CA3AF" size={20} />
          )}
          <Text style={styles.toggleText}>
            {showBalance ? 'Hide Balance' : 'Show Balance'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <ArrowDownLeft color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Receive</Text>
            <Text style={styles.actionSubtitle}>Get money from friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Send</Text>
            <Text style={styles.actionSubtitle}>Transfer to anyone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Banknote color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Add Cash</Text>
            <Text style={styles.actionSubtitle}>Top up your wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <Text style={styles.emptyStateText}>No transactions yet.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function CardComponent({ card, showBalance }: { card: Card; showBalance: boolean }) {
  const gradient = CARD_GRADIENTS[card.card_name] || CARD_GRADIENTS['Default'];
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{card.card_type}</Text>
        <TouchableOpacity>
          <MoreHorizontal color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{card.card_name}</Text>
        <Text style={styles.cardBalance}>
          {showBalance ? `$${card.balance.toLocaleString()}` : '••••••'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardNumber}>{card.card_number}</Text>
        <CreditCard color="rgba(255, 255, 255, 0.8)" size={32} />
      </View>

      <View style={styles.cardDecoration}>
        <View style={styles.decorationDot} />
        <View style={[styles.decorationDot, { marginLeft: 20, opacity: 0.6 }]} />
        <View style={[styles.decorationDot, { marginLeft: 40, opacity: 0.3 }]} />
      </View>
    </LinearGradient>
  );
}

function AddCardButton() {
  return (
    <TouchableOpacity style={styles.addCard}>
      <View style={styles.addCardContent}>
        <Plus color="#9CA3AF" size={32} />
        <Text style={styles.addCardText}>Add New Card</Text>
      </View>
    </TouchableOpacity>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.amount > 0;

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
        <Text style={styles.transactionTime}>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}</Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: isPositive ? '#10B981' : '#ffffff' }
        ]}>
          {isPositive ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <Text style={styles.categoryText}>{transaction.category}</Text>
      </View>
    </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addCardButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsSection: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  card: {
    width: 300,
    height: 180,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBalance: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    flexDirection: 'row',
  },
  decorationDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addCard: {
    width: 300,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  addCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  balanceToggle: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
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
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  transactionMerchant: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionTime: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
