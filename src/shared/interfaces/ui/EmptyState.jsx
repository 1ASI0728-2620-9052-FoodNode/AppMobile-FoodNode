import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme/index.js';
import { Button } from './Button.jsx';

export function EmptyState({ icon = 'restaurant-outline', title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.border} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.btn} fullWidth={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  btn: { marginTop: spacing.xl, paddingHorizontal: spacing.xxl },
});

