import React from 'react';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G, Line } from 'react-native-svg';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  style?: ViewStyle;
}

export const getIconContainerStyle = (size: number, style?: ViewStyle): ViewStyle => ({
  width: size,
  height: size,
  minWidth: size,
  minHeight: size,
  maxWidth: size,
  maxHeight: size,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  ...(style || {}),
});

// -------------------------------------------------------------
// 1. CATEGORY ICONS (Flaticon Dual-Tone Gradient Vector Style)
// -------------------------------------------------------------

/** Food: Steaming cloche & culinary cutlery with warm golden-amber gradient */
export function FoodIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="foodGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
        </Defs>
        {/* Steam vapor */}
        <Path d="M9 3C9 4 8 4.5 8 5.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
        <Path d="M12 2C12 3.5 11 4 11 5.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity={0.9} />
        <Path d="M15 3C15 4 14 4.5 14 5.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
        {/* Cloche Dome */}
        <Path
          d="M4 16C4 11.5817 7.58172 8 12 8C16.4183 8 20 11.5817 20 16H4Z"
          fill="url(#foodGrad)"
          opacity={0.3}
        />
        <Path
          d="M4 16C4 11.5817 7.58172 8 12 8C16.4183 8 20 11.5817 20 16"
          stroke="url(#foodGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Cloche Handle & Platter Base */}
        <Circle cx="12" cy="7.5" r="1.5" fill="#FBBF24" />
        <Path d="M2.5 17H21.5C21.7761 17 22 17.2239 22 17.5V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V17.5C2 17.2239 2.22386 17 2.5 17Z" fill="url(#foodGrad)" />
      </Svg>
    </View>
  );
}

/** Transport: High-speed transit / aviation jet with electric cyan-blue gradient */
export function TransportIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="transGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#2563EB" />
          </LinearGradient>
        </Defs>
        {/* Aerodynamic Speed Lines */}
        <Path d="M2 17H7" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
        <Path d="M4 20H9" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
        {/* Car / Jet Body */}
        <Path
          d="M5 14L7.5 7.5C7.8 6.6 8.7 6 9.7 6H16.3C17.3 6 18.2 6.6 18.5 7.5L21 14V17C21 17.6 20.6 18 20 18H19C18.4 18 18 17.6 18 17V16H6V17C6 17.6 5.6 18 5 18H4C3.4 18 3 17.6 3 17V14H5Z"
          fill="url(#transGrad)"
          opacity={0.25}
        />
        <Path
          d="M5 13.5L7.5 7.5C7.8 6.6 8.7 6 9.7 6H16.3C17.3 6 18.2 6.6 18.5 7.5L21 13.5H3L5 13.5Z"
          stroke="url(#transGrad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <Path d="M3 13.5H21V16.5C21 17.1 20.6 17.5 20 17.5H4C3.4 17.5 3 17.1 3 16.5V13.5Z" stroke="url(#transGrad)" strokeWidth="1.8" />
        {/* Headlights */}
        <Circle cx="6.5" cy="15" r="1.2" fill="#93C5FD" />
        <Circle cx="17.5" cy="15" r="1.2" fill="#93C5FD" />
      </Svg>
    </View>
  );
}

/** Hotel: Luxury 5-star hotel architecture with royal purple gradient */
export function HotelIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="hotelGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#C084FC" />
            <Stop offset="100%" stopColor="#7C3AED" />
          </LinearGradient>
        </Defs>
        {/* Main Building Frame */}
        <Path d="M4 21V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V21" fill="url(#hotelGrad)" opacity={0.22} />
        <Path d="M4 21V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V21H4Z" stroke="url(#hotelGrad)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Windows */}
        <Rect x="7" y="6" width="2.5" height="2.5" rx="0.5" fill="#E9D5FF" />
        <Rect x="14.5" y="6" width="2.5" height="2.5" rx="0.5" fill="#E9D5FF" />
        <Rect x="7" y="11" width="2.5" height="2.5" rx="0.5" fill="#E9D5FF" />
        <Rect x="14.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#E9D5FF" />
        {/* Grand Arch Doorway */}
        <Path d="M10 21V17C10 15.9 10.9 15 12 15C13.1 15 14 15.9 14 17V21" fill="#A855F7" />
      </Svg>
    </View>
  );
}

/** Tickets: Event & Attraction passes with rose-coral gradient */
export function TicketsIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="ticketGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#F472B6" />
            <Stop offset="100%" stopColor="#DB2777" />
          </LinearGradient>
        </Defs>
        <Path
          d="M3 8C3 7.4 3.4 7 4 7H20C20.6 7 21 7.4 21 8V10.5C19.6 10.5 18.5 11.6 18.5 13C18.5 14.4 19.6 15.5 21 15.5V18C21 18.6 20.6 19 20 19H4C3.4 19 3 18.6 3 18V15.5C4.4 15.5 5.5 14.4 5.5 13C5.5 11.6 4.4 10.5 3 10.5V8Z"
          fill="url(#ticketGrad)"
          opacity={0.25}
        />
        <Path
          d="M3 8C3 7.4 3.4 7 4 7H20C20.6 7 21 7.4 21 8V10.5C19.6 10.5 18.5 11.6 18.5 13C18.5 14.4 19.6 15.5 21 15.5V18C21 18.6 20.6 19 20 19H4C3.4 19 3 18.6 3 18V15.5C4.4 15.5 5.5 14.4 5.5 13C5.5 11.6 4.4 10.5 3 10.5V8Z"
          stroke="url(#ticketGrad)"
          strokeWidth="1.8"
        />
        {/* Perforation Line */}
        <Line x1="12" y1="8" x2="12" y2="18" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="2 2" />
      </Svg>
    </View>
  );
}

/** Snacks: Hot cafe beverage with caramel-gold gradient */
export function SnacksIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="snackGrad" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#FCD34D" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
        </Defs>
        {/* Steam */}
        <Path d="M7 2C7 3 6.5 3.5 6.5 4.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M11 1.5C11 2.8 10.5 3.3 10.5 4.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
        {/* Cup Body */}
        <Path
          d="M4 6H16V14C16 16.2 14.2 18 12 18H8C5.8 18 4 16.2 4 14V6Z"
          fill="url(#snackGrad)"
          opacity={0.25}
        />
        <Path
          d="M4 6H16V14C16 16.2 14.2 18 12 18H8C5.8 18 4 16.2 4 14V6Z"
          stroke="url(#snackGrad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Cup Handle */}
        <Path d="M16 8H18.5C19.9 8 21 9.1 21 10.5C21 11.9 19.9 13 18.5 13H16" stroke="url(#snackGrad)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Saucer */}
        <Path d="M2 20.5H18" stroke="url(#snackGrad)" strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Guide: Adventure compass beacon with emerald-mint gradient */
export function GuideIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="guideGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>
        <Circle cx="12" cy="12" r="9" fill="url(#guideGrad)" opacity={0.2} />
        <Circle cx="12" cy="12" r="9" stroke="url(#guideGrad)" strokeWidth="1.8" />
        {/* Compass Needle */}
        <Path d="M15.5 8.5L10.5 10.5L8.5 15.5L13.5 13.5L15.5 8.5Z" fill="#6EE7B7" stroke="url(#guideGrad)" strokeWidth="1.2" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="1.5" fill="#047857" />
      </Svg>
    </View>
  );
}

/** Emergency: Medical protection shield with crimson-ruby gradient */
export function EmergencyIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="emgGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#F87171" />
            <Stop offset="100%" stopColor="#DC2626" />
          </LinearGradient>
        </Defs>
        <Path
          d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
          fill="url(#emgGrad)"
          opacity={0.25}
        />
        <Path
          d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
          stroke="url(#emgGrad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Medical Cross */}
        <Path d="M12 8V16M8 12H16" stroke="#FECACA" strokeWidth="2.2" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Miscellaneous: Treasure gift parcel with sleek slate-platinum gradient */
export function MiscIcon({ size = 20, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="miscGrad" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="100%" stopColor="#475569" />
          </LinearGradient>
        </Defs>
        <Path
          d="M5 8.5C5 7.4 5.9 6.5 7 6.5H17C18.1 6.5 19 7.4 19 8.5V18.5C19 19.6 18.1 20.5 17 20.5H7C5.9 20.5 5 19.6 5 18.5V8.5Z"
          fill="url(#miscGrad)"
          opacity={0.25}
        />
        <Path
          d="M5 8.5C5 7.4 5.9 6.5 7 6.5H17C18.1 6.5 19 7.4 19 8.5V18.5C19 19.6 18.1 20.5 17 20.5H7C5.9 20.5 5 19.6 5 18.5V8.5Z"
          stroke="url(#miscGrad)"
          strokeWidth="1.8"
        />
        {/* Handle */}
        <Path d="M9 6.5V5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V6.5" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
        <Circle cx="12" cy="13.5" r="2" fill="#E2E8F0" />
      </Svg>
    </View>
  );
}

// -------------------------------------------------------------
// 2. CORE FINTECH & SPLIT ICONS
// -------------------------------------------------------------

/** 3D Coin Stack for Total Expenses */
export function CoinStackIcon({ size = 24, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="coinGrad1" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#38E586" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
          <LinearGradient id="coinGrad2" x1="4" y1="8" x2="20" y2="24" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#6EE7B7" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>
        {/* Bottom Coin */}
        <Path d="M20 15.5C20 17.433 16.4183 19 12 19C7.58172 19 4 17.433 4 15.5" stroke="url(#coinGrad1)" strokeWidth="1.8" />
        {/* Middle Coin */}
        <Path d="M20 11.5C20 13.433 16.4183 15 12 15C7.58172 15 4 13.433 4 11.5" stroke="url(#coinGrad1)" strokeWidth="1.8" />
        {/* Top Coin Ellipse with BDT symbol fill */}
        <Path
          d="M20 7.5C20 9.433 16.4183 11 12 11C7.58172 11 4 9.433 4 7.5C4 5.567 7.58172 4 12 4C16.4183 4 20 5.567 20 7.5Z"
          fill="url(#coinGrad2)"
          opacity={0.35}
        />
        <Path
          d="M20 7.5C20 9.433 16.4183 11 12 11C7.58172 11 4 9.433 4 7.5C4 5.567 7.58172 4 12 4C16.4183 4 20 5.567 20 7.5Z"
          stroke="url(#coinGrad1)"
          strokeWidth="1.8"
        />
        <Circle cx="12" cy="7.5" r="1.5" fill="#38E586" />
      </Svg>
    </View>
  );
}

/** Rich Multi-Avatar Team Icon for Contributors */
export function TeamBadgeIcon({ size = 24, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="teamGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
        </Defs>
        {/* Left Person */}
        <Circle cx="7.5" cy="8.5" r="3" fill="url(#teamGrad)" opacity={0.35} />
        <Circle cx="7.5" cy="8.5" r="3" stroke="url(#teamGrad)" strokeWidth="1.6" />
        <Path d="M2.5 18C2.5 15.2 4.7 13 7.5 13C8.5 13 9.4 13.3 10.2 13.8" stroke="url(#teamGrad)" strokeWidth="1.6" strokeLinecap="round" />
        {/* Right Person (Lead) */}
        <Circle cx="16" cy="7.5" r="3.5" fill="#93C5FD" opacity={0.4} />
        <Circle cx="16" cy="7.5" r="3.5" stroke="#38E586" strokeWidth="1.8" />
        <Path d="M10.5 19C10.5 16 13 13.5 16 13.5C19 13.5 21.5 16 21.5 19" stroke="#38E586" strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** High-End Wallet & Settlement Scale Icon */
export function SettlementWalletIcon({ size = 24, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="wallGrad" x1="2" y1="5" x2="22" y2="19" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>
        {/* Wallet Body */}
        <Rect x="3" y="6" width="18" height="13" rx="3" fill="url(#wallGrad)" opacity={0.25} />
        <Rect x="3" y="6" width="18" height="13" rx="3" stroke="url(#wallGrad)" strokeWidth="1.8" />
        {/* Flap & Clasp */}
        <Path d="M15 10H19.5C20.3 10 21 10.7 21 11.5V13.5C21 14.3 20.3 15 19.5 15H15C14.2 15 13.5 14.3 13.5 13.5V11.5C13.5 10.7 14.2 10 15 10Z" fill="#10B981" />
        <Circle cx="16" cy="12.5" r="1" fill="#FFFFFF" />
        {/* Emerging Cash / Card Slip */}
        <Path d="M7 6V4.5C7 3.7 7.7 3 8.5 3H15.5C16.3 3 17 3.7 17 4.5V6" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** "Giving Shares" Dual User Transfer Icon (Special Feature Icon) */
export function GivingSharesIcon({ size = 22, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="giveGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#38E586" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
        </Defs>
        {/* Left Payer */}
        <Circle cx="6" cy="8" r="2.5" fill="#38E586" opacity={0.8} />
        <Path d="M2.5 17C2.5 14.5 4.3 13 6 13C7.7 13 9.5 14.5 9.5 17" stroke="#38E586" strokeWidth="1.6" strokeLinecap="round" />
        {/* Right Beneficiary */}
        <Circle cx="18" cy="8" r="2.5" fill="#60A5FA" opacity={0.8} />
        <Path d="M14.5 17C14.5 14.5 16.3 13 18 13C19.7 13 21.5 14.5 21.5 17" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
        {/* Beam with arrow transferring share from Left to Right */}
        <Path d="M9 9.5H15M15 9.5L13 7.5M15 9.5L13 11.5" stroke="url(#giveGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/** Equal Split Scales Icon */
export function EqualSplitIcon({ size = 22, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="eqGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
        </Defs>
        {/* Scales Balance Beam */}
        <Path d="M12 4V19M8 19H16" stroke="url(#eqGrad)" strokeWidth="1.8" strokeLinecap="round" />
        <Path d="M5 8H19" stroke="url(#eqGrad)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Left Pan */}
        <Path d="M3 13L5 8L7 13C7 14.1 6.1 15 5 15C3.9 15 3 14.1 3 13Z" fill="#93C5FD" opacity={0.4} stroke="url(#eqGrad)" strokeWidth="1.4" />
        {/* Right Pan */}
        <Path d="M17 13L19 8L21 13C21 14.1 20.1 15 19 15C17.9 15 17 14.1 17 13Z" fill="#93C5FD" opacity={0.4} stroke="url(#eqGrad)" strokeWidth="1.4" />
      </Svg>
    </View>
  );
}

/** Custom Exact Split Icon */
export function CustomSplitIcon({ size = 22, style }: IconProps) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="cstGrad" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#6366F1" />
          </LinearGradient>
        </Defs>
        <Path d="M4 8H20M4 16H20" stroke="url(#cstGrad)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Slider 1 knob */}
        <Circle cx="9" cy="8" r="2.5" fill="#C084FC" stroke="url(#cstGrad)" strokeWidth="1.5" />
        {/* Slider 2 knob */}
        <Circle cx="15" cy="16" r="2.5" fill="#818CF8" stroke="url(#cstGrad)" strokeWidth="1.5" />
      </Svg>
    </View>
  );
}

// -------------------------------------------------------------
// 3. TAB BAR & FLOW NAVIGATION ICONS (Dual-tone Flaticon style)
// -------------------------------------------------------------

interface TabIconProps {
  size?: number;
  focused?: boolean;
  color?: string;
  style?: ViewStyle;
}

/** Dashboard Tab Icon: Futuristic Bento Layout */
export function DashboardTabIcon({ size = 20, focused = false, color = '#6B7280', style }: TabIconProps) {
  const activeGreen = '#38E586';
  const activeTeal = '#059669';
  const strokeColor = focused ? activeGreen : color;

  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="dashTabGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={activeGreen} />
            <Stop offset="100%" stopColor={activeTeal} />
          </LinearGradient>
        </Defs>
        {/* Top-Left Main Card */}
        <Rect
          x="3"
          y="3"
          width="7"
          height="9"
          rx="2"
          fill={focused ? 'url(#dashTabGrad)' : 'transparent'}
          fillOpacity={focused ? 0.35 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
        {/* Top-Right Pill */}
        <Rect
          x="14"
          y="3"
          width="7"
          height="5"
          rx="2"
          fill={focused ? '#38E586' : 'transparent'}
          fillOpacity={focused ? 0.2 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
        {/* Bottom-Left Pill */}
        <Rect
          x="3"
          y="16"
          width="7"
          height="5"
          rx="2"
          fill={focused ? '#38E586' : 'transparent'}
          fillOpacity={focused ? 0.2 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
        {/* Bottom-Right Tall Card */}
        <Rect
          x="14"
          y="12"
          width="7"
          height="9"
          rx="2"
          fill={focused ? 'url(#dashTabGrad)' : 'transparent'}
          fillOpacity={focused ? 0.35 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
      </Svg>
    </View>
  );
}

/** Expenses Tab Icon: Modern Ledger Receipt */
export function ExpensesTabIcon({ size = 20, focused = false, color = '#6B7280', style }: TabIconProps) {
  const activeGreen = '#38E586';
  const strokeColor = focused ? activeGreen : color;

  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="expTabGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#38E586" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>
        {/* Receipt outline */}
        <Path
          d="M4 4C4 2.9 4.9 2 6 2H18C19.1 2 20 2.9 20 4V21L17 19.5L14 21L11 19.5L8 21L4 19V4Z"
          fill={focused ? 'url(#expTabGrad)' : 'transparent'}
          fillOpacity={focused ? 0.25 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
          strokeLinejoin="round"
        />
        {/* Ledger lines */}
        <Line x1="8" y1="7" x2="16" y2="7" stroke={strokeColor} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
        <Line x1="8" y1="11" x2="14" y2="11" stroke={strokeColor} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" opacity={0.8} />
        <Line x1="8" y1="15" x2="12" y2="15" stroke={strokeColor} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" opacity={0.6} />
      </Svg>
    </View>
  );
}

/** Center New Tour Floating Button Icon */
export function AddTourTabIcon({ size = 24, focused = false, style }: { size?: number; focused?: boolean; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="addTourGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38E586" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="10" fill={focused ? '#059669' : 'url(#addTourGrad)'} fillOpacity={focused ? 0.9 : 0.2} stroke="#38E586" strokeWidth={2} />
      <Path d="M12 7V17M7 12H17" stroke={focused ? '#0A0D14' : '#38E586'} strokeWidth={2.4} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Settlement Tab Icon: Dual Flow Balancing Wallet */
export function SettlementTabIcon({ size = 20, focused = false, color = '#6B7280', style }: TabIconProps) {
  const activeGreen = '#38E586';
  const strokeColor = focused ? activeGreen : color;

  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="settleTabGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>
        <Rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="3"
          fill={focused ? 'url(#settleTabGrad)' : 'transparent'}
          fillOpacity={focused ? 0.25 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
        {/* Wallet Flap */}
        <Path d="M14 9H19C19.6 9 20 9.4 20 10V14C20 14.6 19.6 15 19 15H14C13.4 15 13 14.6 13 14V10C13 9.4 13.4 9 14 9Z" fill={focused ? '#38E586' : 'transparent'} stroke={strokeColor} strokeWidth={1.4} />
        <Circle cx="15.5" cy="12" r="1" fill={focused ? '#0A0D14' : strokeColor} />
      </Svg>
    </View>
  );
}

/** History Tab Icon: Time-Capsule Vault Archive */
export function HistoryTabIcon({ size = 20, focused = false, color = '#6B7280', style }: TabIconProps) {
  const activeGreen = '#38E586';
  const strokeColor = focused ? activeGreen : color;

  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="histTabGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#38E586" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="12"
          cy="12"
          r="9"
          fill={focused ? 'url(#histTabGrad)' : 'transparent'}
          fillOpacity={focused ? 0.25 : 0}
          stroke={strokeColor}
          strokeWidth={focused ? 2 : 1.7}
        />
        {/* Clock Hands */}
        <Path d="M12 7V12L15.5 14.5" stroke={strokeColor} strokeWidth={focused ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round" />
        {/* Dial ticks */}
        <Circle cx="12" cy="12" r="1.5" fill={strokeColor} />
      </Svg>
    </View>
  );
}

/** Transfer Speed Arrow Badge Icon for Settle Up Transactions */
export function TransferArrowBadgeIcon({ size = 20, style }: { size?: number; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="trfArrowGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38E586" />
          <Stop offset="100%" stopColor="#3B82F6" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="10" fill="url(#trfArrowGrad)" fillOpacity={0.2} stroke="url(#trfArrowGrad)" strokeWidth={1.5} />
      <Path d="M8 12H15.5M15.5 12L12.5 9M15.5 12L12.5 15" stroke="#38E586" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/** Archive Vault Safe Icon for History Screen */
export function ArchiveVaultIcon({ size = 40, style }: { size?: number; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="vaultGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38E586" />
          <Stop offset="100%" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      <Rect x="3" y="3" width="18" height="18" rx="3.5" fill="url(#vaultGrad)" fillOpacity={0.2} stroke="url(#vaultGrad)" strokeWidth={1.8} />
      {/* Dial Wheel */}
      <Circle cx="12" cy="12" r="4.5" stroke="#A7F3D0" strokeWidth={1.5} />
      <Circle cx="12" cy="12" r="2" fill="#38E586" />
      {/* Vault Door Spokes */}
      <Line x1="12" y1="6.5" x2="12" y2="7.5" stroke="#38E586" strokeWidth={2} strokeLinecap="round" />
      <Line x1="12" y1="16.5" x2="12" y2="17.5" stroke="#38E586" strokeWidth={2} strokeLinecap="round" />
      <Line x1="6.5" y1="12" x2="7.5" y2="12" stroke="#38E586" strokeWidth={2} strokeLinecap="round" />
      <Line x1="16.5" y1="12" x2="17.5" y2="12" stroke="#38E586" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Helper function to return the rich Flaticon-style SVG component by category string */
export function getPremiumCategoryIcon(category: string, size = 18) {
  switch (category) {
    case 'Food':
      return <FoodIcon size={size} />;
    case 'Transport':
      return <TransportIcon size={size} />;
    case 'Hotel':
      return <HotelIcon size={size} />;
    case 'Tickets':
      return <TicketsIcon size={size} />;
    case 'Snacks':
      return <SnacksIcon size={size} />;
    case 'Guide':
      return <GuideIcon size={size} />;
    case 'Emergency':
      return <EmergencyIcon size={size} />;
    case 'Miscellaneous':
    default:
      return <MiscIcon size={size} />;
  }
}

// -------------------------------------------------------------
// 5. THEME ATMOSPHERE ICONS (Flaticon Dual-Tone Vector Aesthetics)
// -------------------------------------------------------------

/** Mountains Theme Icon: Alpine snow peaks with pine crests & sunrise radiance */
export function MountainThemeIcon({ size = 20, active = false, style }: { size?: number; active?: boolean; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="mtnGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#818CF8" />
          <Stop offset="100%" stopColor="#4F46E5" />
        </LinearGradient>
        <LinearGradient id="mtnPeakGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#C7D2FE" />
        </LinearGradient>
      </Defs>
      {/* Sun / Aura Behind Peaks */}
      <Circle cx="17.5" cy="6.5" r="3" fill="#FBBF24" fillOpacity={active ? 0.9 : 0.6} />
      
      {/* Back Mountain */}
      <Path
        d="M13 18L18 9L23 18H13Z"
        fill="url(#mtnGrad)"
        fillOpacity={0.4}
        stroke="url(#mtnGrad)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      
      {/* Front Peak Body */}
      <Path
        d="M2 19L9.5 5.5L17 19H2Z"
        fill="url(#mtnGrad)"
        fillOpacity={active ? 0.35 : 0.22}
        stroke="url(#mtnGrad)"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {/* Snow Cap */}
      <Path
        d="M9.5 5.5L12 10L10.5 11L9.5 9.8L8.5 11L7 10L9.5 5.5Z"
        fill="url(#mtnPeakGrad)"
        stroke="#FFFFFF"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      {/* Mountain Base Ridge */}
      <Line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#818CF8" strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Sea Theme Icon: Oceanic cresting waves with bioluminescent marine spray */
export function SeaThemeIcon({ size = 20, active = false, style }: { size?: number; active?: boolean; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="seaGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#0284C7" />
        </LinearGradient>
      </Defs>
      {/* Upper Crest Wave */}
      <Path
        d="M2 12C4.5 12 6.5 9.5 9 9.5C11.5 9.5 13.5 12 16 12C18.5 12 20.5 9.5 22 9.5"
        stroke="url(#seaGrad)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Middle Ocean Swell */}
      <Path
        d="M2 16C4.5 16 6.5 13.5 9 13.5C11.5 13.5 13.5 16 16 16C18.5 16 20.5 13.5 22 13.5V19C22 19.6 21.6 20 21 20H3C2.4 20 2 19.6 2 19V16Z"
        fill="url(#seaGrad)"
        fillOpacity={active ? 0.35 : 0.2}
        stroke="url(#seaGrad)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bioluminescent Spray Particles */}
      <Circle cx="8.5" cy="6" r="1.2" fill="#BAE6FD" />
      <Circle cx="15.5" cy="5" r="1.5" fill="#38BDF8" />
      <Circle cx="19" cy="7.5" r="1" fill="#7DD3FC" />
      {/* Ambient Deep Current */}
      <Path d="M4 18.5C7 18.5 9 18 12 18.5C15 19 17 18.5 20 18.5" stroke="#BAE6FD" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      </Svg>
    </View>
  );
}

/** Cities Theme Icon: Tokyo & Metropolis skyscrapers with neon amber/fuchsia night glow */
export function CityThemeIcon({ size = 20, active = false, style }: { size?: number; active?: boolean; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="cityGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#EC4899" />
        </LinearGradient>
      </Defs>
      {/* Left Tower */}
      <Rect
        x="3"
        y="9"
        width="5.5"
        height="12"
        rx="1"
        fill="url(#cityGrad)"
        fillOpacity={active ? 0.35 : 0.22}
        stroke="url(#cityGrad)"
        strokeWidth={1.6}
      />
      {/* Left Tower Windows */}
      <Circle cx="5.7" cy="12" r="0.8" fill="#FDE68A" />
      <Circle cx="5.7" cy="15" r="0.8" fill="#FDE68A" />
      <Circle cx="5.7" cy="18" r="0.8" fill="#FDE68A" />

      {/* Center Pinnacle Tower */}
      <Path
        d="M10.5 4H14.5V21H10.5V4Z"
        fill="url(#cityGrad)"
        fillOpacity={active ? 0.45 : 0.3}
        stroke="url(#cityGrad)"
        strokeWidth={1.8}
      />
      {/* Spire Antenna */}
      <Line x1="12.5" y1="1.5" x2="12.5" y2="4" stroke="#F59E0B" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12.5" cy="1.2" r="0.8" fill="#EC4899" />
      {/* Center Tower Windows */}
      <Rect x="11.5" y="6.5" width="2" height="1.5" rx="0.3" fill="#FDE68A" />
      <Rect x="11.5" y="10" width="2" height="1.5" rx="0.3" fill="#FDE68A" />
      <Rect x="11.5" y="13.5" width="2" height="1.5" rx="0.3" fill="#FDE68A" />
      <Rect x="11.5" y="17" width="2" height="1.5" rx="0.3" fill="#FDE68A" />

      {/* Right Stepped High-Rise */}
      <Path
        d="M17 12H21.5V21H17V12Z"
        fill="url(#cityGrad)"
        fillOpacity={active ? 0.35 : 0.22}
        stroke="url(#cityGrad)"
        strokeWidth={1.6}
      />
      {/* Right Tower Windows */}
      <Circle cx="19.2" cy="15" r="0.8" fill="#FDE68A" />
      <Circle cx="19.2" cy="18" r="0.8" fill="#FDE68A" />

      {/* Metropolitan Horizon Line */}
      <Line x1="2" y1="21.5" x2="22.5" y2="21.5" stroke="#F59E0B" strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Green Valley Icon: Rolling emerald hills with sunlit river brook and morning sun */
export function ValleyThemeIcon({ size = 20, active = false, style }: { size?: number; active?: boolean; style?: ViewStyle }) {
  return (
    <View style={getIconContainerStyle(size, style)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="valIconGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#4ADE80" />
            <Stop offset="100%" stopColor="#16A34A" />
          </LinearGradient>
          <LinearGradient id="valHillBackGrad" x1="0" y1="10" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#15803D" />
            <Stop offset="100%" stopColor="#0B381A" />
          </LinearGradient>
        </Defs>

        {/* Radiant Morning Sun */}
        <Circle cx="17.5" cy="6" r="2.8" fill="#FBBF24" fillOpacity={active ? 0.95 : 0.75} />
        <Circle cx="17.5" cy="6" r="4.2" stroke="#FBBF24" strokeWidth={0.8} strokeDasharray="1.5 2" opacity={0.5} />

        {/* Back Rolling Ridge */}
        <Path
          d="M2 17C6 12.5 12 12 16 15C19 16.5 21 15.5 22 14.5V22H2V17Z"
          fill="url(#valHillBackGrad)"
          opacity={active ? 0.65 : 0.45}
        />

        {/* Foreground Rolling Green Valley Hill */}
        <Path
          d="M22 18.5C17.5 14.5 11 15 6.5 18.5C4.5 19.5 3 19.5 2 20.5V22H22V18.5Z"
          fill="url(#valIconGrad)"
          fillOpacity={active ? 0.45 : 0.25}
          stroke="#22C55E"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Winding Valley River Brook */}
        <Path
          d="M12.5 13.5C11 16 13.5 18.5 11 22"
          stroke="#38BDF8"
          strokeWidth={1.6}
          strokeLinecap="round"
        />

        {/* Leafy Sprout / Hill Contour */}
        <Path
          d="M5.5 14.5C7.5 11.5 10.5 11.8 11.5 13.5"
          stroke="#86EFAC"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

/** Obsidian Luxe Icon: Kept as alias to ValleyThemeIcon */
export const ObsidianThemeIcon = ValleyThemeIcon;

/** Helper function to return thematic icon */
export function getThemeIcon(themeId: string, size = 20, active = false) {
  switch (themeId) {
    case 'valley':
    case 'obsidian':
      return <ValleyThemeIcon size={size} active={active} />;
    case 'mountain':
      return <MountainThemeIcon size={size} active={active} />;
    case 'sea':
      return <SeaThemeIcon size={size} active={active} />;
    case 'city':
      return <CityThemeIcon size={size} active={active} />;
    default:
      return <ValleyThemeIcon size={size} active={active} />;
  }
}


