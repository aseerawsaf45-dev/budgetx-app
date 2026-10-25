import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS, THEMES } from '../constants/theme';
import { useStore } from '../store/useStore';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ThematicHeroPanorama, ThematicBackgroundElements } from '../components/ThematicScenery';
import { formatCurrency } from '../utils/currency';
import {
  CoinStackIcon,
  TeamBadgeIcon,
  SettlementWalletIcon,
  GivingSharesIcon,
  EqualSplitIcon,
  CustomSplitIcon,
  TransferArrowBadgeIcon,
  FoodIcon,
  TransportIcon,
  HotelIcon,
  TicketsIcon,
} from '../components/PremiumIcons';
import {
  ArrowRight,
  ShieldCheck,
  WifiOff,
  Share2,
  Sparkles,
  ChevronRight,
  Compass,
  CheckCircle2,
  Layers,
  Zap,
  Globe,
  Sliders,
  DollarSign,
} from 'lucide-react-native';
import gsap from 'gsap';

export const LandingScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const currentThemeId = useStore((state) => state.theme) || 'valley';
  const activeTheme = THEMES[currentThemeId] || THEMES.valley || THEMES.obsidian;

  // Interactive Live Simulator state
  const [simAmount, setSimAmount] = useState(6000);
  const [simSplitType, setSimSplitType] = useState<'EQUAL' | 'GIVING' | 'CUSTOM'>('EQUAL');
  const [activeAccordion, setActiveAccordion] = useState(0);

  // GSAP animation references
  const heroRef = useRef<View>(null);
  const bentoRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        gsap.fromTo(
          '.gsap-fade-in',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, []);

  const handleLaunchApp = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handleCreateTour = () => {
    navigation.navigate('CreateTour');
  };

  const accordionItems = [
    {
      title: 'Highland Treks & Mountain Trails',
      subtitle: 'Remote passes where cellular signal drops to zero',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      badge: '100% Offline Cache',
    },
    {
      title: 'Coastal Drives & Caravans',
      subtitle: 'Dynamic fuel, boat charter, and beachside villa splits',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      badge: 'Multi-Payer Fuel Log',
    },
    {
      title: 'Metropolitan Food & Culture Safaris',
      subtitle: 'Micropayments, night markets, and itemized culinary ledgers',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      badge: 'Asymmetric Giving Shares',
    },
    {
      title: 'Cross-District Expeditions',
      subtitle: 'Multi-day excursions with strict budget limits and cap alerts',
      image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?q=80&w=1200&auto=format&fit=crop',
      badge: 'BDT Financial Precision',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      <ThematicBackgroundElements themeId={activeTheme.id} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* =========================================================================
            ATTENTION (HERO SECTION) - CINEMATIC CENTER WITH WIDE FLOW
           ========================================================================= */}
        <View style={styles.heroSection}>
          <View style={[styles.heroGlowRadial, { backgroundColor: `${activeTheme.colors.primary}12` }]} />
          
          <View style={styles.heroContentWrapper}>

            {/* H1 Heading - 2 Line Iron Rule with Inline Photographic Capsule */}
            <Text style={styles.heroH1}>
              Financial Clarity for Group Expeditions.
            </Text>
            <View style={styles.heroH1Row2}>
              <Text style={styles.heroH1}>
                Zero Disputes.
              </Text>
              <View style={[styles.heroInlineCapsule, { borderColor: `${activeTheme.colors.primary}50` }]}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop' }}
                  style={styles.heroInlineImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={[styles.heroH1, { color: activeTheme.colors.primary }]}>
                Pure Adventure.
              </Text>
            </View>

            {/* Clean Subtitle */}
            <Text style={styles.heroSubtitle}>
              Engineered for road trips, trekking squads, and shared expeditions. Track asymmetric payments,
              balance debts with minimal transactions, and operate 100% offline with instant URL syncing.
            </Text>

            {/* Dual High-Contrast CTAs */}
            <View style={styles.heroCtasRow}>
              <TouchableOpacity
                onPress={handleLaunchApp}
                activeOpacity={0.85}
                style={[
                  styles.heroPrimaryBtn,
                  {
                    backgroundColor: activeTheme.colors.primary,
                    shadowColor: activeTheme.colors.primary,
                  },
                ]}
              >
                <Text style={[styles.heroPrimaryBtnText, { color: activeTheme.colors.primaryTextOnFill }]}>
                  Launch BudgetX App
                </Text>
                <ArrowRight color={activeTheme.colors.primaryTextOnFill} size={18} strokeWidth={2.4} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateTour}
                activeOpacity={0.8}
                style={[styles.heroSecondaryBtn, { borderColor: `${activeTheme.colors.primary}40` }]}
              >
                <Compass color={activeTheme.colors.primary} size={18} strokeWidth={2} />
                <Text style={styles.heroSecondaryBtnText}>Create First Tour</Text>
              </TouchableOpacity>
            </View>

            {/* Verified Capabilities Metric Row */}
            <View style={styles.heroProofRow}>
              <View style={styles.proofItem}>
                <CheckCircle2 color={activeTheme.colors.primary} size={14} />
                <Text style={styles.proofText}>Zero Database Latency</Text>
              </View>
              <View style={styles.proofItem}>
                <CheckCircle2 color={activeTheme.colors.primary} size={14} />
                <Text style={styles.proofText}>100% Offline PWA</Text>
              </View>
              <View style={styles.proofItem}>
                <CheckCircle2 color={activeTheme.colors.primary} size={14} />
                <Text style={styles.proofText}>Full BDT Precision</Text>
              </View>
            </View>

            {/* Live Interactive Scenic World Panorama */}
            <View style={{ width: '100%', maxWidth: 960, marginTop: 24, marginBottom: 12 }}>
              <ThematicHeroPanorama
                height={isMobile ? 200 : 260}
                showOverlayText={true}
                tourTitle={`${activeTheme.label} Expedition`}
                destination={activeTheme.label}
              />
            </View>

            {/* Interactive Theme Atmosphere Controller */}
            <View style={styles.heroThemeSwitcherWrap}>
              <ThemeSwitcher variant="full" showAttribution={true} />
            </View>
          </View>
        </View>



        {/* =========================================================================
            4. INTEREST (THE GAPLESS BENTO GRID) - 4 INTERLOCKING TILES
           ========================================================================= */}
        <View style={styles.bentoSection}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionEyebrow}>CORE SYSTEM ARCHITECTURE</Text>
            <Text style={styles.sectionTitle}>Engineered for mathematically pure group balance.</Text>
          </View>

          {/* 12-Column Responsive Interlocking Grid */}
          <View style={styles.bentoGrid}>

            {/* Card 1 (Wide 7-Col): Asymmetric Giving Shares & Split Engine */}
            <View style={[styles.bentoCard, isMobile ? styles.col12 : styles.col7]}>
              <View style={styles.bentoCardTop}>
                <View style={styles.bentoIconBadge}>
                  <GivingSharesIcon size={22} />
                </View>
                <Text style={styles.bentoCategoryLabel}>SPLIT ALGORITHM</Text>
              </View>

              <Text style={styles.bentoCardHeading}>
                "Giving Shares" Asymmetric Redistribution
              </Text>
              <Text style={styles.bentoCardBody}>
                Real trips aren't always split equally. One member covers another's ticket, someone pays for the rental,
                and another takes dinner. BudgetX routes discrete shares between specific travelers without breaking the group balance.
              </Text>

              {/* Interactive Visual Element */}
              <View style={styles.splitDemoBox}>
                <View style={styles.splitPartyRow}>
                  <View style={styles.demoAvatarCircle}>
                    <Text style={styles.demoAvatarLetter}>A</Text>
                  </View>
                  <Text style={styles.demoPartyName}>Alice (Paid ৳4,000)</Text>
                  <TransferArrowBadgeIcon size={20} />
                  <View style={[styles.demoAvatarCircle, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
                    <Text style={[styles.demoAvatarLetter, { color: '#60A5FA' }]}>B</Text>
                  </View>
                  <Text style={styles.demoPartyName}>Bob's Share Covered</Text>
                </View>
                <View style={styles.splitMeterTrack}>
                  <View style={[styles.splitMeterFill, { width: '65%', backgroundColor: COLORS.primary }]} />
                </View>
              </View>
            </View>

            {/* Card 2 (5-Col): 100% Offline PWA Engine */}
            <View style={[styles.bentoCard, isMobile ? styles.col12 : styles.col5]}>
              <View style={styles.bentoCardTop}>
                <View style={[styles.bentoIconBadge, { borderColor: 'rgba(96, 165, 250, 0.3)' }]}>
                  <WifiOff color="#60A5FA" size={20} strokeWidth={2} />
                </View>
                <Text style={[styles.bentoCategoryLabel, { color: '#60A5FA' }]}>OFFLINE ENGINE</Text>
              </View>

              <Text style={styles.bentoCardHeading}>
                Zero Signal. Instant Ledger.
              </Text>
              <Text style={styles.bentoCardBody}>
                Deep inside mountain gorges or high at sea, BudgetX stores all tours, days, and transactions locally
                via modern Service Workers. Never lose a recorded entry to spotty cell towers.
              </Text>

              <View style={styles.offlineSignalVisual}>
                <View style={styles.offlineWaveDotActive} />
                <Text style={styles.offlineSignalText}>IndexedDB Local Cache Ready</Text>
              </View>
            </View>

            {/* Card 3 (5-Col): Stateless URL Compression */}
            <View style={[styles.bentoCard, isMobile ? styles.col12 : styles.col5]}>
              <View style={styles.bentoCardTop}>
                <View style={[styles.bentoIconBadge, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                  <Share2 color="#A855F7" size={20} strokeWidth={2} />
                </View>
                <Text style={[styles.bentoCategoryLabel, { color: '#A855F7' }]}>SHAREABLE ARCHITECTURE</Text>
              </View>

              <Text style={styles.bentoCardHeading}>
                Stateless Tour Compression
              </Text>
              <Text style={styles.bentoCardBody}>
                Share complete itineraries with zero accounts or cloud databases. Entire multi-day tour histories
                are compressed directly into lightweight URL tokens that companions can import with one click.
              </Text>

              <View style={styles.urlPreviewBox}>
                <Text style={styles.urlPreviewText} numberOfLines={1}>
                  budgetx.app/shared?data=7Zxbbu...
                </Text>
                <View style={styles.urlPill}>
                  <Text style={styles.urlPillText}>LZ-String Encoded</Text>
                </View>
              </View>
            </View>

            {/* Card 4 (Wide 7-Col): Real-Time BDT Settlement Engine */}
            <View style={[styles.bentoCard, isMobile ? styles.col12 : styles.col7]}>
              <View style={styles.bentoCardTop}>
                <View style={styles.bentoIconBadge}>
                  <SettlementWalletIcon size={22} />
                </View>
                <Text style={styles.bentoCategoryLabel}>DEBT RESOLUTION</Text>
              </View>

              <Text style={styles.bentoCardHeading}>
                Optimal Minimal Settlement Paths
              </Text>
              <Text style={styles.bentoCardBody}>
                Instead of a tangled web of 15 confusing cross-transfers, our greedy optimization algorithm
                resolves group imbalances into the minimum possible transactions. 3 taps and the squad is completely settled.
              </Text>

              <View style={styles.settlementFlowRow}>
                <View style={styles.settleNode}>
                  <Text style={styles.nodeName}>Bob</Text>
                  <Text style={styles.nodeOwes}>Owes ৳2,000</Text>
                </View>
                <View style={styles.settleArrowNode}>
                  <TransferArrowBadgeIcon size={24} />
                  <Text style={styles.settleAmountBadge}>৳2,000 direct</Text>
                </View>
                <View style={styles.settleNode}>
                  <Text style={styles.nodeName}>Alice</Text>
                  <Text style={styles.nodeReceives}>Receives ৳2,000</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* =========================================================================
            5. DESIRE (INTERACTIVE LIVE SPLIT SIMULATOR)
           ========================================================================= */}
        <View style={styles.simulatorSection}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionEyebrow}>INTERACTIVE SIMULATOR</Text>
            <Text style={styles.sectionTitle}>Experience the settlement engine live.</Text>
            <Text style={styles.sectionSubtitle}>
              Test how an expedition expense balances dynamically across 3 companions in real time.
            </Text>
          </View>

          <View style={styles.simulatorCard}>
            <View style={styles.simControlsRow}>
              {/* Preset Expense Selector */}
              <View style={styles.simAmountCol}>
                <Text style={styles.simLabel}>EXPEDITION EXPENSE</Text>
                <View style={styles.amountPills}>
                  {[3000, 6000, 12000, 24000].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      onPress={() => setSimAmount(amt)}
                      style={[styles.amtPill, simAmount === amt && styles.amtPillActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.amtPillText, simAmount === amt && styles.amtPillTextActive]}>
                        {formatCurrency(amt)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Split Mode Selector */}
              <View style={styles.simModeCol}>
                <Text style={styles.simLabel}>SPLIT MECHANISM</Text>
                <View style={styles.modeTabs}>
                  <TouchableOpacity
                    onPress={() => setSimSplitType('EQUAL')}
                    style={[styles.modeTab, simSplitType === 'EQUAL' && styles.modeTabActive]}
                    activeOpacity={0.8}
                  >
                    <EqualSplitIcon size={16} />
                    <Text style={[styles.modeTabText, simSplitType === 'EQUAL' && styles.modeTabTextActive]}>
                      Equal Split
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSimSplitType('GIVING')}
                    style={[styles.modeTab, simSplitType === 'GIVING' && styles.modeTabActive]}
                    activeOpacity={0.8}
                  >
                    <GivingSharesIcon size={16} />
                    <Text style={[styles.modeTabText, simSplitType === 'GIVING' && styles.modeTabTextActive]}>
                      Giving Shares
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Real-time Math Ledger Display */}
            <View style={styles.simOutputGrid}>
              <View style={styles.simOutputCol}>
                <Text style={styles.simOutputTitle}>Payer (Alice)</Text>
                <Text style={styles.simOutputAmount}>{formatCurrency(simAmount)}</Text>
                <Text style={styles.simOutputRole}>Paid 100% upfront</Text>
              </View>

              <View style={styles.simOutputDivider} />

              <View style={styles.simOutputCol}>
                <Text style={styles.simOutputTitle}>Bob's Share</Text>
                <Text style={[styles.simOutputAmount, { color: simSplitType === 'GIVING' ? COLORS.primary : COLORS.text }]}>
                  {simSplitType === 'GIVING' ? '৳0 (Sponsored)' : formatCurrency(Math.round(simAmount / 3))}
                </Text>
                <Text style={styles.simOutputRole}>
                  {simSplitType === 'GIVING' ? 'Covered by Alice' : 'Owes to Alice'}
                </Text>
              </View>

              <View style={styles.simOutputDivider} />

              <View style={styles.simOutputCol}>
                <Text style={styles.simOutputTitle}>Charlie's Share</Text>
                <Text style={styles.simOutputAmount}>
                  {simSplitType === 'GIVING' ? formatCurrency(Math.round(simAmount / 2)) : formatCurrency(Math.round(simAmount / 3))}
                </Text>
                <Text style={styles.simOutputRole}>Owes to Alice</Text>
              </View>
            </View>
          </View>
        </View>

        {/* =========================================================================
            6. EXPEDITION PROFILES (HORIZONTAL ACCORDION)
           ========================================================================= */}
        <View style={styles.accordionSection}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionEyebrow}>TAILORED TRIP PROFILES</Text>
            <Text style={styles.sectionTitle}>Any squad. Any terrain.</Text>
          </View>

          <View style={isMobile ? styles.accordionCol : styles.accordionRow}>
            {accordionItems.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveAccordion(idx)}
                  activeOpacity={0.9}
                  style={[
                    styles.accordionCard,
                    isOpen ? styles.accordionCardExpanded : styles.accordionCardCollapsed,
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.accordionImage} resizeMode="cover" />
                  <View style={styles.accordionOverlay} />

                  <View style={styles.accordionContent}>
                    <View style={styles.accordionBadge}>
                      <Text style={styles.accordionBadgeText}>{item.badge}</Text>
                    </View>
                    <Text style={styles.accordionTitle}>{item.title}</Text>
                    {isOpen && (
                      <Text style={styles.accordionSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =========================================================================
            7. ACTION (MASSIVE HIGH-CONTRAST FINAL CTA)
           ========================================================================= */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <View style={styles.ctaRadialGlow} />

            <View style={styles.ctaContent}>
              <View style={styles.ctaIconRing}>
                <CoinStackIcon size={32} />
              </View>

              <Text style={styles.ctaHeading}>
                Leave financial friction at the trailhead.
              </Text>
              <Text style={styles.ctaSubtext}>
                No signups required. No databases tracking your personal receipts. Start recording group expenses
                in seconds with precision BDT splits and seamless settlement.
              </Text>

              <View style={styles.ctaButtonsRow}>
                <TouchableOpacity onPress={handleLaunchApp} activeOpacity={0.85} style={styles.ctaPrimaryBtn}>
                  <Text style={styles.ctaPrimaryBtnText}>Launch BudgetX Now</Text>
                  <ArrowRight color="#0A0D14" size={18} strokeWidth={2.5} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCreateTour} activeOpacity={0.8} style={styles.ctaSecondaryBtn}>
                  <Text style={styles.ctaSecondaryBtnText}>Create New Tour</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* =========================================================================
            8. FOOTER MATRIX
           ========================================================================= */}
        <View style={styles.footerSection}>
          <View style={styles.footerTopRow}>
            <View style={styles.footerBrandBlock}>
              <View style={styles.navBrand}>
                <View style={styles.brandIconWrap}>
                  <CoinStackIcon size={16} />
                </View>
                <Text style={styles.brandTitle}>BUDGET<Text style={{ color: COLORS.primary }}>X</Text></Text>
              </View>
              <Text style={styles.footerBrandDesc}>
                High-performance tour budgeting and group debt reconciliation engine. 100% offline, privacy-first, and zero account dependencies.
              </Text>
            </View>

            <View style={styles.footerLinksGrid}>
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>Navigation</Text>
                <TouchableOpacity onPress={handleLaunchApp}><Text style={styles.footerLink}>Dashboard</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Expenses' })}><Text style={styles.footerLink}>Ledger</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Settlement' })}><Text style={styles.footerLink}>Settlements</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'History' })}><Text style={styles.footerLink}>Archives</Text></TouchableOpacity>
              </View>

              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>Features</Text>
                <Text style={styles.footerLinkMuted}>Asymmetric Splits</Text>
                <Text style={styles.footerLinkMuted}>Offline Service Worker</Text>
                <Text style={styles.footerLinkMuted}>Stateless URLs</Text>
                <Text style={styles.footerLinkMuted}>BDT Currency Engine</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerDivider} />

          <View style={styles.footerBottomRow}>
            <View style={styles.footerDeveloperBlock}>
              <Text style={styles.footerCopyright}>
                &copy; {new Date().getFullYear()} BudgetX Travel Intelligence. Built for explorers.
              </Text>
              <View style={[styles.footerDevPill, { borderColor: `${activeTheme.colors.primary}40`, backgroundColor: `${activeTheme.colors.primary}12` }]}>
                <Text style={styles.footerDevLabel}>Engineered & Developed by</Text>
                <Text style={[styles.footerDevName, { color: activeTheme.colors.primary }]}>Aseer Awsaf</Text>
              </View>
            </View>

            <View style={styles.footerBottomLinks}>
              <Text style={[styles.footerStatusBadge, { color: activeTheme.colors.primary }]}>All Systems Nominal • PWA Ready</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Premium Obsidian base
  },
  scrollContent: {
    paddingBottom: 60,
  },

  // 1. Navigation
  navContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 20 : 36,
    paddingHorizontal: SPACING.md,
    zIndex: 100,
  },
  navPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1040,
    height: 60,
    borderRadius: 9999,
    backgroundColor: 'rgba(12, 16, 26, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 10,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navLinkItem: {
    paddingVertical: 6,
  },
  navLinkText: {
    color: '#94A3B8',
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  navCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 9999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  navCtaText: {
    color: '#0A0D14',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // 2. Hero Section
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'web' ? 100 : 70,
    paddingBottom: 90,
    paddingHorizontal: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlowRadial: {
    position: 'absolute',
    top: -120,
    width: 800,
    height: 600,
    borderRadius: 400,
    backgroundColor: 'rgba(56, 229, 134, 0.07)',
    opacity: 0.8,
  },
  heroContentWrapper: {
    width: '100%',
    maxWidth: 1080,
    alignItems: 'center',
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.22)',
    marginBottom: SPACING.lg,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  heroStatusText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroH1: {
    fontSize: Platform.OS === 'web' ? 52 : 36,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: Platform.OS === 'web' ? 64 : 44,
  },
  heroH1Row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  heroInlineCapsule: {
    width: 78,
    height: 36,
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 229, 134, 0.4)',
    marginHorizontal: 4,
  },
  heroInlineImage: {
    width: '100%',
    height: '100%',
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 720,
    lineHeight: 26,
    marginTop: SPACING.md + 4,
    marginBottom: SPACING.xl,
  },
  heroCtasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 9999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 6,
  },
  heroPrimaryBtnText: {
    color: '#0A0D14',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(23, 30, 45, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 15,
    paddingHorizontal: 26,
    borderRadius: 9999,
  },
  heroSecondaryBtnText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
  heroProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 40,
  },
  proofItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proofText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },

  // 3. Marquee Ticker
  marqueeSection: {
    width: '100%',
    paddingVertical: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(12, 16, 26, 0.5)',
  },
  marqueeRail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: SPACING.md,
  },
  marqueeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  marqueeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
  marqueeText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // 4. Bento Section
  bentoSection: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingVertical: 90,
    paddingHorizontal: SPACING.md,
  },
  sectionHeaderWrap: {
    marginBottom: 40,
    alignItems: 'center',
    textAlign: 'center',
  },
  sectionEyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? 34 : 26,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 620,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  col12: {
    width: '100%',
  },
  col7: {
    width: '58.5%',
  },
  col5: {
    width: '39%',
  },
  bentoCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.lg + 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
    justifyContent: 'space-between',
  },
  bentoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  bentoIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 229, 134, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoCategoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  bentoCardHeading: {
    fontSize: 21,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  bentoCardBody: {
    fontSize: 13.5,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },

  // Bento Interactive Visuals
  splitDemoBox: {
    backgroundColor: 'rgba(10, 13, 20, 0.65)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 12,
  },
  splitPartyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  demoAvatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoAvatarLetter: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  demoPartyName: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  splitMeterTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  splitMeterFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },

  offlineSignalVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  offlineWaveDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },
  offlineSignalText: {
    color: '#93C5FD',
    fontSize: 12.5,
    fontWeight: '600',
  },

  urlPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  urlPreviewText: {
    color: '#D8B4FE',
    fontSize: 12,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    flex: 1,
    marginRight: 6,
  },
  urlPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  urlPillText: {
    color: '#E9D5FF',
    fontSize: 10,
    fontWeight: '700',
  },

  settlementFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 13, 20, 0.65)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 12,
  },
  settleNode: {
    alignItems: 'center',
  },
  nodeName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  nodeOwes: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '600',
  },
  nodeReceives: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
  settleArrowNode: {
    alignItems: 'center',
    gap: 4,
  },
  settleAmountBadge: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  // 5. Simulator Section
  simulatorSection: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.md,
  },
  simulatorCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    padding: SPACING.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  simControlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  simAmountCol: {
    flex: 1,
    minWidth: 280,
  },
  simModeCol: {
    flex: 1,
    minWidth: 280,
  },
  simLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  amtPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  amtPillActive: {
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
    borderColor: COLORS.primary,
  },
  amtPillText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  amtPillTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modeTabActive: {
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
    borderColor: COLORS.primary,
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  simOutputGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 13, 20, 0.65)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  simOutputCol: {
    flex: 1,
    alignItems: 'center',
  },
  simOutputDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  simOutputTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  simOutputAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginVertical: 4,
  },
  simOutputRole: {
    fontSize: 11,
    color: '#64748B',
  },

  // 6. Accordion Section
  accordionSection: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.md,
  },
  accordionRow: {
    flexDirection: 'row',
    gap: 12,
    height: 380,
  },
  accordionCol: {
    flexDirection: 'column',
    gap: 12,
  },
  accordionCard: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  accordionCardExpanded: {
    flex: 2.8,
    height: 380,
  },
  accordionCardCollapsed: {
    flex: 1,
    height: 380,
  },
  accordionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  accordionOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 13, 20, 0.65)',
  },
  accordionContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  accordionBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56, 229, 134, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.4)',
    marginBottom: 8,
  },
  accordionBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  accordionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  accordionSubtitle: {
    color: '#CBD5E1',
    fontSize: 12.5,
    marginTop: 4,
    lineHeight: 18,
  },

  // 7. Final Action CTA
  ctaSection: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingVertical: 80,
    paddingHorizontal: SPACING.md,
  },
  ctaCard: {
    backgroundColor: 'rgba(18, 23, 34, 0.92)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    paddingVertical: 60,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 36,
  },
  ctaRadialGlow: {
    position: 'absolute',
    top: -100,
    width: 600,
    height: 400,
    borderRadius: 300,
    backgroundColor: 'rgba(56, 229, 134, 0.08)',
  },
  ctaContent: {
    alignItems: 'center',
    maxWidth: 680,
  },
  ctaIconRing: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  ctaHeading: {
    fontSize: Platform.OS === 'web' ? 38 : 28,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  ctaSubtext: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 9999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 6,
  },
  ctaPrimaryBtnText: {
    color: '#0A0D14',
    fontSize: 15,
    fontWeight: '700',
  },
  ctaSecondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 15,
    paddingHorizontal: 26,
    borderRadius: 9999,
  },
  ctaSecondaryBtnText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },

  // 8. Footer Section
  footerSection: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingTop: 40,
    paddingHorizontal: SPACING.md,
  },
  footerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 32,
  },
  footerBrandBlock: {
    maxWidth: 340,
  },
  footerBrandDesc: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    gap: 60,
    flexWrap: 'wrap',
  },
  footerCol: {
    gap: 8,
  },
  footerColTitle: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerLinkMuted: {
    color: '#475569',
    fontSize: 13,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 32,
  },
  footerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  footerDeveloperBlock: {
    gap: 8,
  },
  footerCopyright: {
    color: '#64748B',
    fontSize: 12,
  },
  footerDevPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  footerDevLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11.5,
    color: '#94A3B8',
  },
  footerDevName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  footerBottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerStatusBadge: {
    fontSize: 11.5,
    fontWeight: '600',
  },

  // Developer Badge & Theme Switcher Additions in Hero
  heroTopBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  heroAuthorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
  },
  heroAuthorPrefix: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10.5,
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  heroAuthorName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  heroThemeSwitcherWrap: {
    width: '100%',
    maxWidth: 780,
    marginTop: 36,
  },
});
