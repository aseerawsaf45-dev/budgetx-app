import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { MapPin, Calendar, Users } from 'lucide-react-native';

export const HistoryScreen = ({ navigation }: any) => {
  const { tours, setCurrentTourId } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tour History</Text>
      
      {tours.length === 0 ? (
        <Text style={styles.noData}>No tours found. Create one to get started!</Text>
      ) : (
        tours.map(tour => {
          const totalExpense = tour.expenses.reduce((sum, e) => sum + e.amount, 0);
          
          return (
            <TouchableOpacity 
              key={tour.id} 
              style={styles.card}
              onPress={() => {
                setCurrentTourId(tour.id);
                navigation.navigate('Home');
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.tourName}>{tour.name}</Text>
                <Text style={styles.tourCost}>{formatCurrency(totalExpense)}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <MapPin size={16} color={COLORS.textMuted} />
                  <Text style={styles.infoText}>{tour.destination}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Users size={16} color={COLORS.textMuted} />
                  <Text style={styles.infoText}>{tour.contributors.length} Participants</Text>
                </View>
                <View style={styles.infoRow}>
                  <Calendar size={16} color={COLORS.textMuted} />
                  <Text style={styles.infoText}>{tour.days} Days</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  noData: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xxl,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tourCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  cardBody: {
    gap: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 14,
  },
});
