import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';

export const DayWiseScreen = ({ navigation }: any) => {
  const { tours, currentTourId } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  if (!currentTour) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Tour Selected</Text>
        <Text style={styles.emptySubtitle}>Create a tour first to add expenses.</Text>
        <Button 
          title="Create New Tour" 
          onPress={() => navigation.navigate('CreateTour')}
        />
      </View>
    );
  }

  // Group expenses by day
  const days = Array.from({ length: currentTour.days }, (_, i) => i + 1);
  const expensesByDay = days.map(day => ({
    day,
    expenses: currentTour.expenses.filter(e => e.day === day),
    total: currentTour.expenses.filter(e => e.day === day).reduce((sum, e) => sum + e.amount, 0)
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Day-wise Expenses</Text>
        <Button size="small" title="Add Expense" onPress={() => navigation.navigate('AddExpense')} />
      </View>

      {expensesByDay.map(({ day, expenses, total }) => (
        <View key={day} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>Day {day}</Text>
            <Text style={styles.dayTotal}>{formatCurrency(total)}</Text>
          </View>
          
          {expenses.length === 0 ? (
            <Text style={styles.noExpenseText}>No expenses for this day.</Text>
          ) : (
            expenses.map(expense => (
              <View key={expense.id} style={styles.expenseItem}>
                <View>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseCategory}>
                    {expense.category} • Paid by {Object.keys(expense.paidBy).map(id => currentTour.contributors.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dayTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  expenseTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  expenseCategory: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  expenseDetails: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  expenseAmount: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  noExpenseText: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.sm,
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
});
