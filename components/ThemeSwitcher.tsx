import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useStore } from '../store/useStore';
import { THEMES, ThemeId } from '../constants/theme';
import {
  MountainThemeIcon,
  SeaThemeIcon,
  CityThemeIcon,
  ValleyThemeIcon,
  ObsidianThemeIcon,
} from './PremiumIcons';
import { ThematicMiniScene } from './ThematicScenery';
import { Sparkles } from 'lucide-react-native';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'full';
  style?: ViewStyle;
  showAttribution?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  style,
  showAttribution = false,
}) => {
  const { theme: currentThemeId, setTheme } = useStore();
  const activeTheme = THEMES[currentThemeId] || THEMES.valley || THEMES.obsidian;
  const { width } = useWindowDimensions();
  const isNarrow = width < 520;

  const themeOptions: { id: ThemeId; label: string; icon: React.ReactNode; glowColor: string }[] = [
    {
      id: 'valley',
      label: 'Valley',
      icon: <ValleyThemeIcon size={variant === 'full' ? 22 : 18} active={currentThemeId === 'valley' || currentThemeId === 'obsidian'} />,
      glowColor: '#22C55E',
    },
    {
      id: 'mountain',
      label: 'Mountains',
      icon: <MountainThemeIcon size={variant === 'full' ? 22 : 18} active={currentThemeId === 'mountain'} />,
      glowColor: '#818CF8',
    },
    {
      id: 'sea',
      label: 'Sea',
      icon: <SeaThemeIcon size={variant === 'full' ? 22 : 18} active={currentThemeId === 'sea'} />,
      glowColor: '#38BDF8',
    },
    {
      id: 'city',
      label: 'Cities',
      icon: <CityThemeIcon size={variant === 'full' ? 22 : 18} active={currentThemeId === 'city'} />,
      glowColor: '#F59E0B',
    },
  ];

  if (variant === 'compact') {
    return (
      <View style={[styles.compactContainer, style]}>
        <View style={[styles.compactTrack, isNarrow && styles.compactTrackNarrow]}>
          {themeOptions.map((opt) => {
            const isActive = currentThemeId === opt.id || (opt.id === 'valley' && currentThemeId === 'obsidian');
            const showLabel = !isNarrow || isActive;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setTheme(opt.id)}
                activeOpacity={0.8}
                style={[
                  styles.compactBtn,
                  isNarrow && (isActive ? styles.compactBtnNarrowActive : styles.compactBtnNarrowInactive),
                  isActive && [
                    styles.compactBtnActive,
                    {
                      borderColor: opt.glowColor,
                      backgroundColor: `${opt.glowColor}1A`,
                      shadowColor: opt.glowColor,
                    },
                  ],
                ]}
              >
                {opt.icon}
                {showLabel && (
                  <Text
                    style={[
                      styles.compactBtnText,
                      isNarrow && styles.compactBtnTextNarrow,
                      isActive && { color: opt.glowColor, fontWeight: '700' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                )}
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: opt.glowColor }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Full / Interactive Sandbox Variant
  return (
    <View style={[styles.fullContainer, style]}>
      {/* Top Header Row with Atmosphere Label & Developer Attribution */}
      <View style={styles.fullHeaderRow}>
        <View style={styles.atmosphereBadge}>
          <Sparkles size={14} color={activeTheme.colors.primary} />
          <Text style={[styles.atmosphereLabel, { color: activeTheme.colors.primary }]}>
            ATMOSPHERIC THEMES
          </Text>
        </View>

        {showAttribution && (
          <View style={styles.attributionPill}>
            <Text style={styles.attributionPrefix}>Developed by</Text>
            <Text style={[styles.attributionName, { color: activeTheme.colors.primary }]}>
              Aseer Awsaf
            </Text>
          </View>
        )}
      </View>

      {/* 4 Thematic Buttons Grid */}
      <View style={styles.fullGrid}>
        {themeOptions.map((opt) => {
          const isActive = currentThemeId === opt.id || (opt.id === 'valley' && currentThemeId === 'obsidian');
          const conf = THEMES[opt.id] || THEMES.valley;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setTheme(opt.id)}
              activeOpacity={0.85}
              style={[
                styles.fullCard,
                {
                  backgroundColor: isActive
                    ? `${opt.glowColor}14`
                    : 'rgba(255, 255, 255, 0.03)',
                  borderColor: isActive
                    ? opt.glowColor
                    : 'rgba(255, 255, 255, 0.08)',
                },
                isActive && styles.fullCardActiveGlow,
              ]}
            >
              <View style={styles.fullCardTop}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isActive
                        ? `${opt.glowColor}25`
                        : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isActive
                        ? opt.glowColor
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                  ]}
                >
                  {opt.icon}
                </View>
                <View
                  style={[
                    styles.badgePill,
                    {
                      backgroundColor: isActive
                        ? `${opt.glowColor}20`
                        : 'rgba(255, 255, 255, 0.06)',
                      borderColor: isActive
                        ? `${opt.glowColor}60`
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isActive && { color: opt.glowColor, fontWeight: '700' },
                    ]}
                  >
                    {conf.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.fullCardInfo}>
                <Text
                  style={[
                    styles.fullCardTitle,
                    isActive && { color: opt.glowColor },
                  ]}
                >
                  {conf.label}
                </Text>
                <Text style={styles.fullCardSubtitle} numberOfLines={1}>
                  {conf.subtitle}
                </Text>
              </View>

              {/* Thematic Scenic Landscape Window */}
              <View style={[styles.miniSceneWrapper, { borderColor: isActive ? `${opt.glowColor}50` : 'rgba(255, 255, 255, 0.08)' }]}>
                <ThematicMiniScene themeId={opt.id} height={48} />
              </View>

              {/* Status Indicator */}
              <View style={styles.fullCardBottom}>
                <View
                  style={[
                    styles.statusPill,
                    isActive && {
                      borderColor: `${opt.glowColor}80`,
                      backgroundColor: `${opt.glowColor}20`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: isActive
                          ? opt.glowColor
                          : 'rgba(255, 255, 255, 0.25)',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      isActive && { color: opt.glowColor, fontWeight: '700' },
                    ]}
                  >
                    {isActive ? 'ACTIVE THEME' : 'SELECT'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Compact Variant Styles
  compactContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 20, 30, 0.85)',
    borderRadius: 9999,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  compactTrackNarrow: {
    padding: 2.5,
    gap: 3,
  },
  compactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  compactBtnNarrowActive: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 4,
  },
  compactBtnNarrowInactive: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    gap: 0,
  },
  compactBtnActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  compactBtnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  compactBtnTextNarrow: {
    fontSize: 11,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginLeft: 2,
  },

  // Full Variant Styles
  fullContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(15, 20, 30, 0.65)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  fullHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  atmosphereBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  atmosphereLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
  },
  attributionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  attributionPrefix: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  attributionName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  fullGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fullCard: {
    flex: 1,
    minWidth: 160,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  fullCardActiveGlow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  fullCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  fullCardInfo: {
    marginBottom: 12,
  },
  fullCardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#F8FAFC',
    marginBottom: 2,
  },
  fullCardSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  fullCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  cardLandscapeTag: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 9,
    color: '#64748B',
    maxWidth: '55%',
  },
  miniSceneWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  miniSceneTelemetry: {
    position: 'absolute',
    bottom: 3,
    right: 5,
    backgroundColor: 'rgba(5, 8, 14, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  miniSceneTelemetryText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 8,
    letterSpacing: 0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 9,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
});
