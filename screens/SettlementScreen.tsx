import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { SettlementWalletIcon, TransferArrowBadgeIcon } from '../components/PremiumIcons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  Check,
} from 'lucide-react-native';
import { isSettlementExpense } from '../utils/share';

export const SettlementScreen = ({ navigation }: any) => {
  const { tours, currentTourId, addExpense } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  if (!currentTour) {
    return (
      <View style={styles.container}>
        <View style={[styles.desktopWrapper, { padding: SPACING.md, flex: 1, justifyContent: 'center' }]}>
          <View style={{ marginBottom: SPACING.md }}>
            <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
          </View>
          <View style={styles.emptyContainer}>
            <SettlementWalletIcon size={46} />
            <Text style={styles.emptyTitle}>No Tour Selected</Text>
            <Text style={styles.emptySubtitle}>Create a tour first to view and settle debt balances.</Text>
            <Button 
              title="Create New Tour" 
              onPress={() => navigation.navigate('CreateTour')}
              style={{ marginTop: SPACING.lg }}
            />
          </View>
        </View>
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
    Object.entries(expense.paidBy || {}).forEach(([id, amt]) => {
      if (paidAmounts[id] !== undefined) {
        paidAmounts[id] += amt;
      }
    });

    if (expense.splitValues && Object.keys(expense.splitValues).length > 0) {
      Object.entries(expense.splitValues).forEach(([id, cost]) => {
        if (overallCosts[id] !== undefined) {
          overallCosts[id] += cost;
        }
      });
    } else if (expense.splitAmong && expense.splitAmong.length > 0) {
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(id => {
        if (overallCosts[id] !== undefined) {
          overallCosts[id] += splitAmount;
        }
      });
    }
  });

  currentTour.contributors.forEach(c => {
    balances[c.id] = paidAmounts[c.id] - overallCosts[c.id];
  });

  // Calculate optimal debt transactions
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

  const debtorsCopy = debtors.map(d => ({ ...d }));
  const creditorsCopy = creditors.map(c => ({ ...c }));

  while (i < debtorsCopy.length && j < creditorsCopy.length) {
    const debtor = debtorsCopy[i];
    const creditor = creditorsCopy[j];
    
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

  const handleSettle = (fromId: string, toId: string, amount: number) => {
    const fromName = getContributorName(fromId);
    const toName = getContributorName(toId);
    const title = `Debt Settlement: ${fromName} to ${toName}`;

    addExpense(currentTour.id, {
      tourId: currentTour.id,
      title,
      amount,
      day: 1,
      category: 'Miscellaneous',
      paidBy: { [fromId]: amount },
      splitAmong: [toId],
      splitType: 'EQUAL',
      paymentType: 'EXACT',
      paymentValues: { [fromId]: amount },
      date: new Date().toISOString()
    });
  };

  const completedSettlements = currentTour.expenses.filter(e => isSettlementExpense(e));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, width: '100%' }}>
              <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
              <TouchableOpacity 
                onPress={() => navigation.navigate('Landing')} 
                activeOpacity={0.75} 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: `${COLORS.primary}35`,
                  backgroundColor: `${COLORS.primary}12`,
                  flexShrink: 0,
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary }} />
                <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.8 }}>BUDGETX</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.title} numberOfLines={1}>Settlements</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  Net financial balance and optimal debts for {currentTour.name}
                </Text>
              </View>
            </View>
          </View>

          {currentTour.contributors.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Add contributors to calculate settlement balances.</Text>
            </View>
          ) : (
            <>
              {/* Member Balances & Shares */}
              <Text style={styles.sectionTitle}>Individual Net Balances</Text>
              
              <View style={styles.membersGrid}>
                {currentTour.contributors.map((c, idx) => {
                  const balance = balances[c.id] || 0;
                  const paid = paidAmounts[c.id] || 0;
                  const cost = overallCosts[c.id] || 0;
                  const isOwed = balance > 0.01;
                  const isOwes = balance < -0.01;
                  const statusColor = isOwed ? COLORS.success : isOwes ? COLORS.danger : COLORS.textMuted;
                  
                  return (
                    <View key={c.id} style={styles.memberCard}>
                      <View style={styles.memberHeader}>
                        <View style={styles.memberIdentity}>
                          <View style={[styles.avatarBox, { backgroundColor: `${statusColor}18` }]}>
                            <Text style={[styles.avatarLetter, { color: statusColor }]}>
                              {c.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.memberName}>{c.name}</Text>
                        </View>

                        <View style={[
                          styles.balanceBadge,
                          isOwed && styles.balanceBadgeOwed,
                          isOwes && styles.balanceBadgeOwes,
                          !isOwed && !isOwes && styles.balanceBadgeSettled,
                        ]}>
                          <Text style={[styles.balanceBadgeText, { color: statusColor }]}>
                            {isOwed 
                              ? `+${formatCurrency(balance)}` 
                              : isOwes 
                                ? `-${formatCurrency(Math.abs(balance))}` 
                                : 'Settled'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.memberDivider} />

                      <View style={styles.memberDetailsRow}>
                        <View style={styles.detailCol}>
                          <Text style={styles.detailLabel}>Total Paid</Text>
                          <Text style={styles.detailValuePaid}>{formatCurrency(paid)}</Text>
                        </View>
                        <View style={styles.detailCol}>
                          <Text style={styles.detailLabel}>Trip Share (Cost)</Text>
                          <Text style={styles.detailValueCost}>{formatCurrency(cost)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* How to Settle Up */}
              {transactions.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                    Optimized Settlement Transactions
                  </Text>
                  
                  <View style={styles.settlementCard}>
                    {transactions.map((t, idx) => (
                      <View key={`trx-${idx}`} style={[
                        styles.transactionRow,
                        idx < transactions.length - 1 && styles.transactionRowBorder
                      ]}>
                        <View style={styles.transactionFlow}>
                          <View style={styles.transferParty}>
                            <Text style={styles.partyName}>{getContributorName(t.from)}</Text>
                            <Text style={styles.partyRole}>pays</Text>
                          </View>
                          
                          <View style={styles.transferIconBox}>
                            <TransferArrowBadgeIcon size={24} />
                          </View>

                          <View style={styles.transferParty}>
                            <Text style={styles.partyName}>{getContributorName(t.to)}</Text>
                            <Text style={styles.partyRole}>receives</Text>
                          </View>
                        </View>

                        <View style={styles.transactionAction}>
                          <Text style={styles.transactionAmount}>
                            {formatCurrency(t.amount)}
                          </Text>
                          
                          <TouchableOpacity 
                            onPress={() => handleSettle(t.from, t.to, t.amount)}
                            style={styles.settleBtn}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.settleBtnText}>Mark Settled</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
              
              {/* Fully Settled Celebration Card (No Emojis) */}
              {transactions.length === 0 && currentTour.expenses.length > 0 && (
                <View style={styles.allSettledCard}>
                  <View style={styles.allSettledIconWrap}>
                    <ShieldCheck color={COLORS.primary} size={28} />
                  </View>
                  <Text style={styles.allSettledTitle}>All Balances Clear</Text>
                  <Text style={styles.allSettledSubtitle}>
                    All participant expenses and group debts are fully balanced.
                  </Text>
                </View>
              )}

              {/* Completed Settlements Log */}
              {completedSettlements.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                    Settlement Records ({completedSettlements.length})
                  </Text>
                  <View style={styles.historyCard}>
                    {completedSettlements.map((s, idx) => (
                      <View 
                        key={s.id} 
                        style={[
                          styles.historyRow, 
                          idx < completedSettlements.length - 1 && styles.historyRowBorder
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.historyTitle}>{s.title}</Text>
                          <Text style={styles.historyDate}>
                            {new Date(s.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </View>
                        <View style={styles.historyRight}>
                          <Text style={styles.historyAmount}>
                            {formatCurrency(s.amount)}
                          </Text>
                          <View style={styles.clearedBadge}>
                            <Check color={COLORS.primary} size={11} strokeWidth={3} />
                            <Text style={styles.clearedBadgeText}>CLEARED</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}

            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 130, // Space for floating bottom tab bar
  },
  desktopWrapper: {
    width: '100%',
    maxWidth: 880,
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },

  // Members Grid
  membersGrid: {
    gap: SPACING.sm,
  },
  memberCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.82)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  balanceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  balanceBadgeOwed: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.3)',
  },
  balanceBadgeOwes: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  balanceBadgeSettled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  balanceBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  memberDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: SPACING.sm,
  },
  memberDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValuePaid: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  detailValueCost: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Settlement Card
  settlementCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  transactionFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    flex: 1,
  },
  transferParty: {
    minWidth: 80,
  },
  partyName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  partyRole: {
    fontSize: 11,
    color: COLORS.textDim,
  },
  transferIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionAction: {
    alignItems: 'flex-end',
    gap: 6,
    paddingLeft: SPACING.sm,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  settleBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
  },
  settleBtnText: {
    color: COLORS.primaryTextOnFill,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // All Settled Card
  allSettledCard: {
    backgroundColor: 'rgba(23, 30, 45, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.3)',
    borderTopColor: 'rgba(56, 229, 134, 0.45)',
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  allSettledIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  allSettledTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  allSettledSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // History Log Card
  historyCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  historyTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyDate: {
    fontSize: 11.5,
    color: COLORS.textDim,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clearedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  clearedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    maxWidth: 320,
  },
  emptyCard: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
  },
});
