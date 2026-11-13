import React from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../../shared/interfaces/ui/ScreenContainer.jsx';
import { Button } from '../../../shared/interfaces/ui/Button.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';

const DEMO_ROUTES = [
  {
    id: 'marino',
    title: 'La ruta del ceviche',
    subtitle: 'Leche de tigre, pesca fresca y sabor del mar.',
    duration: '55 min',
    distance: '1.4 km',
    stops: ['h2', 'h9', 'h1'],
    accent: '#DDF0EE',
    icon: 'fish-outline',
  },
  {
    id: 'criollo',
    title: 'Tradición barranquina',
    subtitle: 'Anticuchos, guisos y cocina de barrio.',
    duration: '1 h 20 min',
    distance: '2.1 km',
    stops: ['h3', 'h4', 'h10'],
    accent: '#FCE4D6',
    icon: 'flame-outline',
  },
  {
    id: 'brasa',
    title: 'De la brasa a la mesa',
    subtitle: 'Un recorrido para los amantes de las brasas.',
    duration: '45 min',
    distance: '1.6 km',
    stops: ['h7', 'h8', 'h3'],
    accent: '#F8E7D1',
    icon: 'bonfire-outline',
  },
];

export function RoutesScreen() {
  const navigation = useNavigation();
  const { startRoute, reservations } = useDemoData();

  const beginRoute = (route) => {
    startRoute(route);
    navigation.navigate('RouteSimulation');
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>RECORRE Y DISFRUTA</Text>
        <Text style={styles.title}>Rutas de sabor</Text>
        <Text style={styles.subtitle}>Recorridos listos para conocer los huariques de Barranco.</Text>
      </View>

      <View style={styles.mapPreview}>
        <View style={styles.mapRoadHorizontal} />
        <View style={styles.mapRoadVertical} />
        <View style={styles.routeDottedLine} />
        {[{ left: '18%', top: '63%' }, { left: '48%', top: '31%' }, { left: '76%', top: '60%' }].map((position, index) => (
          <View key={index} style={[styles.mapPin, position]}>
            <Text style={styles.mapPinText}>{index + 1}</Text>
          </View>
        ))}
        <View style={styles.mapCaption}>
          <Ionicons name="map-outline" size={15} color={colors.primary} />
          <Text style={styles.mapCaptionText}>Barranco, Lima · Mapa ilustrativo</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Elige tu recorrido</Text>
        <Text style={styles.demoTag}>3 RUTAS DEMO</Text>
      </View>

      {DEMO_ROUTES.map((route) => {
        const firstStop = DEMO_HUARIQUES.find((place) => place.id === route.stops[0]);
        return (
          <View key={route.id} style={styles.routeCard}>
            <View style={[styles.routeIllustration, { backgroundColor: route.accent }]}>
              <Ionicons name={route.icon} size={34} color={colors.primary} />
              <View style={styles.stopCount}>
                <Text style={styles.stopCountText}>{route.stops.length} paradas</Text>
              </View>
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeTitle}>{route.title}</Text>
              <Text style={styles.routeSubtitle}>{route.subtitle}</Text>
              <View style={styles.routeInfo}>
                <Meta icon="time-outline" label={route.duration} />
                <Meta icon="walk-outline" label={route.distance} />
              </View>
              <Text style={styles.firstStop}>Empieza en {firstStop?.name}</Text>
              <Button
                title="Simular recorrido"
                size="sm"
                onPress={() => beginRoute(route)}
                icon={<Ionicons name="navigate-outline" size={16} color={colors.surface} />}
                style={styles.startButton}
              />
            </View>
          </View>
        );
      })}

      <View style={styles.reservationHeading}>
        <View>
          <Text style={styles.sectionTitle}>Mis reservas</Text>
          <Text style={styles.reservationSubtitle}>Confirmaciones de tu demo con Lía</Text>
        </View>
        <View style={styles.reservationCount}><Text style={styles.reservationCountText}>{reservations.length}</Text></View>
      </View>

      {reservations.length ? reservations.map((reservation) => {
        const place = DEMO_HUARIQUES.find((item) => item.id === reservation.restaurantId);
        return (
          <View key={reservation.id} style={styles.bookingCard}>
            <View style={styles.bookingIcon}><Ionicons name="restaurant-outline" size={22} color={colors.primary} /></View>
            <View style={styles.bookingCopy}>
              <Text style={styles.bookingName}>{reservation.restaurantName}</Text>
              <Text style={styles.bookingDetails}>{reservation.date} · {reservation.time}</Text>
              <Text style={styles.bookingDetails}>{reservation.guests} · Código {reservation.code}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookingLink}
              onPress={() => place ? navigation.navigate('HuariqueDetail', { id: place.id }) : Alert.alert('Reserva', 'Esta reserva es solo una simulación.')}
              accessibilityLabel="Ver restaurante reservado"
            >
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        );
      }) : (
        <View style={styles.emptyBooking}>
          <View style={styles.emptyIcon}><Ionicons name="calendar-outline" size={24} color={colors.primary} /></View>
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>Aún no tienes reservas</Text>
            <Text style={styles.emptyText}>Pídele a Lía que te ayude a reservar una mesa.</Text>
          </View>
          <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('LiaChat')}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.surface} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.demoNote}>
        <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
        <Text style={styles.demoNoteText}>Rutas, tiempos, distancias y reservas son simulaciones.</Text>
      </View>
    </ScreenContainer>
  );
}

function Meta({ icon, label }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md },
  eyebrow: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs, letterSpacing: 1 },
  title: { marginTop: 4, color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: 26 },
  subtitle: { marginTop: 6, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, lineHeight: 20 },
  mapPreview: { height: 150, overflow: 'hidden', position: 'relative', marginBottom: spacing.lg, borderRadius: spacing.borderRadius.lg, backgroundColor: '#E8EFE3' },
  mapRoadHorizontal: { position: 'absolute', top: '43%', left: '-5%', width: '110%', height: 22, backgroundColor: '#FAF9F1', transform: [{ rotate: '-13deg' }] },
  mapRoadVertical: { position: 'absolute', top: '-15%', left: '54%', width: 20, height: '130%', backgroundColor: '#FAF9F1', transform: [{ rotate: '25deg' }] },
  routeDottedLine: { position: 'absolute', top: '48%', left: '22%', width: '55%', height: 3, backgroundColor: colors.primary, transform: [{ rotate: '-10deg' }] },
  mapPin: { position: 'absolute', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.surface },
  mapPinText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: 10 },
  mapCaption: { position: 'absolute', left: spacing.sm, bottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.surface },
  mapCaptionText: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 9 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  demoTag: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 9, letterSpacing: 0.6 },
  routeCard: { overflow: 'hidden', marginBottom: spacing.md, borderRadius: spacing.borderRadius.lg, backgroundColor: colors.surface },
  routeIllustration: { height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  stopCount: { position: 'absolute', top: spacing.sm, right: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 12, backgroundColor: colors.surface },
  stopCountText: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  routeContent: { padding: spacing.md },
  routeTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  routeSubtitle: { marginTop: 4, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.xs },
  routeInfo: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textSecondary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  firstStop: { marginTop: spacing.sm, color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  startButton: { marginTop: spacing.sm },
  reservationHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm },
  reservationSubtitle: { marginTop: 3, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  reservationCount: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.peach },
  reservationCountText: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.sm },
  bookingCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, padding: spacing.md, borderRadius: spacing.borderRadius.lg, backgroundColor: colors.surface },
  bookingIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: colors.peach },
  bookingCopy: { flex: 1, marginLeft: spacing.sm },
  bookingName: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xs },
  bookingDetails: { marginTop: 3, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  bookingLink: { width: 32, height: 38, alignItems: 'center', justifyContent: 'center' },
  emptyBooking: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: spacing.borderRadius.lg, backgroundColor: colors.surface },
  emptyIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.peach },
  emptyCopy: { flex: 1 },
  emptyTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  emptyText: { marginTop: 3, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9 },
  chatButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  demoNote: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', marginTop: spacing.md, padding: spacing.sm },
  demoNoteText: { flex: 1, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9 },
});
