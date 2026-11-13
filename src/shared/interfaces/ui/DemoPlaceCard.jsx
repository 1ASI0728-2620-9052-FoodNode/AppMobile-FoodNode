import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors.js';
import { typography } from '../theme/typography.js';
import { spacing } from '../theme/spacing.js';
import { Card } from './Card.jsx';

export function DemoPlaceCard({ place, isFavorite = false, onToggleFavorite, footer }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card style={styles.card}>
      <View style={styles.imageWrap}>
        {!imageFailed ? (
          <Image
            source={{ uri: place.photo }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant-outline" size={38} color={colors.primary} />
            <Text style={styles.placeholderText}>Imagen de muestra</Text>
          </View>
        )}
        {onToggleFavorite ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={21}
              color={isFavorite ? colors.danger : colors.brownDark}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.ratingText}> {place.rating} ({place.reviewCount} reseñas)</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.detail} numberOfLines={1}>
          {place.cuisineType} · {place.priceRange}
        </Text>
        {place.address ? (
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
          </View>
        ) : null}
        {footer}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', marginBottom: spacing.md },
  imageWrap: { height: 168, position: 'relative', backgroundColor: colors.peach },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.peach,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
  },
  favoriteButton: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.surface,
  },
  content: { padding: spacing.md },
  rating: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  name: {
    color: colors.brownDark,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    marginBottom: 3,
  },
  detail: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  address: {
    flex: 1,
    marginLeft: 4,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
  },
});
