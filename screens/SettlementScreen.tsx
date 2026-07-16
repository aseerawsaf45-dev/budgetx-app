import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

export const SettlementScreen = ({ navigation }: any) => {
  const { tours, currentTourId, addExpense } = useStore();
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

  // Calculate balances, overall costs, and total paid per person
  const paidAmounts: Record<string, number> = {};
  const overallCosts: Record<string, number> = {};
  const balances: Record<string, number> = {};
  
  currentTour.contributors.forEach(c => {
    paidAmounts[c.id] = 0;
    overallCosts[c.id] = 0;
    balances[c.id] = 0;
  });

  currentTour.expenses.forEach(expense => {
    // Add to paid amounts
    Object.entries(expense.paidBy).forEach(([id, amt]) => {
      if (paidAmounts[id] !== undefined) {
        paidAmounts[id] += amt;
      }
    });

    // Debit the splitters (always EQUAL now)
    if (expense.splitAmong.length > 0) {
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(id => {
        if (overallCosts[id] !== undefined) {
          overallCosts[id] += splitAmount;
        }
      });
    }
  });

  // Calculate balances: Paid - Cost
  currentTour.contributors.forEach(c => {
    balances[c.id] = paidAmounts[c.id] - overallCosts[c.id];
  });

  // Calculate settlement transactions (who owes whom)
  interface Transaction {
    from: string;
    to: string;
    amount: number;
  }
  const transactions: Transaction[] = [];
  
  const debtors = Object.entries(balances)
    .filter(([_, bal]) => bal < -0.01)
    .map(([id, bal]) => ({ id, amount: Math.abs(bal) }))
    .sort((a, b) => b.amount - a.amount);
    
  const creditors = Object.entries(balances)
    .filter(([_, bal]) => bal > 0.01)
    .map(([id, bal]) => ({ id, amount: bal }))
    .sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const settleAmount = Math.min(debtor.amount, creditor.amount);
    
    transactions.push({
      from: debtor.id,
      to: creditor.id,
      amount: settleAmount
    });
    
    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;
    
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  const getContributorName = (id: string) => {
    return currentTour.contributors.find(c => c.id === id)?.name || 'Unknown';
  };

  const handleSettle = (fromId: string, toId: string, amt: number) => {
    const fromName = getContributorName(fromId);
    const toName = getContributorName(toId);

    const message = `Mark settlement: Did ${fromName} pay ${toName} ${formatCurrency(amt)}?`;
    if (Platform.OS === 'web') {
      if (!window.confirm(message)) {
        return;
      }
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Confirm Settlement', message, [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => submitSettlement(fromId, toId, amt, fromName, toName) 
        }
      ]);
      return;
    }

    submitSettlement(fromId, toId, amt, fromName, toName);
  };

  const submitSettlement = (fromId: string, toId: string, amt: number, fromName: string, toName: string) => {
    addExpense(currentTour.id, {
      tourId: currentTour.id,
      title: `Settlement: ${fromName} ➔ ${toName}`,
      amount: amt,
      date: new Date().toISOString(),
      day: 1,
      category: 'Miscellaneous',
      paidBy: { [fromId]: amt },
      splitAmong: [toId],
      splitType: 'EQUAL'
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settlement Dashboard</Text>
      
      {currentTour.contributors.length === 0 ? (
        <Text style={styles.noData}>Add contributors to see settlements.</Text>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Member Balances & Shares</Text>
          {currentTour.contributors.map(c => {
            const balance = balances[c.id] || 0;
            const paid = paidAmounts[c.id] || 0;
            const cost = overallCosts[c.id] || 0;
            const statusColor = balance > 0.01 ? COLORS.success : balance < -0.01 ? COLORS.danger : COLORS.textMuted;
            
            return (
              <LinearGradient
                key={c.id}
                colors={['#1e1e1e', '#121212']}
                style={styles.memberCard}
              >
                <View style={styles.memberHeader}>
                  <Text style={styles.memberName}>{c.name}</Text>
                  <Text style={[styles.memberBalance, { color: statusColor }]}>
                    {balance > 0.01 ? 'Owed: +' : balance < -0.01 ? 'Owes: ' : 'Settled'}{formatCurrency(Math.abs(balance))}
                  </Text>
                </View>
                <View style={styles.memberDivider} />
                <View style={styles.memberDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Paid</Text>
                    <Text style={[styles.detailValue, { color: COLORS.text }]}>{formatCurrency(paid)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Expense Share (Cost)</Text>
                    <Text style={styles.detailValue}>{formatCurrency(cost)}</Text>
                  </View>
                </View>
              </LinearGradient>
            );
          })}

          {transactions.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>How to Settle Up</Text>
              <LinearGradient colors={['#1e1e1e', '#121212']} style={styles.settlementCard}>
                {transactions.map((t, idx) => (
                  <View key={`trx-${idx}`} style={styles.balanceItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settleText}>
                        <Text style={{fontWeight: 'bold', color: COLORS.text}}>{getContributorName(t.from)}</Text>
                        <Text style={{color: COLORS.textMuted}}> owes </Text>
                        <Text style={{fontWeight: 'bold', color: COLORS.text}}>{getContributorName(t.to)}</Text>
                      </Text>
                      <Text style={[styles.amount, { color: COLORS.danger, marginTop: SPACING.xs }]}>{formatCurrency(t.amount)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleSettle(t.from, t.to, t.amount)}>
                      <LinearGradient
                        colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                        style={styles.settleBtn}
                      >
                        <Text style={styles.settleBtnText}>Settle</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ))}
              </LinearGradient>
            </>
          )}
          
          {transactions.length === 0 && currentTour.expenses.length > 0 && (
            <View style={[styles.settlementCard, { marginTop: SPACING.xl, alignItems: 'center', padding: SPACING.xl }]}>
              <Text style={styles.successText}>Everyone is fully settled! 🎉</Text>
            </View>
          )}
        </>
      )}
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
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  memberCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  memberBalance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  memberDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  settlementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settleText: {
    fontSize: 15,
    flex: 1,
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
  successText: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  settleBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginLeft: SPACING.md,
  },
  settleBtnText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
