import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { DemoPlaceCard } from '../../../shared/interfaces/ui/DemoPlaceCard.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';

export function FavoritesScreen() {
  const { favorites, isFavorite, toggleFavorite } = useDemoData();
  const places = [...favorites]
    .map((id) => DEMO_HUARIQUES.find((place) => place.id === id))
    .filter(Boolean);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TUS DESCUBRIMIENTOS</Text>
          <Text style={styles.title}>Mis favoritos</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.count}>{places.length}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Guarda esos sabores que quieres volver a probar.</Text>

      {places.length ? places.map((place) => (
        <DemoPlaceCard
          key={place.id}
          place={place}
          isFavorite={isFavorite(place.id)}
          onToggleFavorite={() => toggleFavorite(place.id)}
        />
      )) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Tu próxima obsesión culinaria</Text>
          <Text style={styles.emptyText}>
            Toca el corazón de un huarique para guardarlo aquí.
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    letterSpacing: 1,
  },
  title: {
    marginTop: 4,
    color: colors.brownDark,
    fontFamily: typography.fontFamily.bold,
    fontSize: 26,
  },
  countBadge: {
    minWidth: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.peach,
  },
  count: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  subtitle: {
    marginTop: 6,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  empty: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxl * 2 },
  emptyIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: colors.peach,
  },
  emptyTitle: {
    marginTop: spacing.md,
    color: colors.brownDark,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
