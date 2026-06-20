import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../theme/colors';

import MoreScreen from '../screens/MoreScreen';
import DebtsScreen from '../screens/DebtsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createStackNavigator();

export default function MoreStackNavigator() {
  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen 
        name="MoreOverview" 
        component={MoreScreen} 
        options={{ title: 'More Options' }}
      />
      <Stack.Screen 
        name="Debts" 
        component={DebtsScreen} 
      />
      <Stack.Screen 
        name="Invoices" 
        component={InvoicesScreen} 
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
