import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, typography, spacing } from '../theme/index.js';

export function Button({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const label = title || (typeof children === 'string' ? children : '');
  const isDisabled = disabled || loading;
  const isSmall = size === 'sm';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      style={[
        styles.base,
        isSmall && styles.small,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.text, isSmall && styles.smallText, styles[`${variant}Text`], textStyle]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  smallText: { fontSize: 12 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.peach },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: spacing.sm },
  text: { fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  primaryText: { color: colors.surface },
  secondaryText: { color: colors.primary },
  outlineText: { color: colors.primary },
});

