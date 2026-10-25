import React, { useEffect } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AppNavigator } from './navigation/AppNavigator';
import { StatusBar, Platform, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, THEMES } from './constants/theme';
import { OfflineBanner } from './components/OfflineBanner';
import { useStore } from './store/useStore';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

const linking: LinkingOptions<any> = {
  prefixes: [
    'budgetx://',
    'https://budgetx-app-nine.vercel.app',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  config: {
    screens: {
      Landing: '',
      MainTabs: {
        path: 'app',
        screens: {
          Home: 'dashboard',
          Expenses: 'expenses',
          Create: 'create',
          Settlement: 'settlement',
          History: 'history',
        }
      },
      SharedTour: 'shared',
      CreateTour: 'create-tour',
      AddExpense: 'add-expense',
      Contributors: 'contributors'
    },
  },
};

export default function App() {
  const currentThemeId = useStore((state) => state.theme) || 'valley';
  const activeTheme = THEMES[currentThemeId] || THEMES.valley || THEMES.obsidian;

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  // Inject web styles for smooth scrolling, zero horizontal overflow, and global font stack
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const existingStyle = document.getElementById('budgetx-theme-styles');
      const style = existingStyle || document.createElement('style');
      style.id = 'budgetx-theme-styles';
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        body, html {
          background-color: ${activeTheme.colors.background} !important;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          scroll-behavior: smooth;
          transition: background-color 0.4s ease;
        }

        /* Ambient Ethereal Mesh Background Glow (GPU-accelerated, fixed, pointer-events-none) */
        body::before {
          content: '';
          position: fixed;
          top: -10vw;
          left: 50%;
          transform: translateX(-50%);
          width: 90vw;
          max-width: 1100px;
          height: 420px;
          background: ${activeTheme.glowGradient};
          pointer-events: none;
          z-index: 0;
          filter: blur(55px);
          animation: etherealPulse 12s ease-in-out infinite alternate;
          transition: background 0.6s ease;
        }

        @keyframes etherealPulse {
          0% {
            opacity: 0.7;
            transform: translateX(-50%) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1.04);
          }
        }

        /* Micro-Interaction & Fluid Dynamics */
        button, a, [role="button"], [role="tab"] {
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, border-color 0.2s ease !important;
        }
        button:active, [role="button"]:active {
          transform: scale(0.982) !important;
        }

        /* Ambient Card Elevation on Hover */
        .card-interactive {
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.32s ease, box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .card-interactive:hover {
          transform: translateY(-2px) !important;
          border-color: ${activeTheme.colors.borderHighlight} !important;
          box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15) !important;
        }

        /* Custom High-Precision Scrollbar */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: ${activeTheme.colors.background};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${activeTheme.colors.borderActive};
        }

        /* Text Selection */
        ::selection {
          background: ${activeTheme.colors.primaryMuted};
          color: #FFFFFF;
        }
      `;
      if (!existingStyle) {
        document.head.appendChild(style);
      }
      document.title = 'BudgetX';
    }
  }, [activeTheme]);

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: activeTheme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={activeTheme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
        <StatusBar barStyle="light-content" backgroundColor={activeTheme.colors.background} />
        <OfflineBanner />
        <NavigationContainer
          linking={linking}
          documentTitle={{
            enabled: true,
            formatter: () => 'BudgetX',
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
