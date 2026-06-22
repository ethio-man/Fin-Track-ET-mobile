import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';

export default function App() {
  return (
    <AppProvider>
      <DataProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </DataProvider>
    </AppProvider>
  );
}
