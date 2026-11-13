import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme/index.js';
import { Button } from './Button.jsx';

export function ErrorState({
  message = 'No se pudo conectar con el servidor. Intenta de nuevo.',
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="wifi-outline" size={48} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && <Button title="Reintentar" onPress={onRetry} style={styles.btn} fullWidth={false} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  text: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  btn: { marginTop: spacing.xl, paddingHorizontal: spacing.xxl },
});

