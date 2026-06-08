import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { Expense } from '../types';

const CATEGORIES = ['Transport', 'Hotel', 'Food', 'Snacks', 'Tickets', 'Guide', 'Emergency', 'Miscellaneous'] as const;

export const AddExpenseScreen = ({ navigation }: any) => {
  const { tours, currentTourId, addExpense } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<Record<string, string>>({});
  const [day, setDay] = useState('1');
  const [category, setCategory] = useState<Expense['category']>('Food');
  

  // By default, split equal among all
  const [splitAmong, setSplitAmong] = useState<string[]>(
    currentTour?.contributors.map(c => c.id) || []
  );

  if (!currentTour) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Tour Selected</Text>
      </View>
    );
  }

  const handleSave = () => {
    const parsedAmount = parseFloat(amount) || 0;
    const parsedPaidBy: Record<string, number> = {};
    let sumPaid = 0;
    
    Object.entries(paidBy).forEach(([id, val]) => {
      const num = parseFloat(val);
      if (num > 0) {
        parsedPaidBy[id] = num;
        sumPaid += num;
      }
    });

    if (!title || parsedAmount <= 0 || Object.keys(parsedPaidBy).length === 0 || splitAmong.length === 0) {
      alert('Please fill out all fields and ensure contributors are added to the tour.');
      return;
    }

    if (Math.abs(sumPaid - parsedAmount) > 0.01) {
      alert('The sum of individual payments must equal the total amount.');
      return;
    }

    addExpense(currentTour.id, {
      tourId: currentTour.id,
      title,
      details: details.trim() || undefined,
      amount: parsedAmount,
      date: new Date().toISOString(),
      day: parseInt(day) || 1,
      category,
      paidBy: parsedPaidBy,
      splitAmong,
      splitType: 'EQUAL'
    });

    navigation.goBack();
  };

  const toggleSplitParticipant = (id: string) => {
    if (splitAmong.includes(id)) {
      setSplitAmong(prev => prev.filter(p => p !== id));
    } else {
      setSplitAmong(prev => [...prev, id]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Add Expense</Text>
      </View>

      {currentTour.contributors.length === 0 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>No contributors found! You must add contributors before adding an expense.</Text>
          <Button title="Add Contributors" onPress={() => navigation.navigate('Contributors')} size="small" style={{marginTop: SPACING.md}} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Expense Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bus Tickets"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Expense Details / Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bus from Dhaka to Sylhet"
          placeholderTextColor={COLORS.textMuted}
          value={details}
          onChangeText={setDetails}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Amount (৳)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Day (1 to {currentTour.days})</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          value={day}
          onChangeText={setDay}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillContainer}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.pill, category === cat && styles.pillActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Paid By</Text>
        {currentTour.contributors.map(c => (
          <View key={c.id} style={{flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm}}>
            <Text style={{flex: 1, color: COLORS.text, fontSize: 16}}>{c.name}</Text>
            <TextInput
              style={[styles.input, {flex: 1, paddingVertical: SPACING.sm}]}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={paidBy[c.id] || ''}
              onChangeText={(val) => setPaidBy(prev => ({...prev, [c.id]: val}))}
            />
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Split Equally Among</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillContainer}>
          {currentTour.contributors.map(c => (
            <TouchableOpacity 
              key={c.id} 
              style={[styles.pill, splitAmong.includes(c.id) && styles.pillActive]}
              onPress={() => toggleSplitParticipant(c.id)}
            >
              <Text style={[styles.pillText, splitAmong.includes(c.id) && styles.pillTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Button title="Save Expense" onPress={handleSave} style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxl }} />
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backBtn: {
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  pillContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  pillTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.lg,
  },
  warningText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
  },
});
