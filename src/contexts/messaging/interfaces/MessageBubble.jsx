import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message }) {
  const isLia = message.isFromLia || message.sender === 'LIA';

  if (isLia) {
    return (
      <View style={styles.liaRow}>
        <View style={styles.liaAvatar}>
          <Text style={styles.liaAvatarText}>L</Text>
        </View>
        <View style={styles.liaBubble}>
          <Text style={styles.liaText}>{message.content}</Text>
          <Text style={styles.timestamp}>{formatTime(message.sentAt)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.explorerRow}>
      <View style={styles.explorerBubble}>
        <Text style={styles.explorerText}>{message.content}</Text>
        <Text style={[styles.timestamp, styles.explorerTimestamp]}>{formatTime(message.sentAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  liaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  liaAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  liaAvatarText: {
    color: colors.surface,
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
  },
  liaBubble: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    borderTopLeftRadius: 4,
    padding: spacing.md,
    maxWidth: '75%',
    shadowColor: colors.brownDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  liaText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  explorerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  explorerBubble: {
    backgroundColor: colors.peach,
    borderRadius: spacing.borderRadius.lg,
    borderTopRightRadius: 4,
    padding: spacing.md,
    maxWidth: '75%',
  },
  explorerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.brownDark,
  },
  timestamp: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  explorerTimestamp: {
    color: colors.textSecondary,
  },
});

