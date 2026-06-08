import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';

export const SettlementScreen = ({ navigation }: any) => {
  const { tours, currentTourId } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  if (!currentTour) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Tour Selected</Text>
        <Text style={styles.emptySubtitle}>Create a tour first to view settlements.</Text>
        <Button 
          title="Create New Tour" 
          onPress={() => navigation.navigate('CreateTour')}
        />
      </View>
    );
  }

  // Calculate balances
  const balances: Record<string, number> = {};
  
  currentTour.contributors.forEach(c => {
    balances[c.id] = 0;
  });

  currentTour.expenses.forEach(expense => {
    // Credit the payers
    Object.entries(expense.paidBy).forEach(([id, amt]) => {
      if (balances[id] !== undefined) {
        balances[id] += amt;
      }
    });

    // Debit the splitters
    if (expense.splitType === 'EQUAL') {
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(id => {
        if (balances[id] !== undefined) {
          balances[id] -= splitAmount;
        }
      });
    } else if (expense.splitType === 'CUSTOM' && expense.customSplit) {
      Object.entries(expense.customSplit).forEach(([id, amount]) => {
        if (balances[id] !== undefined) {
          balances[id] -= amount;
        }
      });
    }
  });

  const getContributorName = (id: string) => {
    return currentTour.contributors.find(c => c.id === id)?.name || 'Unknown';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settlements</Text>
      
      {currentTour.contributors.length === 0 ? (
        <Text style={styles.noData}>Add contributors to see settlements.</Text>
      ) : (
        <View style={styles.card}>
          {Object.entries(balances).map(([id, balance]) => (
            <View key={id} style={styles.balanceItem}>
              <Text style={styles.name}>{getContributorName(id)}</Text>
              <Text style={[
                styles.amount,
                { color: balance >= 0 ? COLORS.success : COLORS.danger }
              ]}>
                {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Simplified Transactions Logic Could Go Here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  noData: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
