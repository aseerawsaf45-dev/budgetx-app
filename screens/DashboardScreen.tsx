import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Trash2, ArrowUpRight, ShieldCheck, Activity, LineChart, Save, Clock, Users, Receipt } from 'lucide-react-native';
import { Button } from '../components/Button';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export const DashboardScreen = ({ navigation }: any) => {
  const { tours, currentTourId, setCurrentTourId, deleteTour } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this tour?')) {
        deleteTour(currentTour!.id);
      }
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Delete Tour', 'Are you sure you want to delete this tour?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTour(currentTour!.id) }
      ]);
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
          icon={<Plus color={COLORS.background} size={20} />}
        />
      </View>
    );
  }

  const totalExpense = currentTour.expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Record<string, number> = {};
  currentTour.expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categories = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    amount: categoryTotals[cat],
    percent: totalExpense > 0 ? (categoryTotals[cat] / totalExpense) * 100 : 0,
    color: [COLORS.primary, '#6B8CFF', '#FFD66B', '#FF5C74', '#b6c4ff'][index % 5]
  })).sort((a,b) => b.amount - a.amount);

  const contributorShares: Record<string, number> = {};
  currentTour.contributors.forEach(c => contributorShares[c.id] = 0);
  currentTour.expenses.forEach(e => {
    if (e.splitAmong && e.splitAmong.length > 0) {
      const share = e.amount / e.splitAmong.length;
      e.splitAmong.forEach(id => {
        if (contributorShares[id] !== undefined) {
          contributorShares[id] += share;
        }
      });
    }
  });
  
  const contributorData = currentTour.contributors.map((c, index) => {
    const share = contributorShares[c.id] || 0;
    return {
      id: c.id,
      name: c.name,
      share,
      percent: totalExpense > 0 ? (share / totalExpense) * 100 : 0,
      color: [COLORS.primary, '#6B8CFF', '#FFD66B', '#FF5C74', '#b6c4ff'][index % 5]
    };
  }).sort((a,b) => b.share - a.share);

  const balances: Record<string, number> = {};
  currentTour.contributors.forEach(c => balances[c.id] = 0);
  currentTour.expenses.forEach(e => {
    Object.keys(e.paidBy).forEach(id => {
      if (balances[id] !== undefined) {
        balances[id] += e.paidBy[id];
      }
    });
  });
  Object.keys(contributorShares).forEach(id => {
    if (balances[id] !== undefined) {
      balances[id] -= contributorShares[id];
    }
  });

  const unsettledAmount = Object.values(balances).reduce((sum, bal) => bal > 1 ? sum + bal : sum, 0);
  const pendingCount = Object.values(balances).filter(bal => Math.abs(bal) > 1).length;

  return (
    <LinearGradient colors={['#040506', '#09100d']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Area */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>©Aseer Awsaf</Text>
            <Text style={styles.headerSubtitle}>{currentTour.name}</Text>
          </View>
          <View style={styles.headerActions}>
             <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
               <Trash2 color={COLORS.danger} size={20} />
             </TouchableOpacity>
          </View>
        </View>

        {tours.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tourSelector}>
            {tours.map(t => (
              <TouchableOpacity 
                key={t.id} 
                style={[styles.tourTabContainer, currentTourId === t.id && styles.tourTabContainerActive]}
                onPress={() => setCurrentTourId(t.id)}
              >
                <Text style={[styles.tourTab, currentTourId === t.id && styles.tourTabActive]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.tourTabContainer, { borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' }]}
              onPress={() => navigation.navigate('CreateTour')}
            >
              <Text style={[styles.tourTab, { color: COLORS.text }]}>
                + New Tour
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        
        {/* Main Bento Grid */}
        <View style={isMobile ? styles.bentoMobile : styles.bentoDesktop}>
          
          {/* Main Balance Card */}
          <BlurView intensity={20} tint="dark" style={[styles.glassCard, isMobile ? {} : { flex: 2 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>TOTAL EXPENSES</Text>
              <ArrowUpRight color={COLORS.primary} size={20} />
            </View>
            <Text style={styles.balanceValue}>{formatCurrency(totalExpense)}</Text>
          </BlurView>

          {/* Tour Info Bento Grid Side */}
          <View style={[styles.bentoSide, isMobile ? {} : { flex: 1 }]}>
            <BlurView intensity={20} tint="dark" style={[styles.glassCard, { flex: 1, marginBottom: SPACING.md }]}>
               <View style={styles.cardHeader}>
                 <Users color={COLORS.primary} size={16} />
                 <Text style={styles.cardLabelSmall}>TOUR DETAILS</Text>
               </View>
               <Text style={styles.insightText}>{currentTour.contributors.length} Participants</Text>
               <Text style={[styles.insightText, { fontSize: 14, color: COLORS.textMuted, marginTop: 4 }]}>{currentTour.days} Days Duration</Text>
            </BlurView>
            <BlurView intensity={20} tint="dark" style={[styles.glassCard, { flex: 1 }]}>
               <View style={styles.cardHeader}>
                 <Receipt color={COLORS.primary} size={16} />
                 <Text style={styles.cardLabelSmall}>PENDING SETTLEMENTS</Text>
               </View>
               <Text style={styles.insightText}>
                 {currentTour.expenses.length > 0 ? formatCurrency(unsettledAmount) : 'No expenses'}
               </Text>
               {currentTour.expenses.length > 0 && (
                 <Text style={[styles.insightText, { fontSize: 14, color: COLORS.textMuted, marginTop: 4 }]}>
                   {unsettledAmount > 1 ? `${pendingCount} people to settle` : 'All settled!'}
                 </Text>
               )}
            </BlurView>
          </View>
        </View>

        {/* Expenses Category Breakdown */}
        {totalExpense > 0 && (
          <BlurView intensity={20} tint="dark" style={styles.simulatorCard}>
             <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>EXPENSE BREAKDOWN</Text>
             </View>

             {/* Stacked Bar */}
             <View style={styles.stackedBarContainer}>
               {categories.map((cat, i) => (
                 <View 
                   key={i} 
                   style={[
                     styles.stackedBarSegment, 
                     { width: `${cat.percent}%`, backgroundColor: cat.color },
                     i === 0 && { borderTopLeftRadius: RADIUS.full, borderBottomLeftRadius: RADIUS.full },
                     i === categories.length - 1 && { borderTopRightRadius: RADIUS.full, borderBottomRightRadius: RADIUS.full },
                   ]} 
                 />
               ))}
             </View>

             {/* Legend */}
             <View style={styles.legendContainer}>
               {categories.map((cat, i) => (
                 <View key={i} style={styles.legendItem}>
                   <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                   <View>
                     <Text style={styles.legendName}>{cat.name} ({Math.round(cat.percent)}%)</Text>
                     <Text style={styles.legendAmount}>{formatCurrency(cat.amount)}</Text>
                   </View>
                 </View>
               ))}
             </View>
          </BlurView>
        )}

        {/* Individual Cost Breakdown */}
        {totalExpense > 0 && currentTour.contributors.length > 0 && (
          <BlurView intensity={20} tint="dark" style={styles.simulatorCard}>
             <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>INDIVIDUAL COST (SHARE)</Text>
             </View>

             <View style={styles.barsContainer}>
               {contributorData.map((c, i) => (
                 <View key={c.id} style={styles.barRow}>
                   <View style={styles.barHeader}>
                     <Text style={styles.barName}>{c.name}</Text>
                     <Text style={styles.barAmount}>{formatCurrency(c.share)}</Text>
                   </View>
                   <View style={styles.barTrack}>
                     <View style={[styles.barFill, { width: `${Math.max(1, c.percent)}%`, backgroundColor: c.color }]} />
                   </View>
                 </View>
               ))}
             </View>
          </BlurView>
        )}
        
        <View style={styles.actionsContainer}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteBtn: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: RADIUS.full,
  },
  tourSelector: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
  },
  tourTabContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tourTabContainerActive: {
    backgroundColor: 'rgba(74, 243, 124, 0.1)',
    borderColor: 'rgba(74, 243, 124, 0.3)',
  },
  tourTab: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tourTabActive: {
    color: COLORS.primary,
  },
  bentoDesktop: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  bentoMobile: {
    flexDirection: 'column',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  bentoSide: {
    flexDirection: 'column',
  },
  glassCard: {
    backgroundColor: 'rgba(21, 24, 30, 0.65)',
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    borderRightColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
  },
  simulatorCard: {
    backgroundColor: 'rgba(21, 24, 30, 0.65)',
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    borderRightColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cardLabelSmall: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  balanceValue: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -1,
  },
  balanceSub: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: SPACING.sm,
  },
  historicalText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  insightText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '500',
    marginTop: SPACING.sm,
  },
  totalBadge: {
    backgroundColor: 'rgba(74, 243, 124, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(74, 243, 124, 0.3)',
  },
  totalText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  stackedBarContainer: {
    flexDirection: 'row',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.full,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  stackedBarSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    width: '45%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 2,
  },
  legendName: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  legendAmount: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  barsContainer: {
    gap: SPACING.md,
  },
  barRow: {
    marginBottom: SPACING.xs,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  barName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  barAmount: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  actionsContainer: {
    gap: SPACING.md, 
    marginTop: SPACING.xl,
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
  }
});
