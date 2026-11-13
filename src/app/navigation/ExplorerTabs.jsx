import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../shared/interfaces/theme/index.js';
import { RadarScreen } from '../../contexts/radar/interfaces/RadarScreen.jsx';
import { FavoritesScreen } from '../../contexts/community/interfaces/FavoritesScreen.jsx';
import { RoutesScreen } from '../../contexts/route/interfaces/RoutesScreen.jsx';
import { ProfileScreen } from '../../contexts/iam/interfaces/ProfileScreen.jsx';
import { HuariqueDetailScreen } from '../../contexts/radar/interfaces/HuariqueDetailScreen.jsx';
import { LiaChatScreen } from '../../contexts/messaging/interfaces/LiaChatScreen.jsx';
import { RouteSimulationScreen } from '../../contexts/route/interfaces/RouteSimulationScreen.jsx';

const Tab = createBottomTabNavigator();
const RadarStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();
const RoutesStack = createNativeStackNavigator();

const TAB_ICONS = {
  Radar: 'radio-outline',
  Favoritos: 'heart-outline',
  Rutas: 'map-outline',
  Perfil: 'person-outline',
};

function RadarTab() {
  return (
    <RadarStack.Navigator screenOptions={{ headerShown: false }}>
      <RadarStack.Screen name="RadarHome" component={RadarScreen} />
      <RadarStack.Screen name="HuariqueDetail" component={HuariqueDetailScreen} />
      <RadarStack.Screen name="LiaChat" component={LiaChatScreen} />
      <RadarStack.Screen name="RouteSimulation" component={RouteSimulationScreen} />
    </RadarStack.Navigator>
  );
}

function FavoritesTab() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesHome" component={FavoritesScreen} />
      <FavoritesStack.Screen name="HuariqueDetail" component={HuariqueDetailScreen} />
      <FavoritesStack.Screen name="LiaChat" component={LiaChatScreen} />
      <FavoritesStack.Screen name="RouteSimulation" component={RouteSimulationScreen} />
    </FavoritesStack.Navigator>
  );
}

function RoutesTab() {
  return (
    <RoutesStack.Navigator screenOptions={{ headerShown: false }}>
      <RoutesStack.Screen name="RoutesHome" component={RoutesScreen} />
      <RoutesStack.Screen name="RouteSimulation" component={RouteSimulationScreen} />
      <RoutesStack.Screen name="HuariqueDetail" component={HuariqueDetailScreen} />
      <RoutesStack.Screen name="LiaChat" component={LiaChatScreen} />
    </RoutesStack.Navigator>
  );
}

export function ExplorerTabs() {
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
      <Tab.Screen name="Radar" component={RadarTab} />
      <Tab.Screen name="Favoritos" component={FavoritesTab} />
      <Tab.Screen name="Rutas" component={RoutesTab} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
