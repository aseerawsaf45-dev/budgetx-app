import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { Trash2, UserPlus } from 'lucide-react-native';

export const ContributorsScreen = ({ navigation }: any) => {
  const { tours, currentTourId, addContributor, removeContributor } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);
  
  const [name, setName] = useState('');

  if (!currentTour) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Tour Selected</Text>
      </View>
    );
  }

  const handleAdd = () => {
    if (!name.trim()) return;
    addContributor(currentTour.id, { name: name.trim() });
    setName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manage Contributors</Text>
      
      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Contributor Name"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
        />
        <Button 
          title="Add" 
          onPress={handleAdd} 
          icon={<UserPlus color={COLORS.text} size={18} />} 
          style={styles.addButton}
        />
      </View>

      <View style={styles.listSection}>
        <Text style={styles.subtitle}>Current Contributors ({currentTour.contributors.length})</Text>
        
        {currentTour.contributors.length === 0 ? (
          <Text style={styles.noData}>No contributors added yet.</Text>
        ) : (
          currentTour.contributors.map(contributor => (
            <View key={contributor.id} style={styles.contributorItem}>
              <Text style={styles.contributorName}>{contributor.name}</Text>
              <TouchableOpacity 
                onPress={() => removeContributor(currentTour.id, contributor.id)}
                style={styles.deleteButton}
              >
                <Trash2 color={COLORS.danger} size={20} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      
      <Button 
        title="Go to Settlements" 
        onPress={() => navigation.navigate('MainTabs', { screen: 'Settlement' })} 
        style={{ marginTop: SPACING.xl }}
        variant="outline"
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  addSection: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: SPACING.lg,
  },
  listSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  contributorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  contributorName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: SPACING.xs,
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
  noData: {
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
