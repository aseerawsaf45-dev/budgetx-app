import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Trash2,
  CheckCircle2,
  Plus,
  Compass,
  ArrowRight,
  Coins,
  X,
} from 'lucide-react-native';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { ArchiveVaultIcon } from '../components/PremiumIcons';
import { isSettlementExpense } from '../utils/share';

export const HistoryScreen = ({ navigation }: any) => {
  const { tours, currentTourId, setCurrentTourId, deleteTour } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTours = tours.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q);
  });

  const handleDeleteTour = (tourId: string, tourName: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${tourName}"?`)) {
        deleteTour(tourId);
      }
    } else {
      Alert.alert('Delete Tour', `Are you sure you want to delete "${tourName}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTour(tourId) }
      ]);
    }
  };

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
                <Text style={styles.title} numberOfLines={1}>Tour Archives</Text>
                <Text style={styles.subtitle} numberOfLines={1}>Manage and switch between your trip budgets</Text>
              </View>
            </View>
            <Button 
              size="small" 
              title="New Tour" 
              onPress={() => navigation.navigate('CreateTour')} 
              icon={<Plus color={COLORS.primaryTextOnFill} size={15} strokeWidth={2.4} />}
              style={{ flexShrink: 0 }}
            />
          </View>

          {/* Search Bar */}
          {tours.length > 0 && (
            <View style={styles.searchBar}>
              <Search color={COLORS.textDim} size={16} style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tours by name or destination..."
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
          )}
          
          {filteredTours.length === 0 ? (
            <View style={styles.emptyCard}>
              <ArchiveVaultIcon size={46} />
              <Text style={styles.emptyTitle}>
                {tours.length === 0 ? "No Tours Created Yet" : "No Matching Tours"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {tours.length === 0 
                  ? "Start by creating your first trip itinerary to record expenses."
                  : "Try searching with a different trip name or destination."}
              </Text>
              {tours.length === 0 && (
                <Button 
                  title="Create First Tour" 
                  onPress={() => navigation.navigate('CreateTour')} 
                  style={{ marginTop: SPACING.lg }}
                />
              )}
            </View>
          ) : (
            <View style={styles.toursGrid}>
              {filteredTours.map(tour => {
                const isActive = tour.id === currentTourId;
                const tripExpenses = tour.expenses.filter(e => !isSettlementExpense(e));
                const totalExpense = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
                
                return (
                  <TouchableOpacity 
                    key={tour.id} 
                    style={[styles.tourCard, isActive && styles.tourCardActive]}
                    onPress={() => {
                      setCurrentTourId(tour.id);
                      navigation.navigate('Home');
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' }}>
                          <Text style={styles.tourName}>{tour.name}</Text>
                          {isActive && (
                            <View style={styles.activeBadge}>
                              <View style={styles.activeDot} />
                              <Text style={styles.activeBadgeText}>ACTIVE</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.destinationRow}>
                          <MapPin color={COLORS.primary} size={13} />
                          <Text style={styles.destinationText}>{tour.destination}</Text>
                        </View>
                      </View>

                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteTour(tour.id, tour.name);
                        }}
                        style={styles.deleteBtn}
                        activeOpacity={0.7}
                      >
                        <Trash2 color={COLORS.danger} size={15} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.cardFooter}>
                      <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>EXPENSES</Text>
                        <Text style={styles.metaAmount}>{formatCurrency(totalExpense)}</Text>
                      </View>
                      <View style={styles.metaPillsRow}>
                        <View style={styles.metaPill}>
                          <Calendar color={COLORS.textDim} size={12} />
                          <Text style={styles.metaPillText}>{tour.days} Days</Text>
                        </View>
                        <View style={styles.metaPill}>
                          <Users color={COLORS.textDim} size={12} />
                          <Text style={styles.metaPillText}>{tour.contributors.length} People</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
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
    marginRight: 6,
  },

  // Tour Cards
  toursGrid: {
    gap: SPACING.md,
  },
  tourCard: {
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
  tourCardActive: {
    borderColor: 'rgba(56, 229, 134, 0.45)',
    borderTopColor: 'rgba(56, 229, 134, 0.65)',
    backgroundColor: 'rgba(23, 30, 45, 0.95)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tourName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.3)',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
  activeBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  destinationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaCol: {},
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 0.6,
  },
  metaAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 1,
  },
  metaPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  metaPillText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Empty states
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 320,
    lineHeight: 18,
  },
});
