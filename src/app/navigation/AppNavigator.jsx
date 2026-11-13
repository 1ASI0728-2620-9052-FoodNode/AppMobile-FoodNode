import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthStack } from './AuthStack.jsx';
import { ExplorerTabs } from './ExplorerTabs.jsx';
import { useAuthContext } from '../../contexts/iam/interfaces/AuthProvider.jsx';
import { colors } from '../../shared/interfaces/theme/colors.js';
import { DEMO_MODE } from '../../shared/infrastructure/config.js';

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (!DEMO_MODE && isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {DEMO_MODE || isAuthenticated ? <ExplorerTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
