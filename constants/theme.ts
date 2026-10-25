export type ThemeId = 'valley' | 'mountain' | 'sea' | 'city' | 'obsidian';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  label: string;
  subtitle: string;
  badge: string;
  iconName: string;
  colors: {
    background: string;
    backgroundElevated: string;
    surface: string;
    surfaceElevated: string;
    surfaceLight: string;
    surfaceGlass: string;
    surfaceGlassActive: string;
    primary: string;
    primaryMuted: string;
    primaryGlow: string;
    primaryGradientStart: string;
    primaryGradientEnd: string;
    primaryTextOnFill: string;
    accent: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textDim: string;
    border: string;
    borderHighlight: string;
    borderActive: string;
    success: string;
    successMuted: string;
    danger: string;
    dangerMuted: string;
    warning: string;
    warningMuted: string;
    info: string;
    infoMuted: string;
    chartPalette: string[];
  };
  glowGradient: string;
  metaColor: string;
  scenery: {
    landscapeName: string;
    title: string;
    telemetryLabel: string;
    telemetryValue: string;
    ambientAtmosphere: string;
    quote: string;
    coordinates: string;
    badge: string;
    elements: string[];
  };
}

const COMMON_TEXT = {
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  success: '#38E586',
  successMuted: 'rgba(56, 229, 134, 0.15)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // 1. Green Valley (Verdant Meadows & River Terraces)
  valley: {
    id: 'valley',
    name: 'Valley',
    label: 'Green Valley',
    subtitle: 'Verdant Meadows & River Terraces',
    badge: 'Verdant',
    iconName: 'sprout',
    colors: {
      background: '#07140B',
      backgroundElevated: '#0C1F13',
      surface: '#11291A',
      surfaceElevated: '#173623',
      surfaceLight: 'rgba(23, 54, 35, 0.75)',
      surfaceGlass: 'rgba(17, 41, 26, 0.88)',
      surfaceGlassActive: 'rgba(27, 65, 42, 0.95)',
      primary: '#22C55E',
      primaryMuted: 'rgba(34, 197, 94, 0.16)',
      primaryGlow: 'rgba(34, 197, 94, 0.38)',
      primaryGradientStart: '#4ADE80',
      primaryGradientEnd: '#16A34A',
      primaryTextOnFill: '#041C0E',
      accent: '#84CC16',
      ...COMMON_TEXT,
      border: 'rgba(34, 197, 94, 0.14)',
      borderHighlight: 'rgba(34, 197, 94, 0.28)',
      borderActive: 'rgba(34, 197, 94, 0.55)',
      chartPalette: ['#22C55E', '#F59E0B', '#38BDF8', '#EC4899', '#A855F7', '#14B8A6', '#FB923C', '#EAB308'],
    },
    glowGradient: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.14) 0%, rgba(132, 204, 22, 0.07) 45%, transparent 72%)',
    metaColor: '#07140B',
    scenery: {
      landscapeName: 'Lush Green Valley & River Brook',
      title: 'Verdant Valley',
      telemetryLabel: 'VALLEY CANOPY',
      telemetryValue: '820m Sunlit Valley',
      ambientAtmosphere: 'Morning Mist & Rolling Emerald Terraces',
      quote: 'Endless emerald slopes where earth meets tranquil skies.',
      coordinates: '24.3636° N, 91.7315° E',
      badge: 'Verdant Oasis',
      elements: ['Rolling Hills', 'River Brook', 'Emerald Meadows', 'Morning Sun'],
    },
  },

  // Obsidian alias mapping for backwards-compatibility
  obsidian: {
    id: 'valley',
    name: 'Valley',
    label: 'Green Valley',
    subtitle: 'Verdant Meadows & River Terraces',
    badge: 'Verdant',
    iconName: 'sprout',
    colors: {
      background: '#07140B',
      backgroundElevated: '#0C1F13',
      surface: '#11291A',
      surfaceElevated: '#173623',
      surfaceLight: 'rgba(23, 54, 35, 0.75)',
      surfaceGlass: 'rgba(17, 41, 26, 0.88)',
      surfaceGlassActive: 'rgba(27, 65, 42, 0.95)',
      primary: '#22C55E',
      primaryMuted: 'rgba(34, 197, 94, 0.16)',
      primaryGlow: 'rgba(34, 197, 94, 0.38)',
      primaryGradientStart: '#4ADE80',
      primaryGradientEnd: '#16A34A',
      primaryTextOnFill: '#041C0E',
      accent: '#84CC16',
      ...COMMON_TEXT,
      border: 'rgba(34, 197, 94, 0.14)',
      borderHighlight: 'rgba(34, 197, 94, 0.28)',
      borderActive: 'rgba(34, 197, 94, 0.55)',
      chartPalette: ['#22C55E', '#F59E0B', '#38BDF8', '#EC4899', '#A855F7', '#14B8A6', '#FB923C', '#EAB308'],
    },
    glowGradient: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.14) 0%, rgba(132, 204, 22, 0.07) 45%, transparent 72%)',
    metaColor: '#07140B',
    scenery: {
      landscapeName: 'Lush Green Valley & River Brook',
      title: 'Verdant Valley',
      telemetryLabel: 'VALLEY CANOPY',
      telemetryValue: '820m Sunlit Valley',
      ambientAtmosphere: 'Morning Mist & Rolling Emerald Terraces',
      quote: 'Endless emerald slopes where earth meets tranquil skies.',
      coordinates: '24.3636° N, 91.7315° E',
      badge: 'Verdant Oasis',
      elements: ['Rolling Hills', 'River Brook', 'Emerald Meadows', 'Morning Sun'],
    },
  },

  // 2. Mountains (Alpine Summits & Glacial Slate)
  mountain: {
    id: 'mountain',
    name: 'Mountains',
    label: 'Alpine Heights',
    subtitle: 'Glacial Summits & Granite Ridges',
    badge: 'Expedition',
    iconName: 'mountain',
    colors: {
      background: '#090B14',
      backgroundElevated: '#0F1322',
      surface: '#151A30',
      surfaceElevated: '#1D2442',
      surfaceLight: 'rgba(29, 36, 66, 0.75)',
      surfaceGlass: 'rgba(21, 26, 48, 0.88)',
      surfaceGlassActive: 'rgba(33, 41, 75, 0.95)',
      primary: '#818CF8',
      primaryMuted: 'rgba(129, 140, 248, 0.16)',
      primaryGlow: 'rgba(129, 140, 248, 0.38)',
      primaryGradientStart: '#A5B4FC',
      primaryGradientEnd: '#6366F1',
      primaryTextOnFill: '#0D1127',
      accent: '#F59E0B',
      ...COMMON_TEXT,
      border: 'rgba(129, 140, 248, 0.15)',
      borderHighlight: 'rgba(129, 140, 248, 0.32)',
      borderActive: 'rgba(129, 140, 248, 0.60)',
      chartPalette: ['#818CF8', '#F59E0B', '#10B981', '#FB7185', '#38BDF8', '#C084FC', '#FB923C', '#2DD4BF'],
    },
    glowGradient: 'radial-gradient(ellipse at center, rgba(129, 140, 248, 0.16) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 72%)',
    metaColor: '#090B14',
    scenery: {
      landscapeName: 'Alpine Summits & Granite Ridge',
      title: 'Alpine Pass',
      telemetryLabel: 'ELEVATION BASE',
      telemetryValue: '2,840m Alpine Ridge',
      ambientAtmosphere: 'Sub-Zero Summit Mist & Glacial Air',
      quote: 'The high peaks pierce through mist where signal ends.',
      coordinates: '27.9881° N, 86.9250° E',
      badge: 'High Altitude Expedition',
      elements: ['Granite Ridges', 'Glacial Ice', 'Snow Peaks', 'Summit Alpenglow'],
    },
  },

  // 3. Sea (Oceanic Abyss & Bioluminescent Waves)
  sea: {
    id: 'sea',
    name: 'Sea',
    label: 'Oceanic Abyss',
    subtitle: 'Phosphorescent Marine & Coral Reef',
    badge: 'Coastal',
    iconName: 'waves',
    colors: {
      background: '#040D17',
      backgroundElevated: '#071626',
      surface: '#0B1E34',
      surfaceElevated: '#102844',
      surfaceLight: 'rgba(16, 40, 68, 0.75)',
      surfaceGlass: 'rgba(11, 30, 52, 0.88)',
      surfaceGlassActive: 'rgba(19, 47, 80, 0.95)',
      primary: '#38BDF8',
      primaryMuted: 'rgba(56, 189, 248, 0.16)',
      primaryGlow: 'rgba(56, 189, 248, 0.38)',
      primaryGradientStart: '#38BDF8',
      primaryGradientEnd: '#0284C7',
      primaryTextOnFill: '#032238',
      accent: '#2DD4BF',
      ...COMMON_TEXT,
      border: 'rgba(56, 189, 248, 0.14)',
      borderHighlight: 'rgba(56, 189, 248, 0.28)',
      borderActive: 'rgba(56, 189, 248, 0.55)',
      chartPalette: ['#38BDF8', '#FB7185', '#34D399', '#FBBF24', '#A78BFA', '#F43F5E', '#2DD4BF', '#FB923C'],
    },
    glowGradient: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.15) 0%, rgba(45, 212, 191, 0.08) 45%, transparent 72%)',
    metaColor: '#040D17',
    scenery: {
      landscapeName: 'Oceanic Trench & Coral Waves',
      title: 'Bioluminescent Abyss',
      telemetryLabel: 'TIDAL SURGE',
      telemetryValue: '120 Fathoms Marine Rift',
      ambientAtmosphere: 'Phosphorescent Swell & Saline Drift',
      quote: 'Tides surge with relentless mathematical rhythm.',
      coordinates: '11.3493° N, 142.1996° E',
      badge: 'Deep Ocean Odyssey',
      elements: ['Rolling Swells', 'Lighthouse Spire', 'Coral Silhouettes', 'Sun Rays'],
    },
  },

  // 4. Cities (Cyber Metropolis & Twilight Skyline)
  city: {
    id: 'city',
    name: 'Cities',
    label: 'Metropolis',
    subtitle: 'Tokyo Twilight & Neon Amber Glow',
    badge: 'Urban',
    iconName: 'building',
    colors: {
      background: '#0D0816',
      backgroundElevated: '#150D24',
      surface: '#1D1332',
      surfaceElevated: '#261942',
      surfaceLight: 'rgba(38, 25, 66, 0.75)',
      surfaceGlass: 'rgba(29, 19, 50, 0.88)',
      surfaceGlassActive: 'rgba(46, 31, 78, 0.95)',
      primary: '#F59E0B',
      primaryMuted: 'rgba(245, 158, 11, 0.16)',
      primaryGlow: 'rgba(245, 158, 11, 0.38)',
      primaryGradientStart: '#F59E0B',
      primaryGradientEnd: '#EC4899',
      primaryTextOnFill: '#1A0C00',
      accent: '#EC4899',
      ...COMMON_TEXT,
      border: 'rgba(245, 158, 11, 0.14)',
      borderHighlight: 'rgba(236, 72, 153, 0.28)',
      borderActive: 'rgba(245, 158, 11, 0.55)',
      chartPalette: ['#F59E0B', '#EC4899', '#06B6D4', '#A855F7', '#10B981', '#F43F5E', '#38BDF8', '#FACC15'],
    },
    glowGradient: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.12) 0%, rgba(245, 158, 11, 0.10) 45%, transparent 72%)',
    metaColor: '#0D0816',
    scenery: {
      landscapeName: 'Metropolis Skyline & Bridges',
      title: 'Neon Skyline Nexus',
      telemetryLabel: 'GRID MATRIX',
      telemetryValue: 'Sector 07 Megacity',
      ambientAtmosphere: 'Midnight Smog & Neon Amber Light',
      quote: 'A million glowing towers pulse in synchronized harmony.',
      coordinates: '35.6762° N, 139.6503° E',
      badge: 'Metropolitan Journey',
      elements: ['Stepped Towers', 'Suspension Bridge', 'Spire Beacons', 'Cyber Grid'],
    },
  },
};

// Mutable live COLORS mirror for backwards compatibility with static stylesheets
export const COLORS = {
  ...THEMES.valley.colors,
};

/** Sync the mutable COLORS reference when theme changes */
export function syncGlobalColors(themeId: ThemeId) {
  const chosen = THEMES[themeId] || THEMES.valley || THEMES.obsidian;
  Object.assign(COLORS, chosen.colors);
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const FONTS = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  webFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  glow: {
    shadowColor: '#38E586',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  glassCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
};

