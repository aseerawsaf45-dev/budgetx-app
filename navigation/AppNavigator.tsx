import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../screens/LandingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CreateTourScreen } from '../screens/CreateTourScreen';
import { DayWiseScreen } from '../screens/DayWiseScreen';
import { SettlementScreen } from '../screens/SettlementScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ContributorsScreen } from '../screens/ContributorsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SharedTourScreen } from '../screens/SharedTourScreen';
import { COLORS, RADIUS, SHADOWS, SPACING, THEMES } from '../constants/theme';
import { useStore } from '../store/useStore';
import {
  DashboardTabIcon,
  ExpensesTabIcon,
  AddTourTabIcon,
  SettlementTabIcon,
  HistoryTabIcon,
} from '../components/PremiumIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const theme = useStore((state) => state.theme) || 'valley';
  const activeTheme = THEMES[theme] || THEMES.valley || THEMES.obsidian;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeTheme.colors.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 18 : 26,
          left: 16,
          right: 16,
          maxWidth: 580,
          marginHorizontal: 'auto',
          height: 66,
          borderRadius: 9999,
          backgroundColor: activeTheme.colors.surfaceGlass,
          borderWidth: 1,
          borderColor: activeTheme.colors.border,
          borderTopColor: activeTheme.colors.borderHighlight,
          paddingBottom: 5,
          paddingTop: 6,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.55,
          shadowRadius: 24,
          elevation: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'BudgetX',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconWrapper, 
              focused && [
                styles.activeIconWrapper, 
                { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}35` }
              ]
            ]}>
              <DashboardTabIcon color={color} focused={focused} size={focused ? 21 : 20} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={DayWiseScreen} 
        options={{
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconWrapper, 
              focused && [
                styles.activeIconWrapper, 
                { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}35` }
              ]
            ]}>
              <ExpensesTabIcon color={color} focused={focused} size={focused ? 21 : 20} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateTourScreen} 
        options={{
          tabBarLabel: 'New Tour',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.centerAddButton, 
              { backgroundColor: `${activeTheme.colors.primary}20`, borderColor: `${activeTheme.colors.primary}45` },
              focused && [
                styles.centerAddActive,
                { backgroundColor: activeTheme.colors.primary, borderColor: activeTheme.colors.primary, shadowColor: activeTheme.colors.primary }
              ]
            ]}>
              <AddTourTabIcon size={22} focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Settlement" 
        component={SettlementScreen} 
        options={{
          tabBarLabel: 'Settlement',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconWrapper, 
              focused && [
                styles.activeIconWrapper, 
                { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}35` }
              ]
            ]}>
              <SettlementTabIcon color={color} focused={focused} size={focused ? 21 : 20} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconWrapper, 
              focused && [
                styles.activeIconWrapper, 
                { backgroundColor: `${activeTheme.colors.primary}18`, borderColor: `${activeTheme.colors.primary}35` }
              ]
            ]}>
              <HistoryTabIcon color={color} focused={focused} size={focused ? 21 : 20} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const theme = useStore((state) => state.theme) || 'valley';
  const activeTheme = THEMES[theme] || THEMES.valley || THEMES.obsidian;

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: activeTheme.colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CreateTour" component={CreateTourScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="Contributors" component={ContributorsScreen} />
      <Stack.Screen name="SharedTour" component={SharedTourScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADIUS.full,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.22)',
  },
  centerAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 229, 134, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 229, 134, 0.28)',
  },
  centerAddActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 4,
  },
});
