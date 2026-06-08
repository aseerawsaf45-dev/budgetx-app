import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';

export const CreateTourScreen = ({ navigation }: any) => {
  const { addTour } = useStore();
  const [destination, setDestination] = useState('');
  const [participants, setParticipants] = useState('1');

  const handleCreate = () => {
    if (!destination) return;

    addTour({
      name: destination + ' Tour',
      destination,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      days: 1,
      estimatedParticipants: parseInt(participants) || 1,
      totalBudget: 0,
    });

    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create New Tour</Text>
      
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
        <Text style={styles.label}>Estimated Participants</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          value={participants}
          onChangeText={setParticipants}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
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
});
