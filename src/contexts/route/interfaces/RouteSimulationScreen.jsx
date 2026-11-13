import React, { useEffect, useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/interfaces/ui/Button.jsx';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';

export function RouteSimulationScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { activeRoute, startRoute, advanceRoute } = useDemoData();
  const restaurant = DEMO_HUARIQUES.find((item) => item.id === params?.restaurantId);
  const initializedRouteId = useRef(null);

  useEffect(() => {
    const targetId = restaurant?.id ?? 'default';
    if (initializedRouteId.current === targetId) return;

    if (restaurant && activeRoute?.id !== `single-${restaurant.id}`) {
      initializedRouteId.current = targetId;
      startRoute({
        id: `single-${restaurant.id}`,
        title: `Ruta a ${restaurant.name}`,
        subtitle: 'Recorrido gastronómico simulado por Barranco',
        duration: '18 min',
        distance: '1.2 km',
        stops: [restaurant.id],
      });
    } else if (!restaurant && !activeRoute) {
      initializedRouteId.current = targetId;
      startRoute({
        id: 'single-barranco',
        title: 'Paseo de sabores criollos',
        subtitle: 'Recorrido gastronómico simulado por Barranco',
        duration: '35 min',
        distance: '1.8 km',
        stops: ['h1', 'h3', 'h4'],
      });
    } else {
      initializedRouteId.current = targetId;
    }
  }, [activeRoute, restaurant, startRoute]);

  if (!activeRoute) return null;

  const currentPlace = DEMO_HUARIQUES.find((item) => item.id === activeRoute.stops[activeRoute.currentStopIndex]);
  const nextPlace = DEMO_HUARIQUES.find((item) => item.id === activeRoute.stops[activeRoute.currentStopIndex + 1]);
  const isLastStop = activeRoute.currentStopIndex === activeRoute.stops.length - 1;
  const progress = (activeRoute.currentStopIndex + 1) / activeRoute.stops.length;

  const advance = () => {
    if (isLastStop) {
      Alert.alert('¡Ruta completada!', 'Terminaste este recorrido de muestra. ¡Buen provecho!', [
        { text: 'Volver a Rutas', onPress: () => { advanceRoute(); navigation.goBack(); } },
      ]);
      return;
    }
    advanceRoute();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={21} color={colors.brownDark} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Ruta en curso</Text>
            <Text style={styles.headerSubtitle}>Simulación · sin GPS</Text>
          </View>
          <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>DEMO</Text></View>
        </View>

        <View style={styles.mapCard}>
          <View style={styles.map}>
            <View style={styles.streetOne} />
            <View style={styles.streetTwo} />
            <View style={styles.streetThree} />
            <View style={styles.routeLine} />
            {activeRoute.stops.map((stopId, index) => {
              const place = DEMO_HUARIQUES.find((item) => item.id === stopId);
              const positions = [
                { left: '18%', top: '68%' },
                { left: '45%', top: '40%' },
                { left: '72%', top: '20%' },
                { left: '80%', top: '69%' },
              ];
              return (
                <View key={stopId} style={[styles.mapMarker, positions[index % positions.length], index === activeRoute.currentStopIndex && styles.currentMarker]}>
                  <Text style={styles.markerText}>{index + 1}</Text>
                  <View style={styles.markerTooltip}><Text style={styles.markerTooltipText} numberOfLines={1}>{place?.name}</Text></View>
                </View>
              );
            })}
            <View style={styles.mapLabel}><Ionicons name="navigate" size={14} color={colors.primary} /><Text style={styles.mapLabelText}>Barranco, Lima</Text></View>
          </View>
          <View style={styles.routeStats}>
            <Stat icon="time-outline" label={activeRoute.duration} />
            <Stat icon="walk-outline" label={activeRoute.distance} />
            <Stat icon="flag-outline" label={`${activeRoute.stops.length} paradas`} />
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{activeRoute.title}</Text>
          <Text style={styles.progressCount}>Parada {activeRoute.currentStopIndex + 1} de {activeRoute.stops.length}</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>

        <View style={styles.instructionCard}>
          <View style={styles.instructionIcon}><Ionicons name={isLastStop ? 'flag' : 'arrow-forward'} size={23} color={colors.surface} /></View>
          <View style={styles.instructionCopy}>
            <Text style={styles.instructionEyebrow}>{isLastStop ? 'PARADA FINAL' : 'SIGUIENTE PARADA'}</Text>
            <Text style={styles.instructionTitle}>{currentPlace?.name}</Text>
            <Text style={styles.instructionText}>
              {isLastStop ? '¡Ya llegaste! Explora el detalle o reserva con Lía.' : `Sigue hacia ${nextPlace?.name}. Distancia aproximada: 350 m.`}
            </Text>
          </View>
        </View>

        <View style={styles.stopList}>
          {activeRoute.stops.map((stopId, index) => {
            const place = DEMO_HUARIQUES.find((item) => item.id === stopId);
            const completed = index < activeRoute.currentStopIndex;
            const active = index === activeRoute.currentStopIndex;
            return (
              <View key={stopId} style={styles.stopRow}>
                <View style={[styles.stopNumber, active && styles.stopNumberActive, completed && styles.stopNumberDone]}>
                  <Text style={[styles.stopNumberText, (active || completed) && styles.stopNumberTextActive]}>
                    {completed ? '✓' : index + 1}
                  </Text>
                </View>
                <View style={styles.stopCopy}>
                  <Text style={styles.stopName}>{place?.name}</Text>
                  <Text style={styles.stopCategory}>{place?.category} · {place?.distanceMeters} m aprox.</Text>
                </View>
                <Text style={styles.stopStatus}>{completed ? 'Visitado' : active ? 'Ahora' : 'Pendiente'}</Text>
              </View>
            );
          })}
        </View>

        {currentPlace ? (
          <TouchableOpacity style={styles.detailLink} onPress={() => navigation.navigate('HuariqueDetail', { id: currentPlace.id })}>
            <Ionicons name="restaurant-outline" size={17} color={colors.primary} />
            <Text style={styles.detailLinkText}>Ver detalle de {currentPlace.name}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.primary} />
          </TouchableOpacity>
        ) : null}

        <Button
          title={isLastStop ? 'Completar ruta' : 'Llegué · Siguiente parada'}
          onPress={advance}
          icon={<Ionicons name={isLastStop ? 'checkmark-circle-outline' : 'navigate-outline'} size={19} color={colors.surface} />}
          style={styles.advanceButton}
        />
        <Text style={styles.disclaimer}>Mapa, distancias, tiempos y navegación son ilustrativos.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backButton: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  headerTitle: { color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  headerSubtitle: { marginTop: 2, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.peach },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveText: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 9 },
  mapCard: { marginHorizontal: spacing.md, overflow: 'hidden', borderRadius: spacing.borderRadius.lg, backgroundColor: colors.surface },
  map: { height: 290, overflow: 'hidden', position: 'relative', backgroundColor: '#E6EFE6' },
  streetOne: { position: 'absolute', width: '130%', height: 34, left: '-10%', top: '30%', backgroundColor: '#FDFBF4', transform: [{ rotate: '-22deg' }] },
  streetTwo: { position: 'absolute', width: '130%', height: 28, left: '-8%', top: '67%', backgroundColor: '#FDFBF4', transform: [{ rotate: '18deg' }] },
  streetThree: { position: 'absolute', width: 28, height: '130%', left: '56%', top: '-10%', backgroundColor: '#FDFBF4', transform: [{ rotate: '24deg' }] },
  routeLine: { position: 'absolute', left: '24%', top: '33%', width: '49%', height: 5, borderRadius: 3, backgroundColor: colors.primary, transform: [{ rotate: '-30deg' }] },
  mapMarker: { position: 'absolute', width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.surface },
  currentMarker: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.brownDark },
  markerText: { color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: 12 },
  markerTooltip: { position: 'absolute', top: 33, minWidth: 90, maxWidth: 135, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 7, backgroundColor: colors.surface },
  markerTooltipText: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 8, textAlign: 'center' },
  mapLabel: { position: 'absolute', left: spacing.sm, bottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.surface },
  mapLabelText: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  routeStats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginHorizontal: spacing.md },
  progressTitle: { flex: 1, marginRight: spacing.sm, color: colors.brownDark, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  progressCount: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 },
  progressTrack: { height: 7, marginHorizontal: spacing.md, marginTop: spacing.sm, overflow: 'hidden', borderRadius: 4, backgroundColor: colors.border },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  instructionCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.md, marginTop: spacing.md, padding: spacing.md, borderRadius: spacing.borderRadius.lg, backgroundColor: colors.primary },
  instructionIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)' },
  instructionCopy: { flex: 1 },
  instructionEyebrow: { color: '#FFD4B7', fontFamily: typography.fontFamily.bold, fontSize: 9, letterSpacing: 0.6 },
  instructionTitle: { marginTop: 3, color: colors.surface, fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.md },
  instructionText: { marginTop: 4, color: colors.surface, fontFamily: typography.fontFamily.regular, fontSize: 10, lineHeight: 15 },
  stopList: { marginHorizontal: spacing.md, marginTop: spacing.md, padding: spacing.md, borderRadius: spacing.borderRadius.lg, backgroundColor: colors.surface },
  stopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.background },
  stopNumber: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.peach },
  stopNumberActive: { backgroundColor: colors.primary },
  stopNumberDone: { backgroundColor: colors.success },
  stopNumberText: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: 11 },
  stopNumberTextActive: { color: colors.surface },
  stopCopy: { flex: 1, marginLeft: spacing.sm },
  stopName: { color: colors.brownDark, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  stopCategory: { marginTop: 2, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9 },
  stopStatus: { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 9 },
  detailLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginHorizontal: spacing.md, marginTop: spacing.md, padding: spacing.md, borderRadius: spacing.borderRadius.md, backgroundColor: colors.peach },
  detailLinkText: { flex: 1, color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 11 },
  advanceButton: { marginHorizontal: spacing.md, marginTop: spacing.md, width: undefined },
  disclaimer: { marginTop: spacing.sm, color: colors.textSecondary, fontFamily: typography.fontFamily.regular, fontSize: 9, textAlign: 'center' },
});
