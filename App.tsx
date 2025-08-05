import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import { COLORS } from './src/utils/constants';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <MainNavigator />
    </AuthProvider>
  );
}
