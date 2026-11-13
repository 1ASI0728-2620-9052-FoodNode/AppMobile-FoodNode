import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { DependencyProvider } from './providers/DependencyProvider.jsx';
import { AuthProvider } from '../contexts/iam/interfaces/AuthProvider.jsx';
import { AppNavigator } from './navigation/AppNavigator.jsx';
import { colors } from '../shared/interfaces/theme/colors.js';
import { DemoDataProvider } from './providers/DemoDataProvider.jsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Foodly</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <DemoDataProvider>
        <DependencyProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </DependencyProvider>
      </DemoDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 28, color: colors.primary, fontWeight: '800' },
});
