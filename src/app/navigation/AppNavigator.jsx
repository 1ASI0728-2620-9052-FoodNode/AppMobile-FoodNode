import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthStack } from './AuthStack.jsx';
import { ExplorerTabs } from './ExplorerTabs.jsx';
import { OwnerTabs } from './OwnerTabs.jsx';
import { useAuthContext } from '../../contexts/iam/interfaces/AuthProvider.jsx';
import { colors } from '../../shared/interfaces/theme/colors.js';
import { DEMO_MODE } from '../../shared/infrastructure/config.js';
import { Roles } from '../../contexts/iam/domain/Role.js';

export function AppNavigator() {
  const { user, isAuthenticated, isLoading, isDemoSessionActive } = useAuthContext();
  const signedInContent = user?.role === Roles.HUARIQUE_OWNER
    ? <OwnerTabs />
    : <ExplorerTabs />;

  if (!DEMO_MODE && isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {DEMO_MODE ? (
        isDemoSessionActive ? signedInContent : <AuthStack />
      ) : isAuthenticated ? signedInContent : <AuthStack />}
    </NavigationContainer>
  );
}
