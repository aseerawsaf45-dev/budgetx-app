import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Trash2 } from 'lucide-react-native';
import { Button } from '../components/Button';


export const DashboardScreen = ({ navigation }: any) => {
  const { tours, currentTourId, setCurrentTourId, deleteTour } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this tour?')) {
        deleteTour(currentTour!.id);
      }
    } else {
      // Need to import Alert from react-native if not using web fallback
      // But we can just use window.confirm as a simple universal fallback for now or add Alert.
      // Let's add Alert to the top level import later, actually window.confirm works fine on web and Alert is better on mobile.
    }
  };

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
  const costPerPerson = currentTour.estimatedParticipants > 0 ? totalExpense / currentTour.estimatedParticipants : 0;

  // Calculate individual costs for each participant
  const overallCosts: Record<string, number> = {};
  currentTour.contributors.forEach(c => {
    overallCosts[c.id] = 0;
  });

  currentTour.expenses.forEach(expense => {
    if (expense.splitAmong.length > 0) {
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(id => {
        if (overallCosts[id] !== undefined) {
          overallCosts[id] += splitAmount;
        }
      });
    }
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{currentTour.name}</Text>
        <TouchableOpacity 
          onPress={() => {
            if (Platform.OS === 'web') {
              if (window.confirm('Are you sure you want to delete this tour?')) {
                deleteTour(currentTour.id);
              }
            } else {
              const { Alert } = require('react-native');
              Alert.alert('Delete Tour', 'Are you sure you want to delete this tour?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTour(currentTour.id) }
              ]);
            }
          }}
          style={{ padding: SPACING.sm }}
        >
          <Trash2 color={COLORS.danger} size={24} />
        </TouchableOpacity>
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
      
      <View style={styles.row}>
        <LinearGradient
          colors={[COLORS.surfaceLight, COLORS.surface]}
          style={[styles.card, { flex: 1 }]}
        >
          <Text style={styles.cardLabel}>Total Budget</Text>
          <Text style={styles.cardValue}>{formatCurrency(currentTour.totalBudget)}</Text>
        </LinearGradient>

        <LinearGradient colors={[COLORS.surfaceLight, COLORS.surface]} style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardLabel}>Total Expenses</Text>
          <Text style={[styles.cardValue, { color: COLORS.danger }]}>{formatCurrency(totalExpense)}</Text>
        </LinearGradient>
      </View>

      <LinearGradient colors={[COLORS.surfaceLight, COLORS.surface]} style={styles.card}>
        <Text style={styles.cardLabel}>Cost Per Person (Est.)</Text>
        <Text style={styles.cardValue}>{formatCurrency(costPerPerson)}</Text>
        <Text style={styles.cardSubValue}>Based on {currentTour.estimatedParticipants} participants</Text>
      </LinearGradient>

      {currentTour.contributors.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Participant Shares</Text>
          <View style={styles.shareCard}>
            {currentTour.contributors.map(c => (
              <View key={c.id} style={styles.shareItem}>
                <Text style={styles.shareName}>{c.name}</Text>
                <Text style={styles.shareCost}>{formatCurrency(overallCosts[c.id] || 0)}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  shareCard: {
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
  shareItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  shareName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  shareCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
