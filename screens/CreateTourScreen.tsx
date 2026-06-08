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
  const [participants, setParticipants] = useState('');

  const handleCreate = () => {
    if (!destination) return;
    
    const names = participants.split(',').map(n => n.trim()).filter(Boolean);
    const contributors = names.map(name => ({ id: Crypto.randomUUID(), name }));

    addTour({
      name: destination + ' Tour',
      destination,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      days: 1,
      estimatedParticipants: contributors.length || 1,
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
        <Text style={styles.label}>Participant Names (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Alice, Bob, Charlie"
          placeholderTextColor={COLORS.textMuted}
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
});
