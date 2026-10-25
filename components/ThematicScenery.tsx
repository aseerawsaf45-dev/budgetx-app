import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform, useWindowDimensions, Image } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Line,
  Polygon,
} from 'react-native-svg';
import { THEMES, ThemeId } from '../constants/theme';
import { useStore } from '../store/useStore';
import { Sparkles, MapPin } from 'lucide-react-native';

interface ThematicHeroPanoramaProps {
  themeId?: ThemeId;
  tourTitle?: string;
  destination?: string;
  days?: number;
  height?: number;
  showOverlayText?: boolean;
  style?: ViewStyle;
}

// -------------------------------------------------------------
// 1. MOUNTAIN PANORAMA (Alpine Summits & Evergreen Pine Ridge)
// -------------------------------------------------------------
function MountainPanoramaSvg({ height = 180 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs>
        <LinearGradient id="mntSky" x1="400" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#080914" />
          <Stop offset="55%" stopColor="#0E1228" />
          <Stop offset="100%" stopColor="#141A38" />
        </LinearGradient>
        <LinearGradient id="mntAurora" x1="100" y1="20" x2="700" y2="100" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#818CF8" stopOpacity={0} />
          <Stop offset="30%" stopColor="#A5B4FC" stopOpacity={0.25} />
          <Stop offset="70%" stopColor="#818CF8" stopOpacity={0.2} />
          <Stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="mntRidgeFar" x1="400" y1="40" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#252D56" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#11162E" stopOpacity={0.9} />
        </LinearGradient>
        <LinearGradient id="mntRidgeMid" x1="400" y1="90" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1E2548" />
          <Stop offset="100%" stopColor="#0D1126" />
        </LinearGradient>
        <LinearGradient id="mntForeRidge" x1="400" y1="140" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#161B36" />
          <Stop offset="100%" stopColor="#080A16" />
        </LinearGradient>
        <LinearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0.9} />
          <Stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.2} />
        </LinearGradient>
      </Defs>

      {/* Atmospheric Sky Backdrop */}
      <Rect width="800" height="240" fill="url(#mntSky)" />

      {/* Aurora Borealis Ribbon */}
      <Path
        d="M-50 90C120 40 280 110 460 60C640 10 750 80 850 50L850 0L-50 0Z"
        fill="url(#mntAurora)"
      />

      {/* Alpine Moon / Sun Orb */}
      <Circle cx="640" cy="55" r="32" fill="#818CF8" fillOpacity={0.12} />
      <Circle cx="640" cy="55" r="22" fill="#F59E0B" fillOpacity={0.3} />
      <Circle cx="640" cy="55" r="14" fill="#FEF3C7" fillOpacity={0.85} />

      {/* Topographic Contour Sky Lines */}
      <Path d="M0 60C200 40 400 90 800 50" stroke="#818CF8" strokeWidth="0.8" strokeDasharray="3 4" opacity={0.3} />
      <Path d="M0 85C250 65 500 115 800 75" stroke="#818CF8" strokeWidth="0.8" strokeDasharray="4 6" opacity={0.2} />

      {/* Layer 1: Distant High Peaks (Himalayan Silhouette) */}
      <Path
        d="M-20 180L110 95L210 145L340 70L460 140L570 85L690 150L820 90L820 240L-20 240Z"
        fill="url(#mntRidgeFar)"
      />
      {/* Snow Caps for Distant Peaks */}
      <Polygon points="340,70 310,105 330,110 345,100 365,115 370,105" fill="url(#snowGrad)" />
      <Polygon points="570,85 550,110 565,115 585,112 590,102" fill="url(#snowGrad)" />

      {/* Layer 2: Middle Jagged Crags & Ravines */}
      <Path
        d="M-20 200L70 140L170 170L280 120L390 175L510 130L630 180L750 135L820 160L820 240L-20 240Z"
        fill="url(#mntRidgeMid)"
      />

      {/* Layer 3: Foreground Foothill Ridge with Pine Silhouette Tree Line */}
      <Path
        d="M-20 220C80 190 190 205 310 185C430 165 560 195 680 180C740 172 790 185 820 188L820 240L-20 240Z"
        fill="url(#mntForeRidge)"
      />

      {/* Evergreen Pine Trees Silhouettes along Foreground */}
      {[25, 45, 60, 95, 115, 160, 180, 240, 260, 310, 330, 410, 435, 490, 520, 570, 610, 650, 700, 730, 770].map((x, i) => {
        const h = 18 + (i % 4) * 6;
        const yBase = 195 + (i % 3) * 6;
        return (
          <G key={i} opacity={0.85}>
            <Polygon
              points={`${x},${yBase - h} ${x - 5},${yBase - h * 0.45} ${x - 3},${yBase - h * 0.45} ${x - 7},${yBase} ${x + 7},${yBase} ${x + 3},${yBase - h * 0.45} ${x + 5},${yBase - h * 0.45}`}
              fill="#061A12"
            />
            <Line x1={x} y1={yBase} x2={x} y2={yBase + 4} stroke="#030C08" strokeWidth={1.5} />
          </G>
        );
      })}

      {/* Glowing Alpine Trail / River Ribbon */}
      <Path
        d="M260 240C290 220 330 205 360 190C390 175 410 180 430 175"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.65}
      />
    </Svg>
  );
}

// -------------------------------------------------------------
// 2. SEA PANORAMA (Oceanic Abyss, Rolling Waves & Coastal Sun)
// -------------------------------------------------------------
function SeaPanoramaSvg({ height = 180 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs>
        <LinearGradient id="seaSky" x1="400" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#020914" />
          <Stop offset="50%" stopColor="#051B30" />
          <Stop offset="100%" stopColor="#0B2D4F" />
        </LinearGradient>
        <LinearGradient id="seaWaveFar" x1="400" y1="110" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#0A365C" />
          <Stop offset="100%" stopColor="#031627" />
        </LinearGradient>
        <LinearGradient id="seaWaveMid" x1="400" y1="140" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#0284C7" />
          <Stop offset="100%" stopColor="#021E36" />
        </LinearGradient>
        <LinearGradient id="seaWaveClose" x1="400" y1="170" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#041829" />
        </LinearGradient>
        <RadialGradient id="sunShaft" cx="400" cy="40" r="260" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38BDF8" stopOpacity={0.3} />
          <Stop offset="50%" stopColor="#2DD4BF" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#020914" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Deep Ocean Sky */}
      <Rect width="800" height="240" fill="url(#seaSky)" />

      {/* Sun Rays Diffusion */}
      <Rect width="800" height="240" fill="url(#sunShaft)" />

      {/* Luminous Coastal Moon */}
      <Circle cx="160" cy="50" r="30" fill="#38BDF8" fillOpacity={0.12} />
      <Circle cx="160" cy="50" r="18" fill="#2DD4BF" fillOpacity={0.25} />
      <Circle cx="160" cy="50" r="10" fill="#E0F2FE" fillOpacity={0.9} />

      {/* Distant Archipelago / Islands Silhouette */}
      <Path
        d="M320 125C350 115 390 118 420 125C440 120 470 122 490 126L820 126L-20 126Z"
        fill="#041A2D"
        opacity={0.6}
      />
      {/* Distant Lighthouse Spire */}
      <Polygon points="410,105 408,124 412,124" fill="#38BDF8" opacity={0.8} />
      <Circle cx="410" cy="104" r="2.5" fill="#FDE047" />

      {/* Soaring Marine Seabirds */}
      <Path d="M220 50Q226 44 232 50Q238 44 244 50" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" opacity={0.65} />
      <Path d="M250 62Q255 57 260 62Q265 57 270 62" stroke="#7DD3FC" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
      <Path d="M680 45Q686 39 692 45Q698 39 704 45" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" opacity={0.6} />

      {/* Layer 1: Distant Ocean Swell */}
      <Path
        d="M-20 135C60 128 140 138 220 132C300 126 380 136 460 130C540 124 620 135 700 130C750 127 790 132 820 134L820 240L-20 240Z"
        fill="url(#seaWaveFar)"
      />

      {/* Layer 2: Mid-Ocean Rolling Breaker */}
      <Path
        d="M-20 162C80 148 160 168 260 152C360 138 460 165 560 150C660 138 740 158 820 152L820 240L-20 240Z"
        fill="url(#seaWaveMid)"
      />
      {/* Foam Crest Highlight */}
      <Path
        d="M-20 162C80 148 160 168 260 152C360 138 460 165 560 150C660 138 740 158 820 152"
        stroke="#67E8F9"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* Layer 3: Foreground Bioluminescent Surge Wave */}
      <Path
        d="M-20 198C70 178 180 205 290 182C400 160 520 198 640 175C720 162 770 180 820 178L820 240L-20 240Z"
        fill="url(#seaWaveClose)"
      />
      {/* Bioluminescent Spray Curve */}
      <Path
        d="M-20 198C70 178 180 205 290 182C400 160 520 198 640 175C720 162 770 180 820 178"
        stroke="#A5F3FC"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={0.8}
      />

      {/* Water Ripples & Shimmer Lines */}
      <Path d="M80 215C130 213 180 218 230 215" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" opacity={0.6} />
      <Path d="M350 220C420 216 480 222 550 218" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
      <Path d="M620 210C670 207 720 212 770 209" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

// -------------------------------------------------------------
// 3. CITY PANORAMA (Metropolis Skyline, Suspension Bridge & Spire)
// -------------------------------------------------------------
function CityPanoramaSvg({ height = 180 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs>
        <LinearGradient id="citySky" x1="400" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#0B0614" />
          <Stop offset="50%" stopColor="#190B28" />
          <Stop offset="100%" stopColor="#2A1442" />
        </LinearGradient>
        <LinearGradient id="cityTowerFar" x1="400" y1="40" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#25123A" />
          <Stop offset="100%" stopColor="#0D0717" />
        </LinearGradient>
        <LinearGradient id="cityTowerMid" x1="400" y1="70" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#3C1A5C" />
          <Stop offset="100%" stopColor="#140822" />
        </LinearGradient>
        <LinearGradient id="bridgeCables" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="50%" stopColor="#EC4899" />
          <Stop offset="100%" stopColor="#A855F7" />
        </LinearGradient>
      </Defs>

      {/* Twilight Cyber Sky */}
      <Rect width="800" height="240" fill="url(#citySky)" />

      {/* Cyber Neon Sun */}
      <Circle cx="660" cy="65" r="40" fill="#EC4899" fillOpacity={0.15} />
      <Circle cx="660" cy="65" r="26" fill="#F59E0B" fillOpacity={0.3} />
      <Circle cx="660" cy="65" r="16" fill="#FDE68A" fillOpacity={0.85} />

      {/* Layer 1: Distant Background Skyscraper Silhouettes */}
      <G fill="url(#cityTowerFar)" opacity={0.6}>
        <Rect x="40" y="80" width="35" height="160" />
        <Rect x="85" y="60" width="45" height="180" />
        <Polygon points="107,35 95,60 120,60" />
        <Rect x="150" y="90" width="30" height="150" />
        <Rect x="200" y="70" width="55" height="170" />
        <Rect x="280" y="100" width="40" height="140" />
        <Rect x="520" y="65" width="45" height="175" />
        <Rect x="585" y="85" width="35" height="155" />
        <Rect x="640" y="55" width="50" height="185" />
        <Polygon points="665,30 650,55 680,55" />
        <Rect x="710" y="95" width="40" height="145" />
      </G>

      {/* Layer 2: Midground High-Rise Towers with Glowing Windows */}
      <G fill="url(#cityTowerMid)">
        <Rect x="15" y="110" width="50" height="130" />
        <Rect x="80" y="90" width="60" height="150" />
        <Rect x="160" y="80" width="65" height="160" />
        <Polygon points="192,50 180,80 205,80" fill="#EC4899" opacity={0.4} />
        {/* Antenna spire with beacon */}
        <Line x1="192.5" y1="28" x2="192.5" y2="50" stroke="#F59E0B" strokeWidth={1.5} />
        <Circle cx="192.5" cy="27" r="2" fill="#EC4899" />

        <Rect x="245" y="115" width="45" height="125" />
        <Rect x="305" y="75" width="70" height="165" />
        <Rect x="460" y="80" width="60" height="160" />
        <Rect x="540" y="105" width="45" height="135" />
        <Rect x="605" y="70" width="65" height="170" />
        <Line x1="637.5" y1="35" x2="637.5" y2="70" stroke="#F59E0B" strokeWidth={1.5} />
        <Circle cx="637.5" cy="34" r="2" fill="#F59E0B" />

        <Rect x="690" y="110" width="55" height="130" />
        <Rect x="760" y="85" width="50" height="155" />
      </G>

      {/* Illuminated Window Matrices across Main Towers */}
      {[
        { x: 92, y: 105 }, { x: 105, y: 105 }, { x: 118, y: 105 },
        { x: 92, y: 120 }, { x: 105, y: 120 }, { x: 118, y: 120 },
        { x: 92, y: 135 }, { x: 118, y: 135 },
        { x: 172, y: 95 }, { x: 185, y: 95 }, { x: 200, y: 95 },
        { x: 172, y: 110 }, { x: 185, y: 110 },
        { x: 172, y: 125 }, { x: 200, y: 125 },
        { x: 318, y: 90 }, { x: 332, y: 90 }, { x: 348, y: 90 },
        { x: 318, y: 105 }, { x: 348, y: 105 },
        { x: 318, y: 120 }, { x: 332, y: 120 },
        { x: 618, y: 85 }, { x: 632, y: 85 }, { x: 648, y: 85 },
        { x: 618, y: 100 }, { x: 648, y: 100 },
        { x: 618, y: 115 }, { x: 632, y: 115 },
      ].map((pt, i) => (
        <Rect key={i} x={pt.x} y={pt.y} width={5} height={4} rx={1} fill={i % 3 === 0 ? '#FDE68A' : '#F59E0B'} opacity={0.8} />
      ))}

      {/* Layer 3: Grand Suspension Bridge Span */}
      {/* Bridge Pylons */}
      <Rect x="385" y="90" width="8" height="150" fill="#4C1D95" stroke="#EC4899" strokeWidth={1} />
      <Rect x="430" y="90" width="8" height="150" fill="#4C1D95" stroke="#EC4899" strokeWidth={1} />
      <Line x1="385" y1="120" x2="438" y2="120" stroke="#F59E0B" strokeWidth={1.5} />
      <Line x1="385" y1="150" x2="438" y2="150" stroke="#F59E0B" strokeWidth={1.5} />

      {/* Suspension Main Cables */}
      <Path d="M260 195Q389 105 434 105Q560 195 590 195" stroke="url(#bridgeCables)" strokeWidth={2.2} fill="none" opacity={0.9} />
      {/* Vertical Suspenders */}
      {[290, 315, 340, 365, 455, 480, 505, 530, 555].map((x, i) => (
        <Line key={i} x1={x} y1={140 + Math.abs(x - 410) * 0.3} x2={x} y2={195} stroke="#EC4899" strokeWidth={0.8} opacity={0.5} />
      ))}

      {/* Bridge Deck Roadway with Glowing Traffic Streak */}
      <Rect x="0" y="195" width="800" height="8" fill="#1E0E35" stroke="#EC4899" strokeWidth={0.8} />
      <Line x1="0" y1="198" x2="800" y2="198" stroke="#F59E0B" strokeWidth={1.8} strokeDasharray="16 8" opacity={0.9} />

      {/* River Waterfront Reflections */}
      <Rect x="0" y="203" width="800" height="37" fill="#0C0517" />
      <Line x1="120" y1="212" x2="220" y2="212" stroke="#F59E0B" strokeWidth={1} opacity={0.4} />
      <Line x1="340" y1="216" x2="480" y2="216" stroke="#EC4899" strokeWidth={1.5} opacity={0.5} />
      <Line x1="580" y1="214" x2="680" y2="214" stroke="#F59E0B" strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

// -------------------------------------------------------------
// 4. GREEN VALLEY PANORAMA (Emerald Terraces, River Brook & Sun)
// -------------------------------------------------------------
function ValleyPanoramaSvg({ height = 180 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs>
        <LinearGradient id="valSky" x1="400" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#05140A" />
          <Stop offset="55%" stopColor="#0C2614" />
          <Stop offset="100%" stopColor="#143B20" />
        </LinearGradient>
        <LinearGradient id="valHillFar" x1="400" y1="60" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#16532B" />
          <Stop offset="100%" stopColor="#072010" />
        </LinearGradient>
        <LinearGradient id="valHillMid" x1="400" y1="100" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1E753C" />
          <Stop offset="100%" stopColor="#0A2C16" />
        </LinearGradient>
        <LinearGradient id="valHillClose" x1="400" y1="140" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#22C55E" />
          <Stop offset="100%" stopColor="#0C3B1D" />
        </LinearGradient>
        <LinearGradient id="riverGrad" x1="400" y1="110" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
          <Stop offset="100%" stopColor="#0284C7" stopOpacity={0.9} />
        </LinearGradient>
      </Defs>

      {/* Verdant Sky */}
      <Rect width="800" height="240" fill="url(#valSky)" />

      {/* Sun / Golden Morning Glow */}
      <Circle cx="580" cy="50" r="36" fill="#FBBF24" fillOpacity={0.12} />
      <Circle cx="580" cy="50" r="22" fill="#F59E0B" fillOpacity={0.25} />
      <Circle cx="580" cy="50" r="14" fill="#FEF3C7" fillOpacity={0.85} />

      {/* Drifting Valley Clouds */}
      <Path d="M120 45Q140 35 165 42Q190 35 210 45Q220 52 210 60Q160 62 120 60Z" fill="#E2E8F0" fillOpacity={0.15} />
      <Path d="M640 65Q660 55 685 62Q710 55 730 65Q740 72 730 80Q680 82 640 80Z" fill="#E2E8F0" fillOpacity={0.12} />

      {/* Layer 1: Distant Misty Valley Ridges */}
      <Path
        d="M-20 130C100 95 240 140 380 110C520 80 660 125 820 100L820 240L-20 240Z"
        fill="url(#valHillFar)"
      />

      {/* Layer 2: Middle Rolling Terraced Hills */}
      <Path
        d="M-20 160C140 135 280 180 440 145C600 115 720 160 820 140L820 240L-20 240Z"
        fill="url(#valHillMid)"
      />

      {/* Layer 3: Winding Valley River Brook */}
      <Path
        d="M440 145C420 165 460 185 410 205C380 220 390 235 370 240L420 240C440 235 430 220 460 205C510 185 470 165 440 145Z"
        fill="url(#riverGrad)"
      />
      <Path
        d="M440 145C420 165 460 185 410 205C380 220 390 235 370 240"
        stroke="#67E8F9"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Layer 4: Foreground Rolling Lush Meadow */}
      <Path
        d="M-20 195C90 170 220 205 340 185C460 165 600 195 720 180C770 175 800 182 820 185L820 240L-20 240Z"
        fill="url(#valHillClose)"
        stroke="#4ADE80"
        strokeWidth={1}
      />

      {/* Terraced Tea / Meadow Contour Lines */}
      <Path d="M40 205C120 190 200 215 280 205" stroke="#86EFAC" strokeWidth={1} strokeDasharray="6 4" opacity={0.4} />
      <Path d="M520 195C600 185 680 205 760 195" stroke="#86EFAC" strokeWidth={1} strokeDasharray="6 4" opacity={0.4} />
      <Path d="M80 220C160 210 260 225 340 218" stroke="#86EFAC" strokeWidth={1} strokeDasharray="8 6" opacity={0.3} />
    </Svg>
  );
}

// -------------------------------------------------------------
// 5. MASTER THEMATIC HERO PANORAMA COMPONENT
// -------------------------------------------------------------
export const SCENERY_ASSETS: Record<ThemeId, any> = {
  valley: require('../assets/scenery/valley.jpg'),
  mountain: require('../assets/scenery/mountain.jpg'),
  sea: require('../assets/scenery/sea.jpg'),
  city: require('../assets/scenery/city.jpg'),
  obsidian: require('../assets/scenery/valley.jpg'),
};

export const THEME_OBJECT_POSITIONS: Record<string, string> = {
  valley: 'center 75%', // highlights lush green rolling hills, river valley & morning sunlight
  mountain: 'center 50%', // highlights alpine summits and pine forest ridge
  sea: 'center 62%', // highlights ocean swells, waves & coastal headland
  city: 'center 70%', // highlights skyscraper towers, suspension bridge & glowing twilight lights
  obsidian: 'center 75%',
};

export const ThematicHeroPanorama: React.FC<ThematicHeroPanoramaProps> = ({
  themeId,
  tourTitle,
  destination,
  days,
  height = 240,
  showOverlayText = true,
  style,
}) => {
  const currentThemeId = useStore((state) => state.theme) || 'valley';
  const effectiveThemeId = themeId || currentThemeId;
  const config = THEMES[effectiveThemeId] || THEMES.valley || THEMES.obsidian;
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [imageError, setImageError] = React.useState(false);

  const scenerySource = SCENERY_ASSETS[effectiveThemeId] || SCENERY_ASSETS.valley;

  const renderPanoramaSvg = () => {
    switch (effectiveThemeId) {
      case 'valley':
      case 'obsidian':
        return <ValleyPanoramaSvg height={height} />;
      case 'mountain':
        return <MountainPanoramaSvg height={height} />;
      case 'sea':
        return <SeaPanoramaSvg height={height} />;
      case 'city':
        return <CityPanoramaSvg height={height} />;
      default:
        return <ValleyPanoramaSvg height={height} />;
    }
  };

  return (
    <View style={[styles.panoramaCard, { borderColor: config.colors.border }, style]}>
      {/* Background Gemini Photorealistic Scenery with SVG Fallback */}
      <View style={[styles.imageWrapper, { height }]}>
        {!imageError ? (
          <Image
            source={scenerySource}
            style={[
              StyleSheet.absoluteFillObject,
              { width: '100%', height: '100%' },
              Platform.OS === 'web'
                ? ({
                    objectFit: 'cover',
                    objectPosition: THEME_OBJECT_POSITIONS[effectiveThemeId] || 'center 65%',
                    filter: 'contrast(1.05) saturate(1.1)',
                  } as any)
                : undefined,
            ]}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.svgWrapper, { height }]}>
            {renderPanoramaSvg()}
          </View>
        )}

        {/* Calibrated Bottom Vignette (covers only 46% so the landscape remains vibrant & unobstructed) */}
        <View
          style={[
            styles.bottomVignette,
            Platform.OS === 'web'
              ? ({
                  backgroundImage: `linear-gradient(to top, ${config.colors.background}FA 0%, ${config.colors.background}85 45%, transparent 100%)`,
                } as any)
              : { backgroundColor: `${config.colors.background}99` },
          ]}
        />
      </View>

      {/* Optional Overlay Title & Destination Pill */}
      {showOverlayText && (tourTitle || destination) && (
        <View style={styles.overlayContent}>
          {destination && (
            <View style={styles.destinationRow}>
              <MapPin size={13} color={config.colors.primary} />
              <Text style={[styles.destinationText, { color: config.colors.primary }]}>
                {destination.toUpperCase()}
              </Text>
              {days !== undefined && (
                <Text style={styles.daysBadge}>• {days} {days === 1 ? 'DAY' : 'DAYS'}</Text>
              )}
            </View>
          )}

          {tourTitle && (
            <Text style={styles.overlayTitle} numberOfLines={2}>
              {tourTitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// -------------------------------------------------------------
// 6. MINI SCENIC PREVIEW FOR THEME SWITCHER
// -------------------------------------------------------------
export function ThematicMiniScene({ themeId, height = 54 }: { themeId: ThemeId; height?: number }) {
  const [imageError, setImageError] = React.useState(false);
  const imageSource = SCENERY_ASSETS[themeId] || SCENERY_ASSETS.valley;

  const renderSvgFallback = () => {
    switch (themeId) {
      case 'valley':
      case 'obsidian':
        return <ValleyPanoramaSvg height={height} />;
      case 'mountain':
        return <MountainPanoramaSvg height={height} />;
      case 'sea':
        return <SeaPanoramaSvg height={height} />;
      case 'city':
        return <CityPanoramaSvg height={height} />;
      default:
        return <ValleyPanoramaSvg height={height} />;
    }
  };

  return (
    <View style={[styles.miniSceneContainer, { height }]}>
      {!imageError ? (
        <>
          <Image
            source={imageSource}
            style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              Platform.OS === 'web'
                ? ({
                    backgroundImage: 'linear-gradient(to top, rgba(5, 8, 14, 0.88) 0%, rgba(5, 8, 14, 0.25) 60%, transparent 100%)',
                  } as any)
                : { backgroundColor: 'rgba(5, 8, 14, 0.35)' },
            ]}
          />
        </>
      ) : (
        renderSvgFallback()
      )}
    </View>
  );
}

// -------------------------------------------------------------
// 7. THEMATIC TELEMETRY ENVIRONMENTAL WIDGET
// -------------------------------------------------------------
export function ThematicTelemetryWidget(_props?: { themeId?: ThemeId }) {
  return null;
}

// -------------------------------------------------------------
// 8. DYNAMIC THEMATIC BACKGROUND ELEMENTS & AMBIENCE
// -------------------------------------------------------------
export function ThematicBackgroundElements({ themeId }: { themeId?: ThemeId }) {
  const currentThemeId = useStore((state) => state.theme) || 'valley';
  const effectiveThemeId = themeId || currentThemeId;
  const config = THEMES[effectiveThemeId] || THEMES.valley || THEMES.obsidian;

  return (
    <View pointerEvents="none" style={styles.bgElementsContainer}>
      {/* 1. Theme-Specific Luminous Ambient Glow Orbs */}
      {effectiveThemeId === 'valley' || effectiveThemeId === 'obsidian' ? (
        <>
          <View style={[styles.ambientOrb, styles.valleyOrbTopRight]} />
          <View style={[styles.ambientOrb, styles.valleyOrbTopLeft]} />
          <View style={[styles.ambientOrb, styles.valleyOrbMid]} />
        </>
      ) : effectiveThemeId === 'mountain' ? (
        <>
          <View style={[styles.ambientOrb, styles.mountainOrbTop]} />
          <View style={[styles.ambientOrb, styles.mountainOrbRight]} />
          <View style={[styles.ambientOrb, styles.mountainOrbBottom]} />
        </>
      ) : effectiveThemeId === 'sea' ? (
        <>
          <View style={[styles.ambientOrb, styles.seaOrbTop]} />
          <View style={[styles.ambientOrb, styles.seaOrbLeft]} />
          <View style={[styles.ambientOrb, styles.seaOrbBottom]} />
        </>
      ) : (
        <>
          <View style={[styles.ambientOrb, styles.cityOrbTopLeft]} />
          <View style={[styles.ambientOrb, styles.cityOrbTopRight]} />
          <View style={[styles.ambientOrb, styles.cityOrbMid]} />
        </>
      )}

      {/* 2. Theme-Specific Vector Contour Patterns & Motifs */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject} fill="none">
        <Defs>
          <LinearGradient id="bgContourGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={config.colors.primary} stopOpacity={0.14} />
            <Stop offset="50%" stopColor={config.colors.accent} stopOpacity={0.07} />
            <Stop offset="100%" stopColor={config.colors.primary} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        {/* Valley: Rolling Terrace Contours & Dewdrop Particles */}
        {(effectiveThemeId === 'valley' || effectiveThemeId === 'obsidian') && (
          <G opacity={0.85}>
            {/* Topographic Terrace Curves */}
            <Path d="M-50 180C180 120 320 220 540 160C760 100 880 200 1100 150" stroke="url(#bgContourGrad)" strokeWidth="1.2" strokeDasharray="8 6" />
            <Path d="M-50 320C150 260 380 340 600 280C820 220 950 300 1150 250" stroke="url(#bgContourGrad)" strokeWidth="1" strokeDasharray="12 8" />
            <Path d="M-50 480C200 420 420 520 680 440C940 360 1020 460 1200 410" stroke="url(#bgContourGrad)" strokeWidth="1.4" strokeDasharray="16 10" />
            <Path d="M-50 680C160 620 440 700 720 630C1000 560 1080 660 1250 600" stroke="url(#bgContourGrad)" strokeWidth="1" />
            <Path d="M-50 900C220 840 480 920 760 850C1040 780 1120 880 1300 820" stroke="url(#bgContourGrad)" strokeWidth="1.2" strokeDasharray="10 8" />

            {/* Dewdrop Light Nodes */}
            {[
              { cx: 80, cy: 140, r: 2.2 },
              { cx: 240, cy: 260, r: 1.8 },
              { cx: 460, cy: 190, r: 2.5 },
              { cx: 720, cy: 310, r: 2.0 },
              { cx: 890, cy: 210, r: 2.2 },
              { cx: 160, cy: 520, r: 2.0 },
              { cx: 380, cy: 460, r: 2.5 },
              { cx: 620, cy: 580, r: 1.8 },
              { cx: 840, cy: 510, r: 2.2 },
              { cx: 960, cy: 640, r: 2.8 },
              { cx: 290, cy: 750, r: 2.0 },
              { cx: 540, cy: 820, r: 2.2 },
              { cx: 780, cy: 740, r: 1.8 },
            ].map((pt, i) => (
              <Circle key={i} cx={pt.cx} cy={pt.cy} r={pt.r} fill={config.colors.primary} fillOpacity={0.45} />
            ))}

            {/* Leaf Sprig Vector in corner */}
            <Path d="M40 80C55 60 75 65 85 85C70 88 50 82 40 80Z" fill={config.colors.primary} fillOpacity={0.08} />
            <Path d="M85 85C100 65 120 70 130 90C115 93 95 87 85 85Z" fill={config.colors.primary} fillOpacity={0.06} />
          </G>
        )}

        {/* Mountain: Jagged Alpine Peaks & Elevation Grids */}
        {effectiveThemeId === 'mountain' && (
          <G opacity={0.85}>
            {/* Mountain Crest Vectors */}
            <Path d="M-40 260L120 160L240 220L400 130L560 210L720 140L880 230L1040 150L1160 240" stroke="url(#bgContourGrad)" strokeWidth="1.5" />
            <Path d="M-40 440L140 330L290 390L460 300L640 400L820 310L990 410L1160 320" stroke="url(#bgContourGrad)" strokeWidth="1.2" strokeDasharray="10 6" />
            <Path d="M-40 680L160 560L340 630L520 530L710 640L900 540L1080 650" stroke="url(#bgContourGrad)" strokeWidth="1" strokeDasharray="6 8" />

            {/* High Altitude Elevation Indicators */}
            <Line x1="40" y1="180" x2="160" y2="180" stroke="#818CF8" strokeWidth="0.8" opacity={0.25} />
            <Line x1="40" y1="360" x2="180" y2="360" stroke="#818CF8" strokeWidth="0.8" opacity={0.2} />
            <Line x1="40" y1="580" x2="200" y2="580" stroke="#818CF8" strokeWidth="0.8" opacity={0.15} />

            {/* Alpine Summit Star Nodes */}
            {[
              { cx: 400, cy: 130 },
              { cx: 720, cy: 140 },
              { cx: 460, cy: 300 },
              { cx: 820, cy: 310 },
              { cx: 520, cy: 530 },
              { cx: 900, cy: 540 },
            ].map((pt, i) => (
              <G key={i}>
                <Circle cx={pt.cx} cy={pt.cy} r={3} fill="#818CF8" fillOpacity={0.6} />
                <Circle cx={pt.cx} cy={pt.cy} r={6} stroke="#F59E0B" strokeWidth={0.8} strokeDasharray="2 3" opacity={0.4} />
              </G>
            ))}
          </G>
        )}

        {/* Sea: Fluid Sinuous Wave Contours & Depth Rings */}
        {effectiveThemeId === 'sea' && (
          <G opacity={0.85}>
            {/* Marine Swell Waves */}
            <Path d="M-50 160C80 120 180 190 320 150C460 110 580 180 720 140C860 100 980 170 1120 130" stroke="url(#bgContourGrad)" strokeWidth="1.5" />
            <Path d="M-50 280C90 240 210 310 350 270C490 230 610 300 750 260C890 220 1010 290 1150 250" stroke="url(#bgContourGrad)" strokeWidth="1.2" strokeDasharray="8 6" />
            <Path d="M-50 420C70 380 200 450 340 410C480 370 600 440 740 400C880 360 1000 430 1140 390" stroke="url(#bgContourGrad)" strokeWidth="1.3" />
            <Path d="M-50 590C100 550 220 620 370 580C520 540 640 610 790 570C940 530 1040 600 1180 560" stroke="url(#bgContourGrad)" strokeWidth="1" strokeDasharray="12 8" />
            <Path d="M-50 780C80 740 210 810 360 770C510 730 630 800 780 760C930 720 1050 790 1200 750" stroke="url(#bgContourGrad)" strokeWidth="1.2" />

            {/* Depth Sonar Rings */}
            <Circle cx="880" cy="220" r="45" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="4 6" opacity={0.25} />
            <Circle cx="880" cy="220" r="75" stroke="#2DD4BF" strokeWidth="0.6" strokeDasharray="6 8" opacity={0.18} />
            <Circle cx="180" cy="650" r="55" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="4 6" opacity={0.2} />

            {/* Bioluminescent Plankton Clusters */}
            {[
              { cx: 120, cy: 190 }, { cx: 280, cy: 230 }, { cx: 480, cy: 170 },
              { cx: 660, cy: 220 }, { cx: 230, cy: 450 }, { cx: 420, cy: 390 },
              { cx: 620, cy: 470 }, { cx: 820, cy: 410 }, { cx: 310, cy: 720 },
              { cx: 580, cy: 680 }, { cx: 760, cy: 730 }, { cx: 940, cy: 690 },
            ].map((pt, i) => (
              <Circle key={i} cx={pt.cx} cy={pt.cy} r={2} fill="#38BDF8" fillOpacity={0.55} />
            ))}
          </G>
        )}

        {/* City: Cyber Matrix Perspective Lattice & Skyline Beacons */}
        {effectiveThemeId === 'city' && (
          <G opacity={0.85}>
            {/* Perspective Horizon Rays */}
            <Line x1="480" y1="120" x2="-100" y2="900" stroke="url(#bgContourGrad)" strokeWidth="1.2" />
            <Line x1="480" y1="120" x2="100" y2="900" stroke="url(#bgContourGrad)" strokeWidth="1" />
            <Line x1="480" y1="120" x2="320" y2="900" stroke="url(#bgContourGrad)" strokeWidth="0.9" />
            <Line x1="480" y1="120" x2="640" y2="900" stroke="url(#bgContourGrad)" strokeWidth="0.9" />
            <Line x1="480" y1="120" x2="860" y2="900" stroke="url(#bgContourGrad)" strokeWidth="1" />
            <Line x1="480" y1="120" x2="1080" y2="900" stroke="url(#bgContourGrad)" strokeWidth="1.2" />

            {/* Horizontal Cyber Grid Crossbars */}
            <Line x1="-40" y1="240" x2="1100" y2="240" stroke="#EC4899" strokeWidth="0.8" strokeDasharray="16 8" opacity={0.25} />
            <Line x1="-40" y1="360" x2="1100" y2="360" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="20 10" opacity={0.22} />
            <Line x1="-40" y1="520" x2="1100" y2="520" stroke="#EC4899" strokeWidth="1" opacity={0.2} />
            <Line x1="-40" y1="720" x2="1100" y2="720" stroke="#F59E0B" strokeWidth={1.2} strokeDasharray="12 6" opacity={0.25} />

            {/* Tower Beacon Sparks */}
            {[
              { cx: 120, cy: 360 }, { cx: 320, cy: 360 }, { cx: 640, cy: 360 }, { cx: 860, cy: 360 },
              { cx: 100, cy: 520 }, { cx: 480, cy: 520 }, { cx: 860, cy: 520 },
              { cx: 220, cy: 720 }, { cx: 560, cy: 720 }, { cx: 780, cy: 720 },
            ].map((pt, i) => (
              <G key={i}>
                <Circle cx={pt.cx} cy={pt.cy} r={2.5} fill="#F59E0B" fillOpacity={0.8} />
                <Circle cx={pt.cx} cy={pt.cy} r={5} stroke="#EC4899" strokeWidth={0.8} opacity={0.5} />
              </G>
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  panoramaCard: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
      },
    }),
  },
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#070A10',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 38,
    zIndex: 1,
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, transparent 100%)',
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  svgWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  bottomVignette: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '46%',
    zIndex: 1,
  },
  miniSceneContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#070A10',
  },
  topTelemetryRow: {
    position: 'absolute',
    top: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  telemetryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  telemetryChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgeChipText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  daysBadge: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  overlayTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
    ...Platform.select({
      web: {
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
      },
    }),
  },
  sceneryQuoteText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  telemetryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  telemetryHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  telemetryCoords: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  telemetryLandscapeName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  telemetryAtmosphereText: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  elementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  elementPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  elementText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Thematic Dynamic Background Elements
  bgElementsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 9999,
    ...Platform.select({
      web: {
        filter: 'blur(90px)',
        transform: 'translateZ(0)',
      },
      default: {
        opacity: 0.16,
      },
    }),
  },

  // Valley Theme Ambient Glows (Lush Emerald & Lime Dew)
  valleyOrbTopRight: {
    top: -70,
    right: -50,
    width: 380,
    height: 380,
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
  },
  valleyOrbTopLeft: {
    top: 260,
    left: -90,
    width: 320,
    height: 320,
    backgroundColor: 'rgba(74, 222, 128, 0.10)',
  },
  valleyOrbMid: {
    top: 640,
    right: -100,
    width: 420,
    height: 420,
    backgroundColor: 'rgba(16, 185, 129, 0.11)',
  },

  // Mountain Theme Ambient Glows (Alpine Sunrise Amber & Glacial Indigo)
  mountainOrbTop: {
    top: -80,
    right: -60,
    width: 380,
    height: 380,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  mountainOrbRight: {
    top: 280,
    left: -80,
    width: 320,
    height: 320,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
  },
  mountainOrbBottom: {
    top: 660,
    right: -80,
    width: 420,
    height: 420,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },

  // Sea Theme Ambient Glows (Cyan Bioluminescence & Marine Teal)
  seaOrbTop: {
    top: -70,
    left: -70,
    width: 380,
    height: 380,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  seaOrbLeft: {
    top: 320,
    right: -90,
    width: 340,
    height: 340,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
  },
  seaOrbBottom: {
    top: 700,
    left: -80,
    width: 440,
    height: 440,
    backgroundColor: 'rgba(56, 189, 248, 0.11)',
  },

  // City Theme Ambient Glows (Neon Amber & Cyber Magenta Twilight)
  cityOrbTopLeft: {
    top: -80,
    right: -60,
    width: 400,
    height: 400,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  cityOrbTopRight: {
    top: 300,
    left: -100,
    width: 340,
    height: 340,
    backgroundColor: 'rgba(217, 70, 239, 0.10)',
  },
  cityOrbMid: {
    top: 680,
    right: -80,
    width: 420,
    height: 420,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
});

