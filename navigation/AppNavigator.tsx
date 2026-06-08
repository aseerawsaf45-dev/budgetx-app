import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CreateTourScreen } from '../screens/CreateTourScreen';
import { DayWiseScreen } from '../screens/DayWiseScreen';
import { SettlementScreen } from '../screens/SettlementScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ContributorsScreen } from '../screens/ContributorsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { COLORS } from '../constants/theme';
import { LayoutDashboard, PlusCircle, CalendarDays, Wallet, History } from 'lucide-react-native';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={DayWiseScreen} 
        options={{
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateTourScreen} 
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Settlement" 
        component={SettlementScreen} 
        options={{
          tabBarIcon: ({ color }) => <Wallet color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CreateTour" component={CreateTourScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="Contributors" component={ContributorsScreen} />
    </Stack.Navigator>
  );
};
