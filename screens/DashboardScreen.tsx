import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Share,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { useStore } from '../store/useStore';
import { COLORS, SPACING, RADIUS, SHADOWS, THEMES } from '../constants/theme';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { formatCurrency } from '../utils/currency';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  Users,
  Receipt,
  Share2,
  Check,
  Edit3,
  X,
  Copy,
  ExternalLink,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  FolderDown,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import {
  CoinStackIcon,
  TeamBadgeIcon,
  SettlementWalletIcon,
  getPremiumCategoryIcon,
} from '../components/PremiumIcons';
import { ThematicHeroPanorama, ThematicBackgroundElements } from '../components/ThematicScenery';
import { BlurView } from 'expo-blur';
import {
  encodeTourToCompact,
  shortenUrl,
  getShareableBaseUrl,
  isSettlementExpense,
  resolveSharedTour,
} from '../utils/share';

export const DashboardScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { tours, currentTourId, setCurrentTourId, deleteTour, updateTour, theme } = useStore();
  const activeTheme = THEMES[theme] || THEMES.valley || THEMES.obsidian;
  const [sharing, setSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  // Share Modal state
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [activeShareUrl, setActiveShareUrl] = useState('');
  const [directShareUrl, setDirectShareUrl] = useState('');
  const [showDirectLink, setShowDirectLink] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  // Edit Tour Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDays, setEditDays] = useState('1');
  const [editBudget, setEditBudget] = useState('0');

  // Import Tour Modal state
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');

  // Auto-select first tour if currentTourId is missing/invalid but tours exist
  useEffect(() => {
    if ((!currentTourId || !tours.some(t => t.id === currentTourId)) && tours.length > 0) {
      setCurrentTourId(tours[0].id);
    }
  }, [currentTourId, tours, setCurrentTourId]);

  const currentTour = tours.find(t => t.id === currentTourId);

  const handleDelete = () => {
    if (!currentTour) return;
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${currentTour.name}"?`)) {
        deleteTour(currentTour.id);
      }
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Delete Tour', `Are you sure you want to delete "${currentTour.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTour(currentTour.id) }
      ]);
    }
  };

  const handleShare = async () => {
    if (!currentTour || sharing) return;
    setSharing(true);
    try {
      const baseUrl = getShareableBaseUrl();
      const encodedData = encodeTourToCompact(currentTour);
      const longUrl = `${baseUrl}/shared?data=${encodeURIComponent(encodedData)}`;
      setDirectShareUrl(longUrl);

      let finalShareUrl = longUrl;
      try {
        const short = await shortenUrl(longUrl);
        if (short && short.startsWith('http')) {
          finalShareUrl = short;
        }
      } catch (e) {
        // Fallback to long URL
      }

      setActiveShareUrl(finalShareUrl);
      setCopiedShare(false);
      setCopiedDirect(false);
      setShowDirectLink(false);
      setShareModalVisible(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      setShareFeedback('Could not generate link.');
      setTimeout(() => setShareFeedback(''), 3000);
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = async (text: string, isDirect: boolean = false) => {
    if (!text) return;
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        const Clipboard = require('react-native').Clipboard;
        Clipboard.setString(text);
      }
      if (isDirect) {
        setCopiedDirect(true);
        setTimeout(() => setCopiedDirect(false), 2500);
      } else {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch (e) {
      console.error('Clipboard copy error:', e);
    }
  };

  const openShareLink = (targetUrl?: string) => {
    const url = targetUrl || activeShareUrl || directShareUrl;
    if (!url) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const shareViaWhatsApp = () => {
    if (!currentTour || !activeShareUrl) return;
    const text = encodeURIComponent(
      `Check out our tour "${currentTour.name}" on BudgetX!\n\nLink: ${activeShareUrl}`
    );
    Linking.openURL(`https://wa.me/?text=${text}`);
  };

  const triggerNativeShare = async () => {
    const urlToShare = activeShareUrl || directShareUrl;
    if (!currentTour || !urlToShare) return;
    try {
      await Share.share({
        message: `Check out our tour "${currentTour.name}" on BudgetX!\n\nLink: ${urlToShare}`,
        url: urlToShare,
        title: `BudgetX Tour: ${currentTour.name}`
      });
    } catch (e) {}
  };

  const openEditModal = () => {
    if (!currentTour) return;
    setEditName(currentTour.name);
    setEditDestination(currentTour.destination);
    setEditDays(String(currentTour.days || 1));
    setEditBudget(String(currentTour.totalBudget || 0));
    setEditModalVisible(true);
  };

  const saveTourEdit = () => {
    if (!currentTour) return;
    const trimmedName = editName.trim();
    if (!trimmedName) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a tour name.');
      } else {
        const { Alert } = require('react-native');
        Alert.alert('Notice', 'Please enter a tour name.');
      }
      return;
    }
    const daysNum = parseInt(editDays) || 1;
    const budgetNum = parseFloat(editBudget) || 0;
    updateTour(currentTour.id, {
      name: trimmedName,
      destination: editDestination.trim() || trimmedName,
      days: Math.max(1, daysNum),
      totalBudget: Math.max(0, budgetNum),
    });
    setEditModalVisible(false);
  };

  const handleImportSubmit = async () => {
    if (!importInput.trim()) return;
    setImportLoading(true);
    setImportError('');
    try {
      const tour = await resolveSharedTour(importInput.trim());
      if (tour) {
        setImportModalVisible(false);
        setImportInput('');
        navigation.navigate('SharedTour', { data: encodeTourToCompact(tour) });
      } else {
        setImportError('Could not read tour data. Please check the link or code.');
      }
    } catch (e: any) {
      setImportError('Failed to import tour: ' + (e?.message || 'Invalid link'));
    } finally {
      setImportLoading(false);
    }
  };

  if (!currentTour) {
    return (
      <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
        <ThematicBackgroundElements themeId={activeTheme.id} />
        <View style={[styles.desktopWrapper, { padding: SPACING.md, flex: 1, justifyContent: 'center' }]}>
          <View style={{ marginBottom: SPACING.md }}>
            <BackButton fallbackScreen="MainTabs" fallbackTab="History" />
          </View>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyBadge}>
              <Sparkles color={COLORS.primary} size={28} />
            </View>
          <Text style={styles.emptyTitle}>Welcome to BudgetX</Text>
          <Text style={styles.emptySubtitle}>
            Create your first travel itinerary or import an existing trip to begin tracking shared group expenses.
          </Text>
          <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              title="Create New Tour" 
              onPress={() => navigation.navigate('CreateTour')}
              icon={<Plus color={COLORS.primaryTextOnFill} size={18} />}
            />
            <Button 
              title="Import Tour" 
              variant="outline"
              onPress={() => setImportModalVisible(true)}
              icon={<FolderDown color={COLORS.text} size={18} />}
            />
          </View>
        </View>
      </View>

        {/* Import Modal */}
        <Modal
          visible={importModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setImportModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Import Shared Tour</Text>
                <TouchableOpacity onPress={() => setImportModalVisible(false)} style={styles.modalCloseBtn}>
                  <X color={COLORS.textMuted} size={18} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>
                Paste any BudgetX share link, shortened URL, or raw trip payload:
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="https://is.gd/... or link"
                placeholderTextColor={COLORS.textDim}
                value={importInput}
                onChangeText={setImportInput}
                autoCapitalize="none"
              />
              {importError ? <Text style={styles.errorText}>{importError}</Text> : null}
              <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
                <Button 
                  title={importLoading ? "Loading..." : "Import Tour"} 
                  onPress={handleImportSubmit} 
                  disabled={importLoading || !importInput.trim()}
                  style={{ flex: 1 }}
                />
                <Button 
                  title="Cancel" 
                  variant="outline" 
                  onPress={() => setImportModalVisible(false)} 
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Financial calculations
  const tripExpenses = currentTour.expenses.filter(e => !isSettlementExpense(e));
  const totalExpense = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Record<string, number> = {};
  tripExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categories = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    amount: categoryTotals[cat],
    percent: totalExpense > 0 ? (categoryTotals[cat] / totalExpense) * 100 : 0,
    color: activeTheme.colors.chartPalette[index % activeTheme.colors.chartPalette.length]
  })).sort((a,b) => b.amount - a.amount);

  // Individual shares
  const contributorShares: Record<string, number> = {};
  currentTour.contributors.forEach(c => contributorShares[c.id] = 0);
  tripExpenses.forEach(e => {
    if (e.splitValues && Object.keys(e.splitValues).length > 0) {
      Object.entries(e.splitValues).forEach(([id, cost]) => {
        if (contributorShares[id] !== undefined) {
          contributorShares[id] += cost;
        }
      });
    } else if (e.splitAmong && e.splitAmong.length > 0) {
      const share = e.amount / e.splitAmong.length;
      e.splitAmong.forEach(id => {
        if (contributorShares[id] !== undefined) {
          contributorShares[id] += share;
        }
      });
    }
  });
  
  const contributorData = currentTour.contributors.map((c, index) => {
    const share = contributorShares[c.id] || 0;
    return {
      id: c.id,
      name: c.name,
      share,
      percent: totalExpense > 0 ? (share / totalExpense) * 100 : 0,
      color: activeTheme.colors.chartPalette[index % activeTheme.colors.chartPalette.length]
    };
  }).sort((a,b) => b.share - a.share);

  // Balances
  const balances: Record<string, number> = {};
  currentTour.contributors.forEach(c => balances[c.id] = 0);
  currentTour.expenses.forEach(e => {
    Object.keys(e.paidBy || {}).forEach(id => {
      if (balances[id] !== undefined) {
        balances[id] += e.paidBy[id];
      }
    });
    if (e.splitValues && Object.keys(e.splitValues).length > 0) {
      Object.entries(e.splitValues).forEach(([id, cost]) => {
        if (balances[id] !== undefined) {
          balances[id] -= cost;
        }
      });
    } else if (e.splitAmong && e.splitAmong.length > 0) {
      const splitAmount = e.amount / e.splitAmong.length;
      e.splitAmong.forEach(id => {
        if (balances[id] !== undefined) {
          balances[id] -= splitAmount;
        }
      });
    }
  });

  const unsettledAmount = Object.values(balances).reduce((sum, bal) => bal > 0.01 ? sum + bal : sum, 0);
  const pendingCount = Object.values(balances).filter(bal => Math.abs(bal) > 0.01).length;

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      {/* Dynamic Thematic Ambient Glow Orbs & Vector Contours */}
      <ThematicBackgroundElements themeId={activeTheme.id} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopWrapper}>

          {/* Top Brand Pill & Actions Header */}
          <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
            <View style={styles.topBarHeaderRow}>
              {/* Left: Back + BudgetX Badge */}
              <View style={styles.topLeftGroup}>
                <BackButton fallbackScreen="Landing" />
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Landing')} 
                  activeOpacity={0.75} 
                  style={[styles.brandBadge, { borderColor: `${activeTheme.colors.primary}30`, backgroundColor: `${activeTheme.colors.primary}10` }]}
                >
                  <View style={[styles.brandDot, { backgroundColor: activeTheme.colors.primary }]} />
                  <Text style={[styles.brandBadgeText, { color: activeTheme.colors.primary }]}>BUDGETX</Text>
                </TouchableOpacity>

                {!isMobile && (
                  <View style={[styles.devHeaderPill, { borderColor: `${activeTheme.colors.primary}35`, backgroundColor: `${activeTheme.colors.primary}12` }]}>
                    <Sparkles size={11} color={activeTheme.colors.primary} />
                    <Text style={styles.devHeaderPrefix}>By</Text>
                    <Text style={[styles.devHeaderName, { color: activeTheme.colors.primary }]}>Aseer Awsaf</Text>
                  </View>
                )}
              </View>

              {/* On Desktop: ThemeSwitcher in center */}
              {!isMobile && (
                <View style={styles.topCenterGroup}>
                  <ThemeSwitcher variant="compact" />
                </View>
              )}

              {/* Right: Action Buttons (Share, Edit, Delete) - Always visible and never clipped */}
              <View style={styles.topActions}>
                <TouchableOpacity 
                  onPress={handleShare} 
                  disabled={sharing} 
                  style={styles.actionIconButton}
                  activeOpacity={0.7}
                  accessibilityLabel="Share tour"
                >
                  {sharing ? (
                    <ActivityIndicator size="small" color={activeTheme.colors.primary} />
                  ) : (
                    <Share2 color={activeTheme.colors.primary} size={18} strokeWidth={2.2} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={openEditModal} 
                  style={styles.actionIconButton}
                  activeOpacity={0.7}
                  accessibilityLabel="Edit tour"
                >
                  <Edit3 color={COLORS.textSecondary} size={18} strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleDelete} 
                  style={[styles.actionIconButton, styles.deleteBtnBorder]}
                  activeOpacity={0.7}
                  accessibilityLabel="Delete tour"
                >
                  <Trash2 color={COLORS.danger} size={18} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Mobile Dedicated Theme & Attribution Row */}
            {isMobile && (
              <View style={styles.topMobileSubRow}>
                <ThemeSwitcher variant="compact" />
                <View style={[styles.devHeaderPill, { borderColor: `${activeTheme.colors.primary}35`, backgroundColor: `${activeTheme.colors.primary}12` }]}>
                  <Sparkles size={10} color={activeTheme.colors.primary} />
                  <Text style={styles.devHeaderPrefix}>By</Text>
                  <Text style={[styles.devHeaderName, { color: activeTheme.colors.primary }]}>Aseer Awsaf</Text>
                </View>
              </View>
            )}
          </View>

          {/* Thematic Scenic Panorama Hero Banner */}
          <ThematicHeroPanorama
            tourTitle={currentTour.name}
            destination={currentTour.destination}
            days={currentTour.days}
            height={isMobile ? 220 : 280}
            showOverlayText={true}
          />

          {/* Quick Navigation & Metadata Row */}
          <View style={styles.heroSection}>
            <View style={styles.heroMetaRow}>
              <TouchableOpacity onPress={openEditModal} activeOpacity={0.75} style={[styles.metaChip, styles.clickableChip, { borderColor: `${activeTheme.colors.primary}40`, backgroundColor: `${activeTheme.colors.primary}12` }]}>
                <MapPin color={activeTheme.colors.primary} size={14} />
                <Text style={[styles.metaChipText, { color: activeTheme.colors.primary, fontWeight: '700' }]}>{currentTour.destination}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })} 
                activeOpacity={0.75} 
                style={[styles.metaChip, styles.clickableChip]}
              >
                <Calendar color={COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>{currentTour.days} Days Duration</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Contributors')} 
                activeOpacity={0.75} 
                style={[styles.metaChip, styles.clickableChip]}
              >
                <Users color={COLORS.textMuted} size={14} />
                <Text style={styles.metaChipText}>{currentTour.contributors.length} Members</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tour Horizontal Selector Rail */}
          {tours.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.tourRail}
            >
              {tours.map(t => (
                <TouchableOpacity 
                  key={t.id} 
                  style={[
                    styles.tourTabPill,
                    {
                      backgroundColor: currentTourId === t.id ? `${activeTheme.colors.primary}20` : activeTheme.colors.surfaceGlass,
                      borderColor: currentTourId === t.id ? activeTheme.colors.primary : activeTheme.colors.border,
                    },
                    currentTourId === t.id && styles.tourTabPillActive,
                  ]}
                  onPress={() => setCurrentTourId(t.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tourTabText, currentTourId === t.id && { color: activeTheme.colors.primary }]}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={[styles.tourTabPill, styles.tourTabPillAction, { backgroundColor: activeTheme.colors.surfaceGlass, borderColor: activeTheme.colors.border }]}
                onPress={() => navigation.navigate('CreateTour')}
                activeOpacity={0.75}
              >
                <Plus color={COLORS.textSecondary} size={14} />
                <Text style={[styles.tourTabText, { color: COLORS.textSecondary }]}>New Tour</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tourTabPill, styles.tourTabPillAction, { borderColor: `${activeTheme.colors.primary}45`, backgroundColor: `${activeTheme.colors.primary}10` }]}
                onPress={() => setImportModalVisible(true)}
                activeOpacity={0.75}
              >
                <FolderDown color={activeTheme.colors.primary} size={14} />
                <Text style={[styles.tourTabText, { color: activeTheme.colors.primary }]}>Import</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Budget Limit Tracker Banner (Always visible & actionable) */}
          {currentTour.totalBudget > 0 ? (
            <TouchableOpacity 
              style={[
                styles.budgetCard,
                styles.clickableCard,
                {
                  backgroundColor: activeTheme.colors.surfaceGlass,
                  borderColor: activeTheme.colors.border,
                },
              ]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })}
              activeOpacity={0.85}
            >
              <View style={styles.budgetHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <TrendingUp color={activeTheme.colors.primary} size={16} />
                  <Text style={styles.sectionMicroLabel}>BUDGET PROGRESS</Text>
                  <Text style={[styles.viewLinkBadge, { color: activeTheme.colors.primary }]}>EXPENSES →</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.budgetLimitText}>
                    Cap: {formatCurrency(currentTour.totalBudget)}
                  </Text>
                  <ChevronRight color={COLORS.textDim} size={14} />
                </View>
              </View>

              <View style={styles.budgetNumbersRow}>
                <Text style={styles.budgetSpentValue}>
                  {formatCurrency(totalExpense)}
                  <Text style={styles.budgetSpentSub}> total spent</Text>
                </Text>
                <View style={[
                  styles.budgetStatusBadge,
                  totalExpense > currentTour.totalBudget ? styles.budgetStatusBadgeOver : styles.budgetStatusBadgeOk
                ]}>
                  <Text style={[
                    styles.budgetStatusText,
                    totalExpense > currentTour.totalBudget ? { color: COLORS.danger } : { color: activeTheme.colors.primary }
                  ]}>
                    {totalExpense > currentTour.totalBudget
                      ? `Over by ${formatCurrency(totalExpense - currentTour.totalBudget)}`
                      : `${formatCurrency(currentTour.totalBudget - totalExpense)} left`}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetTrack}>
                <View 
                  style={[
                    styles.budgetFill, 
                    { 
                      width: `${Math.min(100, Math.round((totalExpense / currentTour.totalBudget) * 100))}%`,
                      backgroundColor: totalExpense > currentTour.totalBudget ? COLORS.danger : activeTheme.colors.primary
                    }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[
              styles.budgetCard,
              {
                backgroundColor: activeTheme.colors.surfaceGlass,
                borderColor: activeTheme.colors.border,
              },
            ]}>
              <View style={styles.budgetHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <TrendingUp color={activeTheme.colors.primary} size={16} />
                  <Text style={styles.sectionMicroLabel}>EXPEDITION BUDGET CAP</Text>
                </View>
                <TouchableOpacity 
                  onPress={openEditModal} 
                  style={[styles.budgetSetBtn, { borderColor: `${activeTheme.colors.primary}50`, backgroundColor: `${activeTheme.colors.primary}15` }]}
                  activeOpacity={0.75}
                >
                  <Sparkles color={activeTheme.colors.primary} size={12} />
                  <Text style={[styles.budgetSetBtnText, { color: activeTheme.colors.primary }]}>Set Budget Cap</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.budgetNumbersRow}>
                <Text style={styles.budgetSpentValue}>
                  {formatCurrency(totalExpense)}
                  <Text style={styles.budgetSpentSub}> recorded expenses</Text>
                </Text>
                <View style={[styles.budgetStatusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.06)' }]}>
                  <Text style={[styles.budgetStatusText, { color: COLORS.textMuted }]}>
                    No Cap Set
                  </Text>
                </View>
              </View>

              <Text style={styles.budgetHintText}>
                No budget target is currently set for this tour. Tap "Set Budget Cap" anytime to define spending limits and monitor threshold alerts.
              </Text>
            </View>
          )}

          {/* Main Interlocking Bento Grid */}
          <View style={isMobile ? styles.bentoColumn : styles.bentoRow}>
            
            {/* Primary Total Expenses Card - Clickable Link to Expenses */}
            <TouchableOpacity 
              style={[
                styles.liquidGlassCard, 
                styles.clickableCard, 
                isMobile ? {} : { flex: 1.6 },
                {
                  backgroundColor: activeTheme.colors.surfaceGlass,
                  borderColor: activeTheme.colors.border,
                },
              ]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })}
              activeOpacity={0.82}
            >
              <View style={styles.cardTopRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sectionMicroLabel}>TOTAL EXPENSES</Text>
                  <Text style={[styles.viewLinkBadge, { color: activeTheme.colors.primary }]}>VIEW ALL →</Text>
                </View>
                <View style={[styles.sparkleIconBox, { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}40` }]}>
                  <CoinStackIcon size={20} />
                </View>
              </View>

              <Text style={styles.primaryMetricValue}>
                {formatCurrency(totalExpense)}
              </Text>

              <View style={styles.cardBottomRow}>
                <Text style={styles.metricSubtext}>
                  Across {tripExpenses.length} trip {tripExpenses.length === 1 ? 'record' : 'records'}
                </Text>
                {currentTour.contributors.length > 0 && totalExpense > 0 && (
                  <Text style={[styles.metricSubtextPill, { color: activeTheme.colors.primary, backgroundColor: `${activeTheme.colors.primary}15`, borderColor: `${activeTheme.colors.primary}30` }]}>
                    ~{formatCurrency(Math.round(totalExpense / currentTour.contributors.length))} / person
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Quick Insights Bento Side */}
            <View style={[styles.bentoSideStack, isMobile ? {} : { flex: 1.2 }]}>
              
              {/* Tour Participants Card - Clickable Link to Contributors */}
              <TouchableOpacity 
                style={[
                  styles.liquidGlassCard, 
                  styles.clickableCard, 
                  { flex: 1 },
                  {
                    backgroundColor: activeTheme.colors.surfaceGlass,
                    borderColor: activeTheme.colors.border,
                  },
                ]}
                onPress={() => navigation.navigate('Contributors')}
                activeOpacity={0.82}
              >
                <View style={styles.cardTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.sectionMicroLabel}>CONTRIBUTORS</Text>
                    <Text style={[styles.viewLinkBadge, { color: activeTheme.colors.primary }]}>MANAGE →</Text>
                  </View>
                  <View style={[styles.miniIconBox, { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}40` }]}>
                    <TeamBadgeIcon size={18} />
                  </View>
                </View>
                <Text style={styles.secondaryMetricValue}>
                  {currentTour.contributors.length} <Text style={{ fontSize: 15, color: COLORS.textMuted, fontWeight: 'normal' }}>members</Text>
                </Text>
                <Text style={styles.subtextDim}>
                  {currentTour.days} days active duration
                </Text>
              </TouchableOpacity>

              {/* Settlements Status Card - Clickable Link to Settlement */}
              <TouchableOpacity 
                style={[
                  styles.liquidGlassCard, 
                  styles.clickableCard, 
                  { flex: 1 },
                  {
                    backgroundColor: activeTheme.colors.surfaceGlass,
                    borderColor: activeTheme.colors.border,
                  },
                ]}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Settlement' })}
                activeOpacity={0.82}
              >
                <View style={styles.cardTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.sectionMicroLabel}>SETTLEMENTS</Text>
                    <Text style={[styles.viewLinkBadge, { color: activeTheme.colors.primary }]}>SETTLE →</Text>
                  </View>
                  <View style={[styles.miniIconBox, { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}40` }]}>
                    <SettlementWalletIcon size={18} />
                  </View>
                </View>
                <Text style={styles.secondaryMetricValue}>
                  {tripExpenses.length > 0 ? formatCurrency(unsettledAmount) : '৳0'}
                </Text>
                <Text style={styles.subtextDim}>
                  {tripExpenses.length === 0
                    ? 'No expenses recorded yet'
                    : unsettledAmount > 0.01
                      ? `${pendingCount} people to balance`
                      : 'All members settled'}
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Category Expense Breakdown */}
          {totalExpense > 0 && (
            <View style={[
              styles.breakdownCard,
              {
                backgroundColor: activeTheme.colors.surfaceGlass,
                borderColor: activeTheme.colors.border,
              },
            ]}>
              <TouchableOpacity 
                style={styles.cardTopRow} 
                onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sectionMicroLabel}>EXPENSE CATEGORIES</Text>
                  <Text style={[styles.viewLinkBadge, { color: activeTheme.colors.primary }]}>VIEW LEDGER →</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.breakdownTotalTag}>
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                  </Text>
                  <ChevronRight color={COLORS.textDim} size={14} />
                </View>
              </TouchableOpacity>

              {/* Segmented Progress Meter */}
              <View style={[styles.segmentedMeterTrack, { borderColor: `${activeTheme.colors.primary}35` }]}>
                {categories.map((cat, i) => {
                  if (cat.percent <= 0) return null;
                  return (
                    <View 
                      key={i} 
                      style={[
                        styles.segmentedMeterSlice, 
                        { 
                          width: `${cat.percent}%`, 
                          backgroundColor: cat.color,
                          borderRightColor: activeTheme.colors.surface,
                          minWidth: cat.amount > 0 ? 6 : 0,
                        },
                      ]} 
                    />
                  );
                })}
              </View>

              {/* Category Pills Grid */}
              <View style={styles.categoryGrid}>
                {categories.map((cat, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[
                      styles.categoryPillItem, 
                      styles.clickableCard, 
                      { 
                        borderColor: `${cat.color}40`,
                        backgroundColor: `${cat.color}0F`,
                      }
                    ]}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.catIconWrap, { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}55` }]}>
                      {getPremiumCategoryIcon(cat.name, 18)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.categoryColorDot, { backgroundColor: cat.color }]} />
                        <Text style={styles.categoryNameText} numberOfLines={1}>
                          {cat.name}
                        </Text>
                      </View>
                      <Text style={styles.categoryAmountText}>
                        {formatCurrency(cat.amount)}
                        <Text style={[styles.categoryPercentText, { color: cat.color, fontWeight: '700' }]}> • {Math.round(cat.percent)}%</Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Individual Cost Share Breakdown */}
          {totalExpense > 0 && currentTour.contributors.length > 0 && (
            <View style={[
              styles.breakdownCard,
              {
                backgroundColor: activeTheme.colors.surfaceGlass,
                borderColor: activeTheme.colors.border,
              },
            ]}>
              <TouchableOpacity 
                style={styles.cardTopRow}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Settlement' })}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sectionMicroLabel}>INDIVIDUAL COST (SHARE)</Text>
                  <Text style={styles.viewLinkBadge}>VIEW BALANCES →</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.breakdownTotalTag}>Settlements</Text>
                  <ChevronRight color={COLORS.textDim} size={14} />
                </View>
              </TouchableOpacity>

              <View style={styles.contributorList}>
                {contributorData.map((c) => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={[styles.contributorRow, styles.clickableCard]}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Settlement' })}
                    activeOpacity={0.75}
                  >
                    <View style={styles.contributorInfo}>
                      <View style={[styles.contributorAvatar, { backgroundColor: `${c.color}25`, borderColor: `${c.color}70`, borderWidth: 1.5 }]}>
                        <Text style={[styles.avatarInitial, { color: c.color, fontWeight: '800' }]}>
                          {c.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.contributorNameText} numberOfLines={1}>
                        {c.name}
                      </Text>
                    </View>

                    <View style={styles.contributorMeterContainer}>
                      <View style={styles.contributorMeterTrack}>
                        <View 
                          style={[
                            styles.contributorMeterFill, 
                            { width: `${Math.max(4, c.percent)}%`, backgroundColor: c.color }
                          ]} 
                        />
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', minWidth: 85 }}>
                      <Text style={styles.contributorAmountText}>
                        {formatCurrency(c.share)}
                      </Text>
                      <Text style={[styles.contributorPercentText, { color: c.color }]}>
                        {Math.round(c.percent)}% of total
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Primary Action Buttons */}
          <View style={styles.actionsFooterRow}>
            <Button 
              title="Add Expense" 
              onPress={() => navigation.navigate('AddExpense')}
              icon={<Plus color={COLORS.primaryTextOnFill} size={18} strokeWidth={2.4} />}
              style={{ flex: 1.2 }}
            />
            <Button 
              title="Contributors" 
              variant="outline"
              onPress={() => navigation.navigate('Contributors')}
              icon={<Users color={COLORS.text} size={18} strokeWidth={2} />}
              style={{ flex: 1 }}
            />
          </View>

          {/* Dashboard Footer Attribution */}
          <View style={styles.dashboardFooter}>
            <View style={styles.dashboardFooterBrand}>
              <View style={[styles.footerBrandDot, { backgroundColor: activeTheme.colors.primary }]} />
              <Text style={styles.dashboardFooterTitle}>BUDGETX TRAVEL INTELLIGENCE</Text>
            </View>
            <View style={[styles.dashboardDevPill, { borderColor: `${activeTheme.colors.primary}40`, backgroundColor: `${activeTheme.colors.primary}12` }]}>
              <Sparkles size={11} color={activeTheme.colors.primary} />
              <Text style={styles.dashboardDevPrefix}>Developed by</Text>
              <Text style={[styles.dashboardDevName, { color: activeTheme.colors.primary }]}>Aseer Awsaf</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* 1. Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Trip</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)} style={styles.modalCloseBtn}>
                <X color={COLORS.textMuted} size={18} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Share "{currentTour.name}" with travel companions so they can import it into BudgetX:
            </Text>

            {/* Main Short Link Box */}
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1} selectable>
                {activeShareUrl}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TouchableOpacity 
                  onPress={() => openShareLink(activeShareUrl)} 
                  style={styles.copyBtn} 
                  activeOpacity={0.7}
                  accessibilityLabel="Open Link in New Tab"
                >
                  <ExternalLink color={COLORS.text} size={15} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => copyToClipboard(activeShareUrl, false)} 
                  style={styles.copyBtn} 
                  activeOpacity={0.7}
                  accessibilityLabel="Copy Link"
                >
                  {copiedShare ? (
                    <Check color={COLORS.primary} size={15} />
                  ) : (
                    <Copy color={COLORS.text} size={15} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {copiedShare && (
              <Text style={styles.copiedAlertText}>
                Copied to clipboard
              </Text>
            )}

            {/* Direct Link Alternative Toggle */}
            {directShareUrl && directShareUrl !== activeShareUrl && (
              <View style={{ marginTop: 2 }}>
                <TouchableOpacity 
                  onPress={() => setShowDirectLink(!showDirectLink)}
                  style={{ alignSelf: 'flex-start', paddingVertical: 4 }}
                >
                  <Text style={{ color: COLORS.textMuted, fontSize: 11.5, textDecorationLine: 'underline' }}>
                    {showDirectLink ? 'Hide direct link' : 'Need direct domain link? (no shortener)'}
                  </Text>
                </TouchableOpacity>

                {showDirectLink && (
                  <View style={[styles.linkBox, { marginTop: 4 }]}>
                    <Text style={[styles.linkText, { fontSize: 11, color: COLORS.textSecondary }]} numberOfLines={1} selectable>
                      {directShareUrl}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TouchableOpacity 
                        onPress={() => openShareLink(directShareUrl)} 
                        style={styles.copyBtn} 
                        activeOpacity={0.7}
                      >
                        <ExternalLink color={COLORS.text} size={13} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => copyToClipboard(directShareUrl, true)} 
                        style={styles.copyBtn} 
                        activeOpacity={0.7}
                      >
                        {copiedDirect ? (
                          <Check color={COLORS.primary} size={13} />
                        ) : (
                          <Copy color={COLORS.text} size={13} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {copiedDirect && (
                  <Text style={styles.copiedAlertText}>
                    Direct link copied
                  </Text>
                )}
              </View>
            )}

            <View style={styles.shareChannelsRow}>
              <TouchableOpacity onPress={shareViaWhatsApp} style={styles.channelButton} activeOpacity={0.7}>
                <Text style={styles.channelButtonText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openShareLink(activeShareUrl)} style={styles.channelButton} activeOpacity={0.7}>
                <Text style={styles.channelButtonText}>Open / Test</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={triggerNativeShare} style={styles.channelButton} activeOpacity={0.7}>
                <Text style={styles.channelButtonText}>Native Share</Text>
              </TouchableOpacity>
            </View>

            <Button 
              title="Done" 
              variant="outline"
              onPress={() => setShareModalVisible(false)} 
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>

      {/* 2. Edit Tour Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Tour Details</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalCloseBtn}>
                <X color={COLORS.textMuted} size={18} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tour Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Cox's Bazar Retreat"
              placeholderTextColor={COLORS.textDim}
            />

            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={styles.modalInput}
              value={editDestination}
              onChangeText={setEditDestination}
              placeholder="e.g. Cox's Bazar"
              placeholderTextColor={COLORS.textDim}
            />

            <View style={{ flexDirection: 'row', gap: SPACING.md }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Days</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editDays}
                  onChangeText={setEditDays}
                  keyboardType="numeric"
                  placeholder="3"
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
              <View style={{ flex: 1.4 }}>
                <Text style={styles.inputLabel}>Total Budget (৳ BDT)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editBudget}
                  onChangeText={setEditBudget}
                  keyboardType="numeric"
                  placeholder="e.g. 50,000 (Optional)"
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
              <Button title="Save Changes" onPress={saveTourEdit} style={{ flex: 1 }} />
              <Button title="Cancel" variant="outline" onPress={() => setEditModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. Import Tour Modal */}
      <Modal
        visible={importModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Import Shared Tour</Text>
              <TouchableOpacity onPress={() => setImportModalVisible(false)} style={styles.modalCloseBtn}>
                <X color={COLORS.textMuted} size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Paste any BudgetX share link, shortened URL, or raw data:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://is.gd/... or link"
              placeholderTextColor={COLORS.textDim}
              value={importInput}
              onChangeText={setImportInput}
              autoCapitalize="none"
            />
            {importError ? <Text style={styles.errorText}>{importError}</Text> : null}
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
              <Button 
                title={importLoading ? "Loading..." : "Import Tour"} 
                onPress={handleImportSubmit} 
                disabled={importLoading || !importInput.trim()}
                style={{ flex: 1 }}
              />
              <Button 
                title="Cancel" 
                variant="outline" 
                onPress={() => setImportModalVisible(false)} 
              />
            </View>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 130, // Generous space for floating bottom navigation
  },
  desktopWrapper: {
    width: '100%',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },

  // Top Bar
  topBar: {
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  topBarMobile: {
    gap: 10,
  },
  topBarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  topLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topCenterGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topMobileSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.2)',
    flexShrink: 0,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  brandBadgeText: {
    color: COLORS.primary,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  devHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  devHeaderPrefix: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    color: '#94A3B8',
  },
  devHeaderName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10.5,
    letterSpacing: 0.3,
  },

  // Dashboard Footer Attribution Styles
  dashboardFooter: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  dashboardFooterBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dashboardFooterTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  dashboardDevPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  dashboardDevPrefix: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  dashboardDevName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11.5,
    letterSpacing: 0.3,
  },
  actionIconButton: {
    width: 38,
    height: 38,
    minWidth: 38,
    minHeight: 38,
    flexShrink: 0,
    borderRadius: 14,
    backgroundColor: 'rgba(23, 30, 45, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteBtnBorder: {
    borderColor: 'rgba(248, 113, 113, 0.22)',
    borderTopColor: 'rgba(248, 113, 113, 0.35)',
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
  },

  // Hero Section
  heroSection: {
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: RADIUS.sm,
  },
  metaChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },

  // Tour Rail
  tourRail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  tourTabPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tourTabPillActive: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderColor: 'rgba(56, 229, 134, 0.4)',
  },
  tourTabPillAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  tourTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tourTabTextActive: {
    color: COLORS.primary,
  },

  // Budget Tracker Banner
  budgetCard: {
    backgroundColor: 'rgba(23, 30, 45, 0.88)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md + 2,
    marginBottom: SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionMicroLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  budgetLimitText: {
    fontSize: 12,
    color: COLORS.textDim,
    fontWeight: '500',
  },
  budgetNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: SPACING.xs,
  },
  budgetSpentValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  budgetSpentSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: 'normal',
  },
  budgetStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  budgetStatusBadgeOk: {
    backgroundColor: COLORS.successMuted,
  },
  budgetStatusBadgeOver: {
    backgroundColor: COLORS.dangerMuted,
  },
  budgetStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  budgetTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: 6,
  },
  budgetFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  budgetSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  budgetSetBtnText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  budgetHintText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 18,
  },

  // Bento Grids
  bentoRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bentoColumn: {
    flexDirection: 'column',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bentoSideStack: {
    gap: SPACING.md,
  },
  liquidGlassCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.lg,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sparkleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryMetricValue: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1,
    marginVertical: SPACING.xs,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  metricSubtext: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  metricSubtextPill: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  secondaryMetricValue: {
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 2,
    letterSpacing: -0.4,
  },
  subtextDim: {
    fontSize: 12.5,
    color: COLORS.textDim,
  },

  // Breakdown Cards
  breakdownCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  },
  breakdownTotalTag: {
    fontSize: 11,
    color: COLORS.textDim,
    fontWeight: '600',
  },
  segmentedMeterTrack: {
    flexDirection: 'row',
    height: 14,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: SPACING.md,
  },
  segmentedMeterSlice: {
    height: '100%',
    borderRightWidth: 1.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  categoryPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    minWidth: 140,
    flex: 1,
  },
  catIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryAmountText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  categoryPercentText: {
    fontSize: 11,
  },

  // Contributor List
  contributorList: {
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  contributorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 5,
  },
  contributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    width: 120,
  },
  contributorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 13,
  },
  contributorNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  contributorMeterContainer: {
    flex: 1,
  },
  contributorMeterTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  contributorMeterFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  contributorAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
  },
  contributorPercentText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },

  // Actions Footer
  actionsFooterRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    minHeight: 460,
  },
  emptyBadge: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: 420,
    lineHeight: 22,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: SPACING.sm,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12.5,
    marginTop: SPACING.sm,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.md,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: 4,
    marginVertical: SPACING.sm,
  },
  linkText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  copyBtn: {
    padding: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  copiedAlertText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  shareChannelsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  channelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.md,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  clickableCard: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.22s ease',
      },
    }),
  },
  clickableChip: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.18s ease',
      },
    }),
  },
  viewLinkBadge: {
    fontSize: 9.5,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.primary,
    letterSpacing: 0.6,
    opacity: 0.9,
    marginLeft: 4,
  },
  miniIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
