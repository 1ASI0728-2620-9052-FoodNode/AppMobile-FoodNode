import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../shared/interfaces/theme/index.js';
import { ProfileScreen } from '../../contexts/iam/interfaces/ProfileScreen.jsx';
import { OwnerRequestsScreen } from '../../contexts/owner/interfaces/OwnerRequestsScreen.jsx';
import { OwnerBusinessScreen } from '../../contexts/owner/interfaces/OwnerBusinessScreen.jsx';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Solicitudes: 'receipt-outline',
  'Mi negocio': 'restaurant-outline',
  Perfil: 'person-outline',
};

export function OwnerTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarIcon: ({ focused, size }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name].replace('-outline', '') : TAB_ICONS[route.name]}
            size={size}
            color={focused ? colors.primary : colors.textSecondary}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
      })}
    >
      <Tab.Screen name="Solicitudes" component={OwnerRequestsScreen} />
      <Tab.Screen name="Mi negocio" component={OwnerBusinessScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
