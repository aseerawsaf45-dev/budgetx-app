import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import {
  getPremiumCategoryIcon,
  TransferArrowBadgeIcon,
  CoinStackIcon,
} from '../components/PremiumIcons';
import { ThematicHeroPanorama, ThematicBackgroundElements } from '../components/ThematicScenery';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Tour } from '../types';
import { formatCurrency } from '../utils/currency';
import { decodeTourData } from '../utils/share';
import {
  FolderDown,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';

export const SharedTourScreen = ({ route, navigation }: any) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { addTour, setCurrentTourId, tours } = useStore();
  const [sharedTour, setSharedTour] = useState<Tour | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let data = route.params?.data;

    if (!data && Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const fullHref = window.location.href;
        const match = fullHref.match(/[?&#]data=([^&#\s]+)/);
        if (match && match[1]) {
          data = decodeURIComponent(match[1]);
        }
        if (!data) {
          const searchParams = new URLSearchParams(window.location.search);
          data = searchParams.get('data');
        }
        if (!data && window.location.hash.includes('data=')) {
          const hashIdx = window.location.hash.indexOf('?');
          if (hashIdx !== -1) {
            const hashParams = new URLSearchParams(window.location.hash.substring(hashIdx + 1));
            data = hashParams.get('data');
          }
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
    }

    if (data) {
      const tour = decodeTourData(data);
      if (tour) {
        setSharedTour(tour);
        setError('');
      } else {
        setError('Failed to load shared tour. The link might be invalid or corrupted.');
      }
    } else {
      setError('No tour data found in the link.');
    }
  }, [route.params?.data]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <BackButton fallbackScreen="MainTabs" fallbackTab="Home" style={{ marginBottom: SPACING.md }} />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Go to Dashboard" 
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} 
          style={{ marginTop: SPACING.lg }} 
        />
      </View>
    );
  }

  if (!sharedTour) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: COLORS.textMuted }}>Loading shared tour details...</Text>
      </View>
    );
  }

  const handleImport = () => {
    const existingTour = tours.find(t => t.id === sharedTour.id);
    if (existingTour) {
      setCurrentTourId(existingTour.id);
      navigation.navigate('MainTabs', { screen: 'Home' });
      return;
    }

    const { id, ...tourData } = sharedTour;
    addTour(tourData);
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const tourDays = sharedTour.days || 1;
  const tourExpenses = sharedTour.expenses || [];
  const tourContributors = sharedTour.contributors || [];

  const days = Array.from({ length: tourDays }, (_, i) => i + 1);
  const expensesByDay = days.map(day => ({
    day,
    expenses: tourExpenses.filter(e => e.day === day),
    total: tourExpenses.filter(e => e.day === day).reduce((sum, e) => sum + e.amount, 0)
  }));

  const paidAmounts: Record<string, number> = {};
  const overallCosts: Record<string, number> = {};
  const balances: Record<string, number> = {};
  
  tourContributors.forEach(c => {
    paidAmounts[c.id] = 0;
    overallCosts[c.id] = 0;
    balances[c.id] = 0;
  });

  tourExpenses.forEach(expense => {
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

  tourContributors.forEach(c => {
    balances[c.id] = paidAmounts[c.id] - overallCosts[c.id];
  });

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
    return sharedTour.contributors.find(c => c.id === id)?.name || 'Unknown';
  };

  const totalSharedExpense = sharedTour.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={styles.container}>
      <ThematicBackgroundElements />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Top Brand Banner & Back Action */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
            <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
            <View style={[styles.topBadge, { marginBottom: 0 }]}>
              <Sparkles color={COLORS.primary} size={15} />
              <Text style={styles.topBadgeText}>SHARED ITINERARY PREVIEW</Text>
            </View>
          </View>

          {/* Thematic Scenic Panorama Hero Banner */}
          <ThematicHeroPanorama
            tourTitle={sharedTour.name}
            destination={sharedTour.destination}
            days={sharedTour.days}
            height={isMobile ? 220 : 275}
            showOverlayText={true}
          />

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <MapPin color={COLORS.primary} size={14} />
                <Text style={styles.metaChipText}>{sharedTour.destination}</Text>
              </View>
              <View style={styles.metaChip}>
                <Calendar color={COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>{sharedTour.days} Days</Text>
              </View>
              <View style={styles.metaChip}>
                <Users color={COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>{sharedTour.contributors.length} People</Text>
              </View>
              <View style={styles.metaChip}>
                <Receipt color={COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>{sharedTour.expenses.length} Records</Text>
              </View>
              <View style={styles.metaChip}>
                <TrendingUp color={sharedTour.totalBudget > 0 ? COLORS.primary : COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>
                  {sharedTour.totalBudget > 0 ? `Cap: ${formatCurrency(sharedTour.totalBudget)}` : 'Budget: Unset'}
                </Text>
              </View>
            </View>

            <View style={styles.heroFooter}>
              <View>
                <Text style={styles.totalLabel}>TOTAL TRIP EXPENSES</Text>
                <Text style={styles.totalAmount}>{formatCurrency(totalSharedExpense)}</Text>
              </View>
              <Button 
                title="Import to BudgetX" 
                onPress={handleImport}
                icon={<FolderDown color={COLORS.primaryTextOnFill} size={18} strokeWidth={2.4} />}
              />
            </View>
          </View>

          {/* Day-by-Day Breakdown */}
          <Text style={styles.sectionHeader}>Trip Expenses by Day</Text>
          
          {expensesByDay.map(({ day, expenses, total }) => (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>Day {day}</Text>
                <Text style={styles.dayTotal}>{formatCurrency(total)}</Text>
              </View>
              
              {expenses.length === 0 ? (
                <Text style={styles.noExpenseText}>No expenses for Day {day}</Text>
              ) : (
                expenses.map((expense, idx) => (
                  <View 
                    key={expense.id} 
                    style={[
                      styles.expenseItem,
                      idx < expenses.length - 1 && styles.expenseItemBorder
                    ]}
                  >
                    <View style={styles.catIconWrap}>
                      {getPremiumCategoryIcon(expense.category, 18)}
                    </View>
                    <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseCategory}>
                        {expense.category} • Paid by {Object.keys(expense.paidBy).map(id => 
                          sharedTour.contributors.find(c => c.id === id)?.name
                        ).filter(Boolean).join(', ') || 'Unknown'}
                      </Text>
                      {expense.details ? (
                        <Text style={styles.expenseDetails}>{expense.details}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  </View>
                ))
              )}
            </View>
          ))}

          {/* Settlement Preview */}
          <Text style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
            Settlement Status
          </Text>

          {transactions.length > 0 ? (
            <View style={styles.settlementCard}>
              {transactions.map((t, idx) => (
                <View 
                  key={`trx-${idx}`} 
                  style={[
                    styles.balanceItem,
                    idx < transactions.length - 1 && styles.balanceItemBorder
                  ]}
                >
                  <View style={styles.transferFlow}>
                    <Text style={styles.settleParty}>{getContributorName(t.from)}</Text>
                    <TransferArrowBadgeIcon size={18} />
                    <Text style={styles.settleParty}>{getContributorName(t.to)}</Text>
                  </View>
                  <Text style={styles.settleAmount}>{formatCurrency(t.amount)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.allSettledCard}>
              <ShieldCheck color={COLORS.primary} size={24} />
              <Text style={styles.allSettledText}>All shared balances are completely settled.</Text>
            </View>
          )}

          <Button 
            title="Import to BudgetX" 
            size="large"
            onPress={handleImport}
            icon={<FolderDown color={COLORS.primaryTextOnFill} size={18} strokeWidth={2.4} />}
            style={{ marginTop: SPACING.xl, marginBottom: SPACING.lg }}
          />

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
    paddingBottom: 130,
  },
  desktopWrapper: {
    width: '100%',
    maxWidth: 880,
    marginHorizontal: 'auto',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.danger,
    textAlign: 'center',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  topBadgeText: {
    color: COLORS.primary,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  tourName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  metaChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  totalLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 0.8,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  dayCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dayTotal: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  catIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  expenseItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  expenseTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  expenseCategory: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  expenseDetails: {
    color: COLORS.textDim,
    fontSize: 11.5,
    fontStyle: 'italic',
    marginTop: 2,
  },
  expenseAmount: {
    color: COLORS.text,
    fontSize: 14.5,
    fontWeight: '700',
  },
  noExpenseText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: SPACING.xs,
  },
  settlementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    padding: SPACING.md,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  balanceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  transferFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  settleParty: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  settleAmount: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  allSettledCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(56, 229, 134, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.2)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  allSettledText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
});
