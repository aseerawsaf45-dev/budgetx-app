import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import {
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Utensils,
  Car,
  Hotel,
  Ticket,
  ShoppingBag,
  Coins,
  Wallet,
  UserCheck,
} from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Expense } from '../types';
import { CATEGORIES } from '../utils/share';
import { formatCurrency } from '../utils/currency';
import {
  getPremiumCategoryIcon,
  EqualSplitIcon,
  GivingSharesIcon,
  CustomSplitIcon,
  CoinStackIcon,
  TeamBadgeIcon,
} from '../components/PremiumIcons';

type PaidByMode = 'AMOUNT' | 'SHARES';
type SplitMode = 'EQUAL' | 'GIVING_SHARES' | 'EXACT';

const showAlert = (message: string) => {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Notice', message);
  }
};

const getCategoryIcon = (category: string) => {
  return getPremiumCategoryIcon(category, 20);
};

export const AddExpenseScreen = ({ navigation, route }: any) => {
  const { tours, currentTourId, addExpense, updateExpense } = useStore();
  const currentTour = tours.find(t => t.id === currentTourId);
  const expenseIdToEdit = route?.params?.expenseId;
  const existingExpense = expenseIdToEdit ? currentTour?.expenses.find(e => e.id === expenseIdToEdit) : null;

  const validContributors = currentTour?.contributors || [];

  const [title, setTitle] = useState(existingExpense?.title || '');
  const [details, setDetails] = useState(existingExpense?.details || '');
  const [amount, setAmount] = useState(existingExpense?.amount ? String(existingExpense.amount) : '');
  const [day, setDay] = useState(existingExpense?.day ? String(existingExpense.day) : '1');
  const [category, setCategory] = useState<Expense['category']>(existingExpense?.category || 'Food');

  // Determine initial payment mode from existing expense (default: AMOUNT)
  const initialMode: PaidByMode = (() => {
    if (existingExpense?.paymentType === 'SHARES') return 'SHARES';
    return 'AMOUNT';
  })();

  const [paymentMode, setPaymentMode] = useState<PaidByMode>(initialMode);

  // Amount Mode values: Contributor ID -> exact amount string
  const [amountPaymentValues, setAmountPaymentValues] = useState<Record<string, string>>(() => {
    const vals: Record<string, string> = {};
    if (existingExpense?.paymentValues && existingExpense.paymentType === 'EXACT') {
      Object.entries(existingExpense.paymentValues).forEach(([k, v]) => {
        vals[k] = String(v);
      });
    } else if (existingExpense?.paidBy) {
      Object.entries(existingExpense.paidBy).forEach(([k, v]) => {
        vals[k] = String(v);
      });
    } else if (validContributors.length > 0 && existingExpense?.amount) {
      vals[validContributors[0].id] = String(existingExpense.amount);
    }
    return vals;
  });

  // Shares Mode values: Contributor ID -> share units string
  const [sharesPaymentValues, setSharesPaymentValues] = useState<Record<string, string>>(() => {
    const vals: Record<string, string> = {};
    if (existingExpense?.paymentValues && existingExpense.paymentType === 'SHARES') {
      Object.entries(existingExpense.paymentValues).forEach(([k, v]) => {
        vals[k] = String(v);
      });
    } else if (validContributors.length > 0) {
      vals[validContributors[0].id] = '1';
    }
    return vals;
  });

  // Split mode: Equal, Giving Shares ("Which person is giving which person's share"), or Exact
  const initialSplitMode: SplitMode = (() => {
    if (existingExpense?.splitType === 'GIVING_SHARES' || existingExpense?.givingShares) return 'GIVING_SHARES';
    if (existingExpense?.splitType === 'EXACT' || existingExpense?.splitValues) return 'EXACT';
    return 'EQUAL';
  })();

  const [splitMode, setSplitMode] = useState<SplitMode>(initialSplitMode);

  // Equal split selection: who is included
  const initialSplit = existingExpense?.splitAmong
    ? existingExpense.splitAmong.filter(id => validContributors.some(c => c.id === id))
    : validContributors.map(c => c.id);
  const [splitAmong, setSplitAmong] = useState<string[]>(initialSplit);

  // Which person is giving which person's share: Payer ID -> Beneficiary IDs
  const [givingSharesMap, setGivingSharesMap] = useState<Record<string, string[]>>(() => {
    if (existingExpense?.givingShares) {
      return { ...existingExpense.givingShares };
    }
    const defaults: Record<string, string[]> = {};
    validContributors.forEach(c => {
      defaults[c.id] = [c.id];
    });
    return defaults;
  });

  // Exact custom split values: Contributor ID -> exact share amount string
  const [customSplitValues, setCustomSplitValues] = useState<Record<string, string>>(() => {
    const vals: Record<string, string> = {};
    if (existingExpense?.splitValues) {
      Object.entries(existingExpense.splitValues).forEach(([k, v]) => {
        vals[k] = String(v);
      });
    } else if (validContributors.length > 0) {
      const perPerson = Math.round((existingExpense?.amount || parseFloat(amount) || 0) / validContributors.length);
      validContributors.forEach(c => {
        vals[c.id] = perPerson > 0 ? String(perPerson) : '';
      });
    }
    return vals;
  });

  if (!currentTour) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Tour Selected</Text>
        </View>
      </View>
    );
  }

  // Live calculations for Amount mode
  const totalBillAmount = parseFloat(amount) || 0;
  const totalAllocatedAmount = Object.values(amountPaymentValues).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const amountDifference = totalBillAmount - totalAllocatedAmount;
  const isAmountMatched = Math.abs(amountDifference) < 0.05 && totalBillAmount > 0;

  // Live calculations for Shares mode
  const totalSharesCount = Object.values(sharesPaymentValues).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  // Live calculations for Custom Split mode
  const totalCustomSplitAllocated = Object.values(customSplitValues).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const customSplitDifference = totalBillAmount - totalCustomSplitAllocated;
  const isCustomSplitMatched = Math.abs(customSplitDifference) < 0.05 && totalBillAmount > 0;

  // Active payers who contributed > 0
  const activePayers = validContributors.filter(c => {
    if (paymentMode === 'AMOUNT') {
      return (parseFloat(amountPaymentValues[c.id]) || 0) > 0;
    } else {
      return (parseFloat(sharesPaymentValues[c.id]) || 0) > 0;
    }
  });

  // Payers displayed in GIVING_SHARES mode (if none have paid yet, show all contributors)
  const displayedPayers = activePayers.length > 0 ? activePayers : validContributors;

  // Live breakdown of shares in GIVING_SHARES mode
  const givingSharesBreakdown = validContributors.map(c => {
    let costIncurred = 0;
    const coveredByNames: string[] = [];

    displayedPayers.forEach(p => {
      const beneficiaries = givingSharesMap[p.id] || [p.id];
      if (beneficiaries.includes(c.id) && beneficiaries.length > 0) {
        let pAmt = 0;
        if (paymentMode === 'AMOUNT') {
          pAmt = parseFloat(amountPaymentValues[p.id]) || 0;
        } else {
          const shareUnits = parseFloat(sharesPaymentValues[p.id]) || 0;
          pAmt = totalSharesCount > 0 ? (shareUnits / totalSharesCount) * totalBillAmount : 0;
        }
        costIncurred += pAmt / beneficiaries.length;
        if (p.id !== c.id) {
          coveredByNames.push(p.name);
        }
      }
    });

    let paidAmount = 0;
    if (paymentMode === 'AMOUNT') {
      paidAmount = parseFloat(amountPaymentValues[c.id]) || 0;
    } else {
      const shareUnits = parseFloat(sharesPaymentValues[c.id]) || 0;
      paidAmount = totalSharesCount > 0 ? (shareUnits / totalSharesCount) * totalBillAmount : 0;
    }

    const netBalance = paidAmount - costIncurred;

    return {
      contributor: c,
      costIncurred: Math.round(costIncurred),
      paidAmount: Math.round(paidAmount),
      netBalance: Math.round(netBalance),
      coveredByNames,
    };
  });

  const handleModeChange = (newMode: PaidByMode) => {
    setPaymentMode(newMode);
    if (newMode === 'AMOUNT') {
      if (validContributors.length > 0 && totalBillAmount > 0 && Object.keys(amountPaymentValues).length === 0) {
        setAmountPaymentValues({ [validContributors[0].id]: String(totalBillAmount) });
      }
    } else if (newMode === 'SHARES') {
      if (validContributors.length > 0 && Object.keys(sharesPaymentValues).length === 0) {
        setSharesPaymentValues({ [validContributors[0].id]: '1' });
      }
    }
  };

  const handleAmountInputChange = (id: string, val: string) => {
    setAmountPaymentValues(prev => ({ ...prev, [id]: val }));
  };

  const handleFillRemainingAmount = (contributorId: string) => {
    let otherSum = 0;
    Object.entries(amountPaymentValues).forEach(([id, val]) => {
      if (id !== contributorId) {
        otherSum += parseFloat(val) || 0;
      }
    });
    const remainder = Math.max(0, totalBillAmount - otherSum);
    setAmountPaymentValues(prev => ({
      ...prev,
      [contributorId]: String(remainder > 0 ? remainder : totalBillAmount)
    }));
  };

  const handleShareInputChange = (id: string, val: string) => {
    setSharesPaymentValues(prev => ({ ...prev, [id]: val }));
  };

  const handleShareStep = (contributorId: string, delta: number) => {
    const current = parseFloat(sharesPaymentValues[contributorId]) || 0;
    const nextVal = Math.max(0, current + delta);
    setSharesPaymentValues(prev => ({
      ...prev,
      [contributorId]: String(nextVal)
    }));
  };

  const toggleGivingShare = (payerId: string, beneficiaryId: string) => {
    setGivingSharesMap(prev => {
      const currentList = prev[payerId] || [];
      const updated = currentList.includes(beneficiaryId)
        ? currentList.filter(id => id !== beneficiaryId)
        : [...currentList, beneficiaryId];
      return { ...prev, [payerId]: updated };
    });
  };

  const setPayerOnlyMyself = (payerId: string) => {
    setGivingSharesMap(prev => ({ ...prev, [payerId]: [payerId] }));
  };

  const setPayerAllBeneficiaries = (payerId: string) => {
    setGivingSharesMap(prev => ({ ...prev, [payerId]: validContributors.map(c => c.id) }));
  };

  const handleCustomSplitInputChange = (id: string, val: string) => {
    setCustomSplitValues(prev => ({ ...prev, [id]: val }));
  };

  const handleFillCustomSplitRemaining = (contributorId: string) => {
    let otherSum = 0;
    Object.entries(customSplitValues).forEach(([id, val]) => {
      if (id !== contributorId) {
        otherSum += parseFloat(val) || 0;
      }
    });
    const remainder = Math.max(0, totalBillAmount - otherSum);
    setCustomSplitValues(prev => ({
      ...prev,
      [contributorId]: String(remainder > 0 ? remainder : totalBillAmount)
    }));
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount) || 0;
    const parsedDay = parseInt(day) || 1;
    const parsedPaidBy: Record<string, number> = {};
    const parsedPaymentValues: Record<string, number> = {};

    if (!title.trim() || parsedAmount <= 0) {
      showAlert('Please enter an expense title and a valid amount greater than 0.');
      return;
    }

    if (isNaN(parsedDay) || parsedDay < 1) {
      showAlert('Day must be at least 1.');
      return;
    }

    if (currentTour.days && parsedDay > currentTour.days) {
      showAlert(`Day cannot exceed the tour duration of ${currentTour.days} days.`);
      return;
    }

    let finalPaymentType: Expense['paymentType'] = 'EXACT';

    if (paymentMode === 'AMOUNT') {
      let sum = 0;
      Object.entries(amountPaymentValues).forEach(([id, val]) => {
        const num = parseFloat(val);
        if (num > 0) {
          parsedPaymentValues[id] = num;
          parsedPaidBy[id] = num;
          sum += num;
        }
      });

      if (Object.keys(parsedPaidBy).length === 0) {
        showAlert('Please enter the payment amounts for at least one person.');
        return;
      }

      if (Math.abs(sum - parsedAmount) > 0.05) {
        showAlert(
          `The sum of individual payments (${formatCurrency(sum)}) must equal the total expense amount (${formatCurrency(parsedAmount)}). Difference: ${formatCurrency(Math.abs(sum - parsedAmount))}.`
        );
        return;
      }
      finalPaymentType = 'EXACT';

    } else if (paymentMode === 'SHARES') {
      let sumShares = 0;
      Object.entries(sharesPaymentValues).forEach(([id, val]) => {
        const num = parseFloat(val);
        if (num > 0) {
          parsedPaymentValues[id] = num;
          sumShares += num;
        }
      });

      if (sumShares <= 0) {
        showAlert('Please allocate at least one share to a contributor.');
        return;
      }

      Object.entries(parsedPaymentValues).forEach(([id, sh]) => {
        parsedPaidBy[id] = (sh / sumShares) * parsedAmount;
      });
      finalPaymentType = 'SHARES';
    }

    // Split handling
    let finalSplitAmong: string[] = [];
    let finalSplitType: Expense['splitType'] = 'EQUAL';
    let finalSplitValues: Record<string, number> | undefined = undefined;
    let finalGivingShares: Record<string, string[]> | undefined = undefined;

    if (splitMode === 'EQUAL') {
      if (splitAmong.length === 0) {
        showAlert('Please select at least one person to split the expense among.');
        return;
      }
      finalSplitAmong = splitAmong;
      finalSplitType = 'EQUAL';

    } else if (splitMode === 'GIVING_SHARES') {
      // Validate that each active payer has selected at least 1 person
      const activePayerList = validContributors.filter(c => (parsedPaidBy[c.id] || 0) > 0);
      if (activePayerList.length === 0) {
        showAlert('Please allocate payment amounts in the Paid By section first.');
        return;
      }

      for (const p of activePayerList) {
        const beneficiaries = givingSharesMap[p.id] || [];
        if (beneficiaries.length === 0) {
          showAlert(`Please select whose share is being given by ${p.name}.`);
          return;
        }
      }

      const calculatedSplitValues: Record<string, number> = {};
      validContributors.forEach(c => { calculatedSplitValues[c.id] = 0; });

      activePayerList.forEach(p => {
        const pAmt = parsedPaidBy[p.id] || 0;
        const beneficiaries = givingSharesMap[p.id] || [];
        const perPerson = pAmt / beneficiaries.length;
        beneficiaries.forEach(bId => {
          calculatedSplitValues[bId] = (calculatedSplitValues[bId] || 0) + perPerson;
        });
      });

      finalSplitAmong = Object.keys(calculatedSplitValues).filter(id => calculatedSplitValues[id] > 0.001);
      finalSplitType = 'GIVING_SHARES';
      finalSplitValues = calculatedSplitValues;
      const filteredGivingShares: Record<string, string[]> = {};
      activePayerList.forEach(p => {
        if ((givingSharesMap[p.id] || []).length > 0) {
          filteredGivingShares[p.id] = givingSharesMap[p.id];
        }
      });
      finalGivingShares = filteredGivingShares;

    } else if (splitMode === 'EXACT') {
      let customSum = 0;
      const parsedCustom: Record<string, number> = {};
      Object.entries(customSplitValues).forEach(([id, val]) => {
        const num = parseFloat(val);
        if (num > 0) {
          parsedCustom[id] = num;
          customSum += num;
        }
      });

      if (Object.keys(parsedCustom).length === 0) {
        showAlert('Please enter the share amounts for at least one person.');
        return;
      }

      if (Math.abs(customSum - parsedAmount) > 0.05) {
        showAlert(
          `The sum of individual shares (${formatCurrency(customSum)}) must equal the total expense amount (${formatCurrency(parsedAmount)}). Difference: ${formatCurrency(Math.abs(customSum - parsedAmount))}.`
        );
        return;
      }

      finalSplitAmong = Object.keys(parsedCustom).filter(id => parsedCustom[id] > 0.001);
      finalSplitType = 'EXACT';
      finalSplitValues = parsedCustom;
    }

    const expenseData: Omit<Expense, 'id'> = {
      tourId: currentTour.id,
      title: title.trim(),
      details: details.trim(),
      amount: parsedAmount,
      day: parsedDay,
      category,
      paidBy: parsedPaidBy,
      splitAmong: finalSplitAmong,
      splitType: finalSplitType,
      splitValues: finalSplitValues,
      givingShares: finalGivingShares,
      paymentType: finalPaymentType,
      paymentValues: parsedPaymentValues,
      date: existingExpense?.date || new Date().toISOString()
    };

    if (expenseIdToEdit) {
      updateExpense(currentTour.id, expenseIdToEdit, expenseData);
    } else {
      addExpense(currentTour.id, expenseData);
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Expenses' });
    }
  };

  const toggleSplitUser = (id: string) => {
    if (splitAmong.includes(id)) {
      setSplitAmong(splitAmong.filter(x => x !== id));
    } else {
      setSplitAmong([...splitAmong, id]);
    }
  };

  const selectAllSplit = () => {
    setSplitAmong(currentTour.contributors.map(c => c.id));
  };

  const clearAllSplit = () => {
    setSplitAmong([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <BackButton fallbackScreen="MainTabs" fallbackTab="Expenses" />
              <View>
                <Text style={styles.title}>
                  {expenseIdToEdit ? 'Edit Expense' : 'Add New Expense'}
                </Text>
                <Text style={styles.subtitle}>{currentTour.name}</Text>
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>

            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EXPENSE TITLE</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Seafood Dinner, Speedboat Rental"
                placeholderTextColor={COLORS.textDim}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Amount & Day */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1.4 }]}>
                <Text style={styles.label}>TOTAL AMOUNT (৳ BDT)</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="0"
                  placeholderTextColor={COLORS.textDim}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>TRIP DAY</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor={COLORS.textDim}
                  keyboardType="numeric"
                  value={day}
                  onChangeText={setDay}
                />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CATEGORY</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.75}
                    >
                      {getCategoryIcon(cat)}
                      <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Paid By Section with 2 Options: Amount, Shares */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>PAID BY</Text>
                
                {/* 2 Options: Amount, Shares */}
                <View style={styles.typeSwitcher}>
                  {(['AMOUNT', 'SHARES'] as const).map(mode => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.typeBtn, paymentMode === mode && styles.typeBtnActive, { flexDirection: 'row', alignItems: 'center', gap: 5 }]}
                      onPress={() => handleModeChange(mode)}
                      activeOpacity={0.7}
                    >
                      {mode === 'AMOUNT' ? <CoinStackIcon size={13} /> : <TeamBadgeIcon size={13} />}
                      <Text style={[styles.typeBtnText, paymentMode === mode && styles.typeBtnTextActive]}>
                        {mode === 'AMOUNT' ? 'Amount' : 'Shares'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Mode 1: Exact Amount */}
              {paymentMode === 'AMOUNT' && (
                <View style={styles.amountModeContainer}>
                  <Text style={styles.modeHelperText}>
                    Enter exact amounts paid by each contributor:
                  </Text>

                  <View style={styles.contributorsGrid}>
                    {validContributors.map(c => {
                      const currentVal = amountPaymentValues[c.id] || '';
                      return (
                        <View key={c.id} style={styles.payerRow}>
                          <Text style={styles.payerName} numberOfLines={1}>{c.name}</Text>
                          <View style={styles.payerInputWrap}>
                            <Text style={styles.currencyPrefix}>৳</Text>
                            <TextInput
                              style={styles.payerInput}
                              placeholder="0"
                              placeholderTextColor={COLORS.textDim}
                              keyboardType="numeric"
                              value={currentVal}
                              onChangeText={val => handleAmountInputChange(c.id, val)}
                            />
                            <TouchableOpacity 
                              onPress={() => handleFillRemainingAmount(c.id)} 
                              style={styles.fullBtn}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.fullBtnText}>Full</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Summary Bar */}
                  <View style={styles.allocationSummaryBar}>
                    <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                      <Text style={styles.summaryLabel}>TOTAL ALLOCATED</Text>
                      <Text style={[styles.summaryStatusText, isAmountMatched ? styles.textSuccess : styles.textWarning]}>
                        {isAmountMatched 
                          ? `✓ Exact match (${formatCurrency(totalAllocatedAmount)})`
                          : amountDifference > 0 
                            ? `Remaining to allocate: ${formatCurrency(amountDifference)}`
                            : `Exceeds total by ${formatCurrency(Math.abs(amountDifference))}`}
                      </Text>
                    </View>
                    <Text style={styles.allocatedAmountText}>
                      {formatCurrency(totalAllocatedAmount)} / {formatCurrency(totalBillAmount)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Mode 2: Relative Shares */}
              {paymentMode === 'SHARES' && (
                <View style={styles.sharesModeContainer}>
                  <Text style={styles.modeHelperText}>
                    Allocate payment share units (e.g. 1 share, 2 shares):
                  </Text>

                  <View style={styles.contributorsGrid}>
                    {validContributors.map(c => {
                      const currentVal = sharesPaymentValues[c.id] || '0';
                      const shareNum = parseFloat(currentVal) || 0;
                      const pct = totalSharesCount > 0 ? (shareNum / totalSharesCount) * 100 : 0;
                      const calculatedAmt = totalSharesCount > 0 ? (shareNum / totalSharesCount) * totalBillAmount : 0;

                      return (
                        <View key={c.id} style={styles.payerRow}>
                          <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                            <Text style={styles.payerName} numberOfLines={1}>{c.name}</Text>
                            <Text style={styles.sharesCalculatedSub}>
                              {totalSharesCount > 0 && shareNum > 0
                                ? `${Math.round(pct)}% • ${formatCurrency(Math.round(calculatedAmt))}`
                                : '0% • ৳0'}
                            </Text>
                          </View>

                          <View style={styles.stepperContainer}>
                            <TouchableOpacity 
                              onPress={() => handleShareStep(c.id, -1)}
                              style={styles.stepBtn}
                              activeOpacity={0.7}
                            >
                              <Minus color={COLORS.text} size={14} />
                            </TouchableOpacity>
                            
                            <TextInput
                              style={styles.sharesInput}
                              keyboardType="numeric"
                              value={currentVal}
                              onChangeText={val => handleShareInputChange(c.id, val)}
                            />

                            <TouchableOpacity 
                              onPress={() => handleShareStep(c.id, 1)}
                              style={styles.stepBtn}
                              activeOpacity={0.7}
                            >
                              <Plus color={COLORS.text} size={14} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.sharesSummaryBar}>
                    <Text style={styles.summaryLabel}>TOTAL SHARES ALLOCATED</Text>
                    <Text style={styles.sharesTotalText}>
                      {totalSharesCount} {totalSharesCount === 1 ? 'Share' : 'Shares'}
                    </Text>
                  </View>
                </View>
              )}

            </View>

            {/* Split / Whose Share Section */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>WHOSE SHARE / SPLIT</Text>
                
                {/* 3 Split Options: Equal, Giving Shares, Custom Amount */}
                <View style={styles.typeSwitcher}>
                  {(['EQUAL', 'GIVING_SHARES', 'EXACT'] as const).map(mode => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.typeBtn, splitMode === mode && styles.typeBtnActive, { flexDirection: 'row', alignItems: 'center', gap: 5 }]}
                      onPress={() => setSplitMode(mode)}
                      activeOpacity={0.7}
                    >
                      {mode === 'EQUAL' && <EqualSplitIcon size={13} />}
                      {mode === 'GIVING_SHARES' && <GivingSharesIcon size={13} />}
                      {mode === 'EXACT' && <CustomSplitIcon size={13} />}
                      <Text style={[styles.typeBtnText, splitMode === mode && styles.typeBtnTextActive]}>
                        {mode === 'EQUAL' ? 'Equal' : mode === 'GIVING_SHARES' ? 'Giving Shares' : 'Custom'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Mode 1: Equal Split */}
              {splitMode === 'EQUAL' && (
                <View style={{ marginTop: SPACING.xs }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
                    <Text style={styles.modeHelperText}>
                      Split equally among selected ({splitAmong.length} of {validContributors.length}):
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity onPress={selectAllSplit} style={styles.shortcutBtn}>
                        <Text style={styles.shortcutBtnText}>All</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={clearAllSplit} style={styles.shortcutBtn}>
                        <Text style={styles.shortcutBtnText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.splitGrid}>
                    {validContributors.map(c => {
                      const isChecked = splitAmong.includes(c.id);
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.splitPill, isChecked && styles.splitPillActive]}
                          onPress={() => toggleSplitUser(c.id)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                            {isChecked && <Check color={COLORS.primaryTextOnFill} size={11} strokeWidth={3} />}
                          </View>
                          <Text style={[styles.splitPillText, isChecked && styles.splitPillTextActive]}>
                            {c.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {totalBillAmount > 0 && splitAmong.length > 0 && (
                    <View style={styles.sharesSummaryBar}>
                      <Text style={styles.summaryLabel}>PER PERSON SHARE</Text>
                      <Text style={styles.sharesTotalText}>
                        {formatCurrency(totalBillAmount / splitAmong.length)} each
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Mode 2: Giving Shares ("Which person is giving which person's share") */}
              {splitMode === 'GIVING_SHARES' && (
                <View style={{ marginTop: SPACING.xs }}>
                  <Text style={styles.modeHelperText}>
                    Select which person's share is being given / covered by each contributor who paid:
                  </Text>

                  <View style={{ gap: SPACING.sm, marginTop: SPACING.xs }}>
                    {displayedPayers.map(payer => {
                      const beneficiaries = givingSharesMap[payer.id] || [];
                      let payerAmt = 0;
                      if (paymentMode === 'AMOUNT') {
                        payerAmt = parseFloat(amountPaymentValues[payer.id]) || 0;
                      } else {
                        const units = parseFloat(sharesPaymentValues[payer.id]) || 0;
                        payerAmt = totalSharesCount > 0 ? (units / totalSharesCount) * totalBillAmount : 0;
                      }

                      const perBeneficiaryAmt = beneficiaries.length > 0 ? payerAmt / beneficiaries.length : 0;

                      return (
                        <View key={payer.id} style={styles.givingPayerCard}>
                          {/* Payer Header */}
                          <View style={styles.givingPayerHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                              <View style={styles.avatarBox}>
                                <Text style={styles.avatarLetter}>
                                  {payer.name.charAt(0).toUpperCase()}
                                </Text>
                              </View>
                              <View>
                                <Text style={styles.givingPayerName}>{payer.name}</Text>
                                <Text style={styles.givingPayerPaidBadge}>
                                  Paid {formatCurrency(Math.round(payerAmt))}
                                </Text>
                              </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 6 }}>
                              <TouchableOpacity 
                                onPress={() => setPayerOnlyMyself(payer.id)} 
                                style={styles.shortcutBtn}
                              >
                                <Text style={styles.shortcutBtnText}>Myself</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                onPress={() => setPayerAllBeneficiaries(payer.id)} 
                                style={styles.shortcutBtn}
                              >
                                <Text style={styles.shortcutBtnText}>All</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Beneficiaries selector */}
                          <Text style={styles.givingPayerLabel}>Giving share for:</Text>
                          <View style={styles.splitGrid}>
                            {validContributors.map(c => {
                              const isGivingForThisPerson = beneficiaries.includes(c.id);
                              return (
                                <TouchableOpacity
                                  key={c.id}
                                  style={[
                                    styles.splitPill,
                                    isGivingForThisPerson && styles.splitPillActive
                                  ]}
                                  onPress={() => toggleGivingShare(payer.id, c.id)}
                                  activeOpacity={0.7}
                                >
                                  <View style={[styles.checkbox, isGivingForThisPerson && styles.checkboxActive]}>
                                    {isGivingForThisPerson && <Check color={COLORS.primaryTextOnFill} size={11} strokeWidth={3} />}
                                  </View>
                                  <Text style={[styles.splitPillText, isGivingForThisPerson && styles.splitPillTextActive]}>
                                    {c.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          {/* Explanatory text */}
                          <View style={styles.givingExplanationBar}>
                            {beneficiaries.length === 0 ? (
                              <Text style={styles.textWarning}>
                                ⚠️ Please select at least one person whose share is covered by {payer.name}
                              </Text>
                            ) : (
                              <Text style={styles.givingExplanationText}>
                                {payer.name} is giving {beneficiaries.length === 1 && beneficiaries[0] === payer.id
                                  ? `only their own share (${formatCurrency(Math.round(payerAmt))})`
                                  : beneficiaries.length === 1
                                    ? `${validContributors.find(c => c.id === beneficiaries[0])?.name}'s share in full (${formatCurrency(Math.round(payerAmt))})`
                                    : `shares for ${beneficiaries.length} people (${formatCurrency(Math.round(perBeneficiaryAmt))} each)`}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Net Breakdown Bar */}
                  <View style={styles.givingNetSummaryCard}>
                    <Text style={styles.summaryLabel}>RESULTING SHARES BREAKDOWN</Text>
                    <View style={{ gap: 4, marginTop: 6 }}>
                      {givingSharesBreakdown.map(({ contributor, costIncurred, paidAmount, netBalance, coveredByNames }) => (
                        <View key={contributor.id} style={styles.givingSummaryRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.givingSummaryName}>{contributor.name}</Text>
                            {coveredByNames.length > 0 && (
                              <Text style={styles.givingSummaryCoveredSub}>
                                Share covered by {coveredByNames.join(', ')}
                              </Text>
                            )}
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.givingSummaryCost}>
                              Share: {formatCurrency(costIncurred)}
                            </Text>
                            <Text style={[
                              styles.givingSummaryBalance,
                              netBalance > 0 ? styles.textSuccess : netBalance < 0 ? styles.textWarning : { color: COLORS.textDim }
                            ]}>
                              {netBalance > 0
                                ? `+${formatCurrency(netBalance)} (owed)`
                                : netBalance < 0
                                  ? `${formatCurrency(netBalance)} (owes)`
                                  : 'Settled'}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Mode 3: Custom Exact Amounts */}
              {splitMode === 'EXACT' && (
                <View style={{ marginTop: SPACING.xs }}>
                  <Text style={styles.modeHelperText}>
                    Enter the exact share amount for each contributor:
                  </Text>

                  <View style={styles.contributorsGrid}>
                    {validContributors.map(c => {
                      const currentVal = customSplitValues[c.id] || '';
                      return (
                        <View key={c.id} style={styles.payerRow}>
                          <Text style={styles.payerName} numberOfLines={1}>{c.name}</Text>
                          <View style={styles.payerInputWrap}>
                            <Text style={styles.currencyPrefix}>৳</Text>
                            <TextInput
                              style={styles.payerInput}
                              placeholder="0"
                              placeholderTextColor={COLORS.textDim}
                              keyboardType="numeric"
                              value={currentVal}
                              onChangeText={val => handleCustomSplitInputChange(c.id, val)}
                            />
                            <TouchableOpacity 
                              onPress={() => handleFillCustomSplitRemaining(c.id)} 
                              style={styles.fullBtn}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.fullBtnText}>Fill</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Summary Bar */}
                  <View style={styles.allocationSummaryBar}>
                    <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                      <Text style={styles.summaryLabel}>TOTAL SHARES ALLOCATED</Text>
                      <Text style={[styles.summaryStatusText, isCustomSplitMatched ? styles.textSuccess : styles.textWarning]}>
                        {isCustomSplitMatched 
                          ? `✓ Exact match (${formatCurrency(totalCustomSplitAllocated)})`
                          : customSplitDifference > 0 
                            ? `Remaining to allocate: ${formatCurrency(customSplitDifference)}`
                            : `Exceeds total by ${formatCurrency(Math.abs(customSplitDifference))}`}
                      </Text>
                    </View>
                    <Text style={styles.allocatedAmountText}>
                      {formatCurrency(totalCustomSplitAllocated)} / {formatCurrency(totalBillAmount)}
                    </Text>
                  </View>
                </View>
              )}

            </View>

            {/* Notes / Details */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOTES & DETAILS (OPTIONAL)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add optional notes or itemized breakdown..."
                placeholderTextColor={COLORS.textDim}
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Save Button */}
            <Button
              title={expenseIdToEdit ? "Update Expense" : "Record Expense"}
              size="large"
              onPress={handleSave}
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
    maxWidth: 720,
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
    gap: SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
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
  amountInput: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: SPACING.md,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.sm,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderColor: 'rgba(56, 229, 134, 0.4)',
  },
  categoryText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Section Block
  sectionBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.full,
    padding: 2,
    gap: 2,
  },
  typeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  typeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  typeBtnText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: COLORS.primaryTextOnFill,
    fontWeight: '700',
  },
  modeHelperText: {
    fontSize: 12,
    color: COLORS.textDim,
    marginVertical: SPACING.xs,
  },

  // Mode 1: Full Payment
  fullModeContainer: {
    marginTop: SPACING.xs,
  },
  fullPayerGrid: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  fullCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  fullCardSelected: {
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    borderColor: 'rgba(56, 229, 134, 0.4)',
  },
  fullCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Giving Shares ("Which person is giving which person's share")
  givingPayerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    padding: SPACING.sm,
    gap: 8,
  },
  givingPayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  givingPayerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  givingPayerPaidBadge: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 1,
  },
  givingPayerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  givingExplanationBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.xs,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  givingExplanationText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  givingNetSummaryCard: {
    backgroundColor: 'rgba(10, 13, 20, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderTopColor: 'rgba(56, 229, 134, 0.25)',
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  givingSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  givingSummaryName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  givingSummaryCoveredSub: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 1,
  },
  givingSummaryCost: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  givingSummaryBalance: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  amountModeContainer: {
    marginTop: SPACING.xs,
  },
  contributorsGrid: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  payerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  payerName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
  },
  payerInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPrefix: {
    color: COLORS.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  payerInput: {
    width: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    color: COLORS.text,
    fontSize: 13,
    textAlign: 'right',
  },
  fullBtn: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
  },
  fullBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  allocationSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 0.5,
  },
  summaryStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  textSuccess: {
    color: COLORS.success,
  },
  textWarning: {
    color: COLORS.warning,
  },
  allocatedAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Mode 3: Shares Mode
  sharesModeContainer: {
    marginTop: SPACING.xs,
  },
  sharesCalculatedSub: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharesInput: {
    width: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.xs,
    paddingVertical: 4,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  sharesSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sharesTotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Split Grid
  splitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  splitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  splitPillActive: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderColor: 'rgba(56, 229, 134, 0.4)',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  splitPillText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  splitPillTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  shortcutBtn: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  shortcutBtnText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Empty state
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
  },
});
