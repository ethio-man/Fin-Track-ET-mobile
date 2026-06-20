import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

// We'll import screens shortly, using placeholders for now
import DashboardScreen from '../screens/DashboardScreen';
import SalesScreen from '../screens/SalesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import InventoryScreen from '../screens/InventoryScreen';
import MoreStackNavigator from './MoreStackNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.bgCore,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: Colors.textCore,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: Colors.bgPanel,
          borderTopColor: Colors.borderCore,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: Colors.accentLight,
        tabBarInactiveTintColor: Colors.textMute,
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen} 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="SalesTab" 
        component={SalesScreen} 
        options={{
          title: 'Sales',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ExpensesTab" 
        component={ExpensesScreen} 
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="credit-card" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="InventoryTab" 
        component={InventoryScreen} 
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant-closed" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MoreTab" 
        component={MoreStackNavigator} 
        options={{
          headerShown: false,
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
