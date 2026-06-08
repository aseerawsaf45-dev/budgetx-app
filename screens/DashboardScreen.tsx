import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Button } from '../components/Button';

export const DashboardScreen = ({ navigation }: any) => {
  const { tours, currentTourId, setCurrentTourId } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  if (!currentTour) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Tour Selected</Text>
        <Text style={styles.emptySubtitle}>Create a new tour or select an existing one to get started.</Text>
        <Button 
          title="Create New Tour" 
          onPress={() => navigation.navigate('CreateTour')}
          icon={<Plus color={COLORS.text} size={20} />}
        />
      </View>
    );
  }

  const totalExpense = currentTour.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = currentTour.totalBudget - totalExpense;
  const costPerPerson = currentTour.estimatedParticipants > 0 ? totalExpense / currentTour.estimatedParticipants : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{currentTour.name}</Text>
      </View>

      {tours.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tourSelector}>
          {tours.map(t => (
            <Text 
              key={t.id} 
              style={[styles.tourTab, currentTourId === t.id && styles.tourTabActive]}
              onPress={() => setCurrentTourId(t.id)}
            >
              {t.name}
            </Text>
          ))}
          <Text 
            style={[styles.tourTab, { color: COLORS.primary }]}
            onPress={() => navigation.navigate('CreateTour')}
          >
            + New Tour
          </Text>
        </ScrollView>
      )}
      
      <LinearGradient
        colors={[COLORS.surfaceLight, COLORS.surface]}
        style={styles.card}
      >
        <Text style={styles.cardLabel}>Total Budget</Text>
        <Text style={styles.cardValue}>{formatCurrency(currentTour.totalBudget)}</Text>
      </LinearGradient>

      <View style={styles.row}>
        <LinearGradient colors={[COLORS.surfaceLight, COLORS.surface]} style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Total Expenses</Text>
          <Text style={[styles.cardValue, { color: COLORS.danger }]}>{formatCurrency(totalExpense)}</Text>
        </LinearGradient>

        <LinearGradient colors={[COLORS.surfaceLight, COLORS.surface]} style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Remaining</Text>
          <Text style={[styles.cardValue, { color: remainingBudget >= 0 ? COLORS.success : COLORS.danger }]}>
            {formatCurrency(remainingBudget)}
          </Text>
        </LinearGradient>
      </View>

      <LinearGradient colors={[COLORS.surfaceLight, COLORS.surface]} style={styles.card}>
        <Text style={styles.cardLabel}>Cost Per Person</Text>
        <Text style={styles.cardValue}>{formatCurrency(costPerPerson)}</Text>
        <Text style={styles.cardSubValue}>Based on {currentTour.estimatedParticipants} participants</Text>
      </LinearGradient>
      
      <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
        <Button 
          title="Add Expense" 
          onPress={() => navigation.navigate('AddExpense')}
        />
        <Button 
          title="Manage Contributors" 
          variant="outline"
          onPress={() => navigation.navigate('Contributors')}
        />
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tourSelector: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
  },
  tourTab: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginRight: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  tourTabActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfCard: {
    flex: 1,
  },
  cardLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  cardValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubValue: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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
