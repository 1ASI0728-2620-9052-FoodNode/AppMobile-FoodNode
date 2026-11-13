import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/interfaces/ui/Button.jsx';
import { Card } from '../../../shared/interfaces/ui/Card.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';

export function HuariqueDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id } = params ?? {};
  const place = DEMO_HUARIQUES.find((item) => item.id === id) ?? DEMO_HUARIQUES[0];
  const { isFavorite, toggleFavorite } = useDemoData();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {imageFailed ? (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="restaurant-outline" size={54} color={colors.primary} />
              <Text style={styles.heroPlaceholderText}>Foto de muestra</Text>
            </View>
          ) : (
            <Image source={{ uri: place.photo }} style={styles.heroImage} onError={() => setImageFailed(true)} />
          )}
          <View style={styles.heroShade} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.brownDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(place.id)}>
            <Ionicons name={isFavorite(place.id) ? 'heart' : 'heart-outline'} size={22} color={isFavorite(place.id) ? colors.danger : colors.brownDark} />
          </TouchableOpacity>
          <View style={styles.heroCopy}>
            <Text style={styles.heroCategory}>{place.category.toUpperCase()} · DEMO</Text>
            <Text style={styles.heroTitle}>{place.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="star" size={15} color="#FFB020" />
              <Text style={styles.heroMetaText}>{place.rating} ({place.reviewCount} reseñas)</Text>
              <Text style={styles.heroMetaText}>· {place.priceRange}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={18} color={colors.primary} />
              </View>
              <View style={styles.locationCopy}>
                <Text style={styles.address}>{place.address}</Text>
                <Text style={styles.distance}>{place.distanceMeters} m de tu punto de partida</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Info icon="time-outline" label="Horario" value={place.openHours} />
              <Info icon="people-outline" label="Aforo demo" value={`${place.capacity} personas`} />
            </View>
          </Card>

          <SectionTitle title="Un poquito de sabor" subtitle={place.description} />
          <View style={styles.tags}>
            {place.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <SectionTitle title="Platos del día" subtitle="Precios y platos de muestra" />
          {place.dishes.map((dish) => (
            <Card key={dish.name} style={styles.dishCard}>
              <View style={styles.dishIcon}>
                <Ionicons name="restaurant-outline" size={23} color={colors.primary} />
              </View>
              <View style={styles.dishCopy}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishDescription}>{dish.description}</Text>
                <Text style={styles.dishTag}>{dish.tag}{dish.recommended ? ' · Recomendado' : ''}</Text>
              </View>
              <Text style={styles.dishPrice}>S/ {dish.price}</Text>
            </Card>
          ))}

          <SectionTitle title="Reseñas de la comunidad" subtitle="Comentarios ficticios para esta demo" />
          {place.reviews.map((review) => (
            <Card key={review.name} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewInitial}>{review.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Text>
                </View>
                <View style={styles.reviewIdentity}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewNeighborhood}>{review.neighborhood} · Reseña demo</Text>
                </View>
                <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>“{review.text}”</Text>
            </Card>
          ))}

          <View style={styles.demoNotice}>
            <Ionicons name="sparkles-outline" size={17} color={colors.primary} />
            <Text style={styles.demoNoticeText}>Menú, precios, horario y reseñas son contenido de demostración.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button
          title="Reservar con Lía"
          onPress={() => navigation.navigate('LiaChat', { restaurantId: place.id })}
          icon={<Ionicons name="chatbubble-ellipses-outline" size={19} color={colors.surface} />}
          style={styles.reserveButton}
        />
        <TouchableOpacity
          style={styles.routeButton}
          onPress={() => navigation.navigate('RouteSimulation', { restaurantId: place.id })}
        >
          <Ionicons name="navigate-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Info({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: 310, position: 'relative', backgroundColor: colors.peach },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  heroPlaceholderText: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  backButton: { position: 'absolute', top: 48, left: spacing.md, width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  favoriteButton: { position: 'absolute', top: 48, right: spacing.md, width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  heroCopy: { position: 'absolute', bottom: spacing.lg, left: spacing.lg, right: spacing.lg },
  heroCategory: { color: colors.successLight, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, letterSpacing: 0.6 },
  heroTitle: { marginTop: 5, color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: 26 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  heroMetaText: { color: colors.surface, fontFamily: typography.fontFamily.semiBold, fontSize: typography.fontSize.xs },
  content: { padding: spacing.md, paddingBottom: 18 },
  locationCard: { padding: spacing.md, marginTop: spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' },
  locationCopy: { flex: 1, marginLeft: spacing.sm },
  address: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  distance: { marginTop: 2, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs },
  infoRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: spacing.borderRadius.md, backgroundColor: colors.peach },
  infoCopy: { flex: 1 },
  infoLabel: { color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  infoValue: { marginTop: 2, color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  sectionTitleWrap: { marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg },
  sectionSubtitle: { marginTop: 3, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, lineHeight: 18 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.peach },
  tagText: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  dishCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, marginBottom: spacing.sm },
  dishIcon: { width: 54, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: spacing.borderRadius.md, backgroundColor: colors.peach },
  dishCopy: { flex: 1, marginHorizontal: spacing.sm },
  dishName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs },
  dishDescription: { marginTop: 3, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10, lineHeight: 15 },
  dishTag: { marginTop: 4, color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: 9 },
  dishPrice: { alignSelf: 'flex-start', color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  reviewCard: { padding: spacing.md, marginBottom: spacing.sm },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' },
  reviewInitial: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs },
  reviewIdentity: { flex: 1, marginLeft: spacing.sm },
  reviewName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs },
  reviewNeighborhood: { marginTop: 2, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  reviewStars: { color: colors.warning, fontSize: 12 },
  reviewText: { marginTop: spacing.sm, color: colors.textPrimary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs, lineHeight: 18 },
  demoNotice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, padding: spacing.md, borderRadius: spacing.borderRadius.md, backgroundColor: colors.peach },
  demoNoticeText: { flex: 1, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10, lineHeight: 15 },
  bottomActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  reserveButton: { flex: 1 },
  routeButton: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: spacing.borderRadius.lg, backgroundColor: colors.peach },
});
