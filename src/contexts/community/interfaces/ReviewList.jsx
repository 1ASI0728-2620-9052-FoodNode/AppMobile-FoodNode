import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReviews } from './useReviews.js';
import { Card } from '../../../shared/interfaces/ui/index.js';
import { Badge } from '../../../shared/interfaces/ui/index.js';
import { StarRating } from '../../../shared/interfaces/ui/index.js';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getTimeAgo(createdAt) {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 2) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ReviewCard({ item }) {
  const initials = getInitials(item.explorerName);
  const timeAgo = getTimeAgo(item.createdAt);

  return (
    <Card variant="white" style={styles.card}>
      {/* Avatar row */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.explorerName}</Text>
          <Text style={styles.location}>Barranco · {timeAgo}</Text>
        </View>
      </View>

      {/* Star rating */}
      <View style={styles.ratingRow}>
        <StarRating value={item.rating} mode="display" size="small" />
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{item.comment}</Text>

      {/* Verified badge */}
      {item.verified && (
        <View style={styles.badgeRow}>
          <Badge variant="success">Reserva Verificada</Badge>
        </View>
      )}
    </Card>
  );
}

export function ReviewList({ huariqueId }) {
  const { reviews, isLoading, loadReviews } = useReviews();

  useEffect(() => {
    if (huariqueId) {
      loadReviews(huariqueId);
    }
  }, [huariqueId]);

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Cargando reseñas...</Text>
      </View>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-outline" size={32} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Sé el primero en dejar tu reseña</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewCard item={item} />}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenPadding,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  location: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  ratingRow: {
    marginBottom: spacing.sm,
  },
  comment: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    marginTop: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
