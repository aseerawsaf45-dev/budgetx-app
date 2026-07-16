import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Crypto from 'expo-crypto';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react-native';

export const CreateTourScreen = ({ navigation }: any) => {
  const { addTour } = useStore();
  const [destination, setDestination] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [contributorsList, setContributorsList] = useState<string[]>([]);
  const [days, setDays] = useState('1');

  const handleAddParticipant = () => {
    const trimmed = participantName.trim();
    if (!trimmed) return;
    if (contributorsList.includes(trimmed)) {
      alert('Participant already added!');
      return;
    }
    setContributorsList(prev => [...prev, trimmed]);
    setParticipantName('');
  };

  const handleRemoveParticipant = (indexToRemove: number) => {
    setContributorsList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreate = () => {
    if (!destination) {
      alert('Please enter a destination.');
      return;
    }
    
    if (contributorsList.length === 0) {
      alert('Please add at least one participant.');
      return;
    }
    
    const contributors = contributorsList.map(name => ({ id: Crypto.randomUUID(), name }));

    addTour({
      name: destination + ' Tour',
      destination,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      days: parseInt(days) || 1,
      estimatedParticipants: contributors.length,
      totalBudget: 0,
      contributors,
    });

    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Create New Tour</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sylhet"
          placeholderTextColor={COLORS.textMuted}
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Add Participant Name</Text>
        <View style={styles.addParticipantRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="e.g. Alice"
            placeholderTextColor={COLORS.textMuted}
            value={participantName}
            onChangeText={setParticipantName}
            onSubmitEditing={handleAddParticipant}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddParticipant}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {contributorsList.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listLabel}>Participants ({contributorsList.length})</Text>
          <View style={styles.chipsContainer}>
            {contributorsList.map((name, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{name}</Text>
                <TouchableOpacity onPress={() => handleRemoveParticipant(idx)} style={styles.chipRemove}>
                  <Text style={styles.chipRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>No. of Days</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
        />
      </View>

      <Button title="Create Tour" onPress={handleCreate} style={{ marginTop: SPACING.xl }} />
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
    fontSize: 28,
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
  addParticipantRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  addButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  chipRemove: {
    marginLeft: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  chipRemoveText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});
