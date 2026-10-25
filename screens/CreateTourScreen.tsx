import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import * as Crypto from 'expo-crypto';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { TeamBadgeIcon, SettlementWalletIcon } from '../components/PremiumIcons';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Plus,
  X,
  Sparkles,
} from 'lucide-react-native';

const showAlert = (message: string) => {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Notice', message);
  }
};

export const CreateTourScreen = ({ navigation }: any) => {
  const { addTour } = useStore();
  const [destination, setDestination] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [contributorsList, setContributorsList] = useState<string[]>([]);
  const [days, setDays] = useState('3');
  const [totalBudget, setTotalBudget] = useState('');

  const handleAddParticipant = () => {
    const trimmed = participantName.trim();
    if (!trimmed) return;
    if (contributorsList.some(name => name.toLowerCase() === trimmed.toLowerCase())) {
      showAlert(`Participant "${trimmed}" has already been added.`);
      return;
    }
    setContributorsList(prev => [...prev, trimmed]);
    setParticipantName('');
  };

  const handleRemoveParticipant = (indexToRemove: number) => {
    setContributorsList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreate = () => {
    const destTrimmed = destination.trim();
    if (!destTrimmed) {
      showAlert('Please enter a destination.');
      return;
    }
    
    // Auto-include any participant typed in the input who wasn't explicitly added
    let finalList = [...contributorsList];
    const pendingName = participantName.trim();
    if (pendingName && !finalList.some(n => n.toLowerCase() === pendingName.toLowerCase())) {
      finalList.push(pendingName);
    }

    if (finalList.length === 0) {
      showAlert('Please add at least one participant.');
      return;
    }

    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1) {
      showAlert('Number of days must be at least 1.');
      return;
    }
    
    const budgetNum = parseFloat(totalBudget) || 0;
    const contributors = finalList.map(name => ({ id: Crypto.randomUUID(), name }));

    addTour({
      name: destTrimmed + ' Tour',
      destination: destTrimmed,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      days: numDays,
      estimatedParticipants: contributors.length,
      totalBudget: Math.max(0, budgetNum),
      contributors,
    });

    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <BackButton fallbackScreen="MainTabs" fallbackTab="Home" />
              <View>
                <Text style={styles.title}>Create New Tour</Text>
                <Text style={styles.subtitle}>Set up destination, duration, and group members</Text>
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Destination */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MapPin color={COLORS.primary} size={15} />
                <Text style={styles.label}>DESTINATION OR TRIP NAME</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Cox's Bazar, Sajek Valley"
                placeholderTextColor={COLORS.textDim}
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            {/* Days & Budget in 2 columns */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <View style={styles.labelRow}>
                  <Calendar color={COLORS.textMuted} size={15} />
                  <Text style={styles.label}>DURATION (DAYS)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="3"
                  placeholderTextColor={COLORS.textDim}
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1.3 }]}>
                <View style={styles.labelRow}>
                  <SettlementWalletIcon size={16} />
                  <Text style={styles.label}>TOTAL BUDGET (৳ BDT)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 50,000 (Optional)"
                  placeholderTextColor={COLORS.textDim}
                  keyboardType="numeric"
                  value={totalBudget}
                  onChangeText={setTotalBudget}
                />
              </View>
            </View>

            {/* Participants Section */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <TeamBadgeIcon size={16} />
                <Text style={styles.label}>PARTICIPANTS & COMPANIONS</Text>
              </View>

              <View style={styles.participantInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Add friend's name (e.g. Alex)"
                  placeholderTextColor={COLORS.textDim}
                  value={participantName}
                  onChangeText={setParticipantName}
                  onSubmitEditing={handleAddParticipant}
                />
                <Button 
                  title="Add" 
                  size="small"
                  onPress={handleAddParticipant} 
                  disabled={!participantName.trim()}
                  icon={<Plus color={COLORS.primaryTextOnFill} size={15} strokeWidth={2.4} />}
                />
              </View>

              {/* Added Participants Pills */}
              <View style={styles.participantPillsContainer}>
                {contributorsList.map((name, index) => (
                  <View key={index} style={styles.participantPill}>
                    <Text style={styles.participantPillText}>{name}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveParticipant(index)}
                      style={styles.removePillBtn}
                    >
                      <X color={COLORS.textMuted} size={13} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Submit CTA */}
            <Button 
              title="Create Trip" 
              size="large"
              onPress={handleCreate} 
              icon={<Sparkles color={COLORS.primaryTextOnFill} size={18} strokeWidth={2.4} />}
              style={{ marginTop: SPACING.md }}
            />

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
    maxWidth: 680,
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

  // Form Card
  formCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.lg,
    gap: SPACING.md + 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  participantInputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  participantPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: 4,
  },
  participantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  participantPillText: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '600',
  },
  removePillBtn: {
    padding: 2,
  },
});
