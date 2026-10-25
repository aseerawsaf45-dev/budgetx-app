import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import {
  Trash2,
  Search,
  ArrowRight,
  Tag,
  Calendar,
  Receipt,
  Plus,
  Coins,
  Sparkles,
  Utensils,
  Car,
  Hotel,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  X,
} from 'lucide-react-native';
import { CATEGORIES, isSettlementExpense } from '../utils/share';
import { getPremiumCategoryIcon, ExpensesTabIcon } from '../components/PremiumIcons';

const getCategoryIcon = (category: string) => {
  return getPremiumCategoryIcon(category, 18);
};

export const DayWiseScreen = ({ navigation }: any) => {
  const { tours, currentTourId, deleteExpense } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!currentTour) {
    return (
      <View style={styles.container}>
        <View style={[styles.desktopWrapper, { padding: SPACING.md, flex: 1, justifyContent: 'center' }]}>
          <View style={{ marginBottom: SPACING.md }}>
            <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
          </View>
          <View style={styles.emptyContainer}>
            <ExpensesTabIcon size={46} focused={true} />
            <Text style={styles.emptyTitle}>No Active Tour</Text>
            <Text style={styles.emptySubtitle}>
              Please select or create a tour to record and review trip expenses.
            </Text>
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

  const handleDeleteExpense = (expenseId: string, title: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
        deleteExpense(currentTour.id, expenseId);
      }
    } else {
      Alert.alert('Delete Expense', `Are you sure you want to delete "${title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(currentTour.id, expenseId) }
      ]);
    }
  };

  // Filter expenses
  const filteredExpenses = currentTour.expenses.filter(e => {
    const matchesSearch = !searchQuery.trim() || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.details && e.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate real trip total
  const tripExpenses = currentTour.expenses.filter(e => !isSettlementExpense(e));
  const totalTripAmount = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group expenses by day
  const maxDay = Math.max(currentTour.days || 1, ...currentTour.expenses.map(e => e.day || 1));
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const expensesByDay = days.map(day => {
    const dayExpenses = filteredExpenses.filter(e => (e.day || 1) === day);
    const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      day,
      expenses: dayExpenses,
      total: dayTotal,
    };
  });

  const allCategories = ['All', ...CATEGORIES];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1, paddingRight: SPACING.xs }}>
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
                <Text style={styles.title} numberOfLines={1}>Day Ledger</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {currentTour.name} • Total {formatCurrency(totalTripAmount)}
                </Text>
              </View>
            </View>
            <Button
              size="small"
              title="Add"
              onPress={() => navigation.navigate('AddExpense')}
              icon={<Plus color={COLORS.primaryTextOnFill} size={15} strokeWidth={2.4} />}
              style={{ flexShrink: 0 }}
            />
          </View>

          {/* Search Input Bar */}
          <View style={styles.searchBar}>
            <Search color={COLORS.textDim} size={16} style={{ marginLeft: 12 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses, notes, or categories..."
              placeholderTextColor={COLORS.textDim}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
                <X color={COLORS.textMuted} size={14} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Filter Pills Rail */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterRail}
          >
            {allCategories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterPill, isSelected && styles.filterPillActive, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  {cat !== 'All' ? getPremiumCategoryIcon(cat, 14) : null}
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Empty Search Feedback */}
          {filteredExpenses.length === 0 && currentTour.expenses.length > 0 && (
            <View style={styles.emptyFilteredCard}>
              <Text style={styles.emptyFilteredText}>
                No expenses matched "{searchQuery || selectedCategory}".
              </Text>
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                <Text style={styles.resetFilterText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Day Group Cards */}
          {expensesByDay.map(({ day, expenses, total }) => {
            if (expenses.length === 0 && (searchQuery || selectedCategory !== 'All')) {
              return null; // hide empty days when user is actively searching
            }

            return (
              <View key={day} style={styles.dayCard}>
                {/* Day Header */}
                <View style={styles.dayCardHeader}>
                  <View style={styles.dayBadge}>
                    <Calendar color={COLORS.primary} size={13} />
                    <Text style={styles.dayBadgeText}>Day {day}</Text>
                  </View>
                  <Text style={styles.dayTotalAmount}>
                    {formatCurrency(total)}
                  </Text>
                </View>

                {/* Expense Items */}
                {expenses.length === 0 ? (
                  <View style={styles.noExpensesRow}>
                    <Text style={styles.noExpensesText}>No expenses recorded for Day {day}</Text>
                  </View>
                ) : (
                  expenses.map((expense, idx) => {
                    const isSettlement = isSettlementExpense(expense);
                    const isLast = idx === expenses.length - 1;

                    return (
                      <View 
                        key={expense.id} 
                        style={[styles.expenseRow, !isLast && styles.expenseRowBorder]}
                      >
                        <View style={styles.expenseLeft}>
                          <View style={[styles.categoryIconWrap, isSettlement && styles.settlementIconWrap]}>
                            {isSettlement ? (
                              <Coins color={COLORS.primary} size={15} />
                            ) : (
                              getCategoryIcon(expense.category)
                            )}
                          </View>

                          <View style={{ flex: 1, paddingRight: SPACING.xs }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <Text style={styles.expenseTitleText}>{expense.title}</Text>
                              {isSettlement && (
                                <View style={styles.settlementTag}>
                                  <Text style={styles.settlementTagText}>SETTLEMENT</Text>
                                </View>
                              )}
                            </View>

                            <Text style={styles.expenseMetaText}>
                              {expense.category} • Paid by {Object.keys(expense.paidBy || {}).map(id => 
                                currentTour.contributors.find(c => c.id === id)?.name
                              ).filter(Boolean).join(', ') || 'Unknown'}
                              {expense.givingShares && Object.keys(expense.givingShares).length > 0 ? (
                                ` • ${Object.entries(expense.givingShares)
                                  .filter(([pId]) => !expense.paidBy || (expense.paidBy[pId] || 0) > 0)
                                  .map(([pId, bIds]) => {
                                    const pName = currentTour.contributors.find(c => c.id === pId)?.name || 'Someone';
                                    const bNames = (bIds || []).map(bId => currentTour.contributors.find(c => c.id === bId)?.name).filter(Boolean).join(', ');
                                    return bNames ? `${pName} gave ${bNames}'s share` : '';
                                  }).filter(Boolean).join(' | ')}`
                              ) : null}
                            </Text>

                            {expense.details ? (
                              <Text style={styles.expenseNotesText}>{expense.details}</Text>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.expenseRight}>
                          <Text style={[styles.expenseAmountText, isSettlement && styles.settlementAmountText]}>
                            {formatCurrency(expense.amount)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteExpense(expense.id, expense.title)}
                            style={styles.deleteExpenseBtn}
                            activeOpacity={0.7}
                          >
                            <Trash2 color={COLORS.textDim} size={15} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            );
          })}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    color: COLORS.text,
    fontSize: 13.5,
  },
  searchClearBtn: {
    padding: 8,
    marginRight: 4,
  },

  // Filter Rail
  filterRail: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingBottom: SPACING.md,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderColor: 'rgba(56, 229, 134, 0.4)',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterPillTextActive: {
    color: COLORS.primary,
  },

  // Day Card
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
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: SPACING.sm,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  dayTotalAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  // Expense Row
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  expenseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    flex: 1,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settlementIconWrap: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderColor: 'rgba(56, 229, 134, 0.25)',
  },
  expenseTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  settlementTag: {
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xs,
  },
  settlementTagText: {
    color: COLORS.primary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expenseMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  expenseNotesText: {
    fontSize: 11.5,
    color: COLORS.textDim,
    fontStyle: 'italic',
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
    gap: 4,
    paddingLeft: SPACING.sm,
  },
  expenseAmountText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  settlementAmountText: {
    color: COLORS.primary,
  },
  deleteExpenseBtn: {
    padding: 4,
    borderRadius: RADIUS.xs,
  },

  // Empty states
  noExpensesRow: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  noExpensesText: {
    fontSize: 12.5,
    color: COLORS.textDim,
    fontStyle: 'italic',
  },
  emptyFilteredCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyFilteredText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  resetFilterText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
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
});
