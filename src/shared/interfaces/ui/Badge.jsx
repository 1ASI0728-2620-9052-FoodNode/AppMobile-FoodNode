import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme/index.js';

export function Badge({ label, children, variant = 'success', icon, style }) {
  const text = label || (typeof children === 'string' ? children : '');
  return (
    <View style={[styles.badge, styles[variant], style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, styles[`${variant}Text`]]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.sm,
  },
  success: { backgroundColor: colors.successLight },
  warning: { backgroundColor: '#FFE0CC' },
  danger: { backgroundColor: '#FFD6D6' },
  neutral: { backgroundColor: colors.peach },
  text: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs },
  successText: { color: colors.success },
  warningText: { color: colors.warning },
  dangerText: { color: colors.danger },
  neutralText: { color: colors.textSecondary },
  icon: { marginRight: 4 },
});

