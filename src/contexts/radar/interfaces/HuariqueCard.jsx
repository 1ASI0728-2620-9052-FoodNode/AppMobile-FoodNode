import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { Button, Badge, Card } from '../../../shared/interfaces/ui/index.js';
import { formatDistance, formatWalkingTime } from '../../../shared/utils/format.js';

export function HuariqueCard({
  huarique,
  onPressDetail,
  onPressRoute,
  isFavorite = false,
  onToggleFavorite,
}) {
  const {
    name,
    photo,
    cuisineType,
    priceRange,
    rating,
    reviewCount,
    isOpen,
    distanceMeters,
  } = huarique;
  const [imageFailed, setImageFailed] = useState(false);

  // formatWalkingTime expects minutes, distance in meters → walking ~1.3 m/s → meters/78 ≈ min
  const walkingMinutes = distanceMeters / 78;

  return (
    <Card style={styles.card}>
      {/* Hero image */}
      <View style={styles.imageContainer}>
        {imageFailed ? (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant-outline" size={38} color={colors.primary} />
            <Text style={styles.placeholderText}>Imagen de muestra</Text>
          </View>
        ) : (
          <Image
            source={{ uri: photo }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        )}
        {/* Open/closed badge */}
        <View style={styles.badgeOverlay}>
          <Badge variant={isOpen ? 'success' : 'danger'}>
            {isOpen ? 'Mesa Lista' : 'Cerrado'}
          </Badge>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.danger : colors.brownDark}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>
            {' '}{rating} ({reviewCount})
          </Text>
        </View>

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>{name}</Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={1}>
          {cuisineType} • {priceRange}
        </Text>

        {/* Distance */}
        <View style={styles.distanceRow}>
          <Ionicons name="navigate-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.distanceText}>
            {' '}{formatDistance(distanceMeters)} ({formatWalkingTime(walkingMinutes)})
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrap}>
            <Button variant="secondary" onPress={onPressDetail} size="sm">
              Ver Detalle
            </Button>
          </View>
          <View style={styles.buttonWrap}>
            <Button variant="primary" onPress={onPressRoute} size="sm">
              Ir en Ruta
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
  },
  imagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.peach,
  },
  placeholderText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.brownDark,
    marginBottom: 2,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  distanceText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonWrap: {
    flex: 1,
  },
});
