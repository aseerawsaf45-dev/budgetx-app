import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS, THEMES } from '../constants/theme';
import { formatCurrency } from '../utils/currency';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { TeamBadgeIcon } from '../components/PremiumIcons';
import {
  Trash2,
  UserPlus,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Users,
  Coins,
  Shield,
  Plus,
} from 'lucide-react-native';

export const ContributorsScreen = ({ navigation }: any) => {
  const { tours, currentTourId, addContributor, removeContributor, updateTour } = useStore();
  const currentThemeId = useStore((state) => state.theme) || 'valley';
  const activeTheme = THEMES[currentThemeId] || THEMES.valley || THEMES.obsidian;
  const currentTour = tours.find(t => t.id === currentTourId);
  
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!currentTour) {
    return (
      <View style={styles.container}>
        <View style={[styles.desktopWrapper, { padding: SPACING.md, flex: 1, justifyContent: 'center' }]}>
          <View style={{ marginBottom: SPACING.md }}>
            <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
          </View>
          <View style={styles.emptyContainer}>
            <TeamBadgeIcon size={46} />
            <Text style={styles.emptyTitle}>No Tour Selected</Text>
            <Text style={styles.emptySubtitle}>Select or create a tour first to manage contributors.</Text>
            <Button 
              title="Create New Tour" 
              onPress={() => navigation.navigate('CreateTour')}
              style={{ marginTop: SPACING.lg }}
            />
          </View>
        </View>
      </View>
    );
  }

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (currentTour.contributors.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      if (Platform.OS === 'web') {
        window.alert(`"${trimmed}" is already added as a participant.`);
      } else {
        Alert.alert('Duplicate Participant', `"${trimmed}" is already added as a participant.`);
      }
      return;
    }
    addContributor(currentTour.id, { name: trimmed });
    setName('');
  };

  const handleStartEdit = (contributor: { id: string; name: string }) => {
    setEditingId(contributor.id);
    setEditingName(contributor.name);
  };

  const handleSaveEdit = (contributorId: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    const isDuplicate = currentTour.contributors.some(
      c => c.id !== contributorId && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      if (Platform.OS === 'web') {
        window.alert(`A participant with the name "${trimmed}" already exists.`);
      } else {
        Alert.alert('Duplicate Name', `A participant with the name "${trimmed}" already exists.`);
      }
      return;
    }

    const updatedContributors = currentTour.contributors.map(c => 
      c.id === contributorId ? { ...c, name: trimmed } : c
    );
    updateTour(currentTour.id, { contributors: updatedContributors });
    setEditingId(null);
    setEditingName('');
  };

  const handleRemove = (contributor: any) => {
    const hasExpenses = currentTour.expenses.some(e => 
      Boolean(e.paidBy?.[contributor.id]) || (e.splitAmong || []).includes(contributor.id)
    );
    const message = hasExpenses
      ? `"${contributor.name}" has recorded expenses or shares. Removing them will affect settlement balances. Are you sure?`
      : `Are you sure you want to remove "${contributor.name}"?`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        removeContributor(currentTour.id, contributor.id);
      }
    } else {
      Alert.alert('Remove Contributor', message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeContributor(currentTour.id, contributor.id) }
      ]);
    }
  };

  // Compute total paid and cost per contributor for quick overview
  const paidAmounts: Record<string, number> = {};
  const costs: Record<string, number> = {};
  currentTour.contributors.forEach(c => {
    paidAmounts[c.id] = 0;
    costs[c.id] = 0;
  });
  currentTour.expenses.forEach(e => {
    Object.entries(e.paidBy || {}).forEach(([id, amt]) => {
      if (paidAmounts[id] !== undefined) paidAmounts[id] += amt;
    });
    if (e.splitAmong && e.splitAmong.length > 0) {
      const splitAmt = e.amount / e.splitAmong.length;
      e.splitAmong.forEach(id => {
        if (costs[id] !== undefined) costs[id] += splitAmt;
      });
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
              <View>
                <Text style={styles.title}>Trip Companions</Text>
                <Text style={styles.subtitle}>
                  {currentTour.name} • {currentTour.contributors.length} Participants
                </Text>
              </View>
            </View>
          </View>

          {/* Add Contributor Card */}
          <View style={styles.addCard}>
            <Text style={styles.sectionLabel}>ADD NEW COMPANION</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter member's name (e.g. Alex)"
                placeholderTextColor={COLORS.textDim}
                value={name}
                onChangeText={setName}
                onSubmitEditing={handleAdd}
              />
              <Button 
                title="Add" 
                size="small"
                onPress={handleAdd} 
                disabled={!name.trim()}
                icon={<Plus color={COLORS.primaryTextOnFill} size={15} strokeWidth={2.4} />}
              />
            </View>
          </View>

          {/* Contributors List */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>CURRENT PARTICIPANTS</Text>

          <View style={styles.list}>
            {currentTour.contributors.map((c, idx) => {
              const paid = paidAmounts[c.id] || 0;
              const cost = costs[c.id] || 0;
              const balance = paid - cost;
              const isEditing = editingId === c.id;
              const avatarColor = activeTheme.colors.chartPalette[idx % activeTheme.colors.chartPalette.length];

              return (
                <View key={c.id} style={styles.contributorCard}>
                  <View style={styles.cardMainRow}>
                    <View style={styles.memberIdentity}>
                      <View style={[styles.avatarBox, { backgroundColor: `${avatarColor}25`, borderColor: `${avatarColor}70`, borderWidth: 1.5 }]}>
                        <Text style={[styles.avatarLetter, { color: avatarColor, fontWeight: '800' }]}>
                          {c.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      {isEditing ? (
                        <View style={styles.editRow}>
                          <TextInput
                            style={styles.editInput}
                            value={editingName}
                            onChangeText={setEditingName}
                            autoFocus
                          />
                          <TouchableOpacity 
                            onPress={() => handleSaveEdit(c.id)} 
                            style={styles.saveEditBtn}
                            activeOpacity={0.7}
                          >
                            <Check color={COLORS.primary} size={16} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => setEditingId(null)} 
                            style={styles.cancelEditBtn}
                            activeOpacity={0.7}
                          >
                            <X color={COLORS.textMuted} size={16} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flex: 1, paddingRight: SPACING.xs }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.memberName}>{c.name}</Text>
                            <TouchableOpacity onPress={() => handleStartEdit(c)} style={styles.editIconBtn}>
                              <Edit2 color={COLORS.textDim} size={13} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>

                    {!isEditing && (
                      <TouchableOpacity 
                        onPress={() => handleRemove(c)} 
                        style={styles.deleteBtn}
                        activeOpacity={0.7}
                      >
                        <Trash2 color={COLORS.danger} size={16} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Member Stats Pill */}
                  <View style={styles.statsRow}>
                    <View style={styles.statPill}>
                      <Text style={styles.statPillLabel}>Paid: </Text>
                      <Text style={styles.statPillValue}>{formatCurrency(paid)}</Text>
                    </View>
                    <View style={styles.statPill}>
                      <Text style={styles.statPillLabel}>Share: </Text>
                      <Text style={styles.statPillValue}>{formatCurrency(cost)}</Text>
                    </View>
                    <View style={[
                      styles.statPill,
                      balance > 0.01 && styles.statPillPositive,
                      balance < -0.01 && styles.statPillNegative,
                    ]}>
                      <Text style={styles.statPillLabel}>Balance: </Text>
                      <Text style={[
                        styles.statPillValue,
                        balance > 0.01 && { color: COLORS.success },
                        balance < -0.01 && { color: COLORS.danger },
                      ]}>
                        {balance > 0.01 ? `+${formatCurrency(balance)}` : formatCurrency(balance)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

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
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(23, 30, 45, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },

  // Add Card
  addCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 13.5,
  },

  // Contributor List
  list: {
    gap: SPACING.sm,
  },
  contributorCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  cardMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    flex: 1,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  editIconBtn: {
    padding: 4,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  editInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLORS.text,
    fontSize: 14,
  },
  saveEditBtn: {
    padding: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
  },
  cancelEditBtn: {
    padding: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  statPillPositive: {
    borderColor: 'rgba(56, 229, 134, 0.25)',
    backgroundColor: 'rgba(56, 229, 134, 0.06)',
  },
  statPillNegative: {
    borderColor: 'rgba(248, 113, 113, 0.25)',
    backgroundColor: 'rgba(248, 113, 113, 0.06)',
  },
  statPillLabel: {
    fontSize: 11,
    color: COLORS.textDim,
  },
  statPillValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    maxWidth: 320,
  },
});
