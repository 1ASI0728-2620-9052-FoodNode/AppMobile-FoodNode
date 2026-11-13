import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/index.js';

export function Card({ children, style, variant = 'white' }) {
  return <View style={[styles.base, styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  white: { backgroundColor: colors.surface },
  peach: { backgroundColor: colors.peach },
});

