import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';
import {
  Skeleton,
  EmptyState,
  ErrorState,
} from '../../../shared/interfaces/ui/index.js';
import { useRadar } from './useRadar.js';
import { HuariqueCard } from './HuariqueCard.jsx';
import { FilterBar } from './FilterBar.jsx';
import { RadarMap } from './RadarMap.jsx';
import { useDemoData } from '../../../app/providers/DemoDataProvider.jsx';
import { DEMO_MODE } from '../../../shared/demo/demoMode.js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function RadarScreen() {
  const navigation = useNavigation();
  const {
    coverageZone,
    h3Index,
    isLoading,
    error,
    locationLabel,
    hasPermission,
    userCoords,
    refresh,
    filterText,
    setFilterText,
    filteredHuariques,
  } = useRadar();

  const [selectedChip, setSelectedChip] = useState('Todos');
  const { isFavorite, toggleFavorite } = useDemoData();
  const visibleHuariques = filteredHuariques.filter((place) => {
    if (selectedChip === 'Todos') return true;
    if (selectedChip === 'Más Bravos') return place.rating >= 4.8;
    return place.tags?.includes(selectedChip) || place.category === selectedChip;
  });

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ErrorState message={error} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  if (!hasPermission && !isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <EmptyState
          icon="location-off"
          title="Necesitamos tu ubicación"
          subtitle="Para mostrarte huariques cercanos"
          action={{ label: 'Reintentar', onPress: refresh }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="restaurant" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Radar Huariques</Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={20} color={colors.surface} />
          </View>
        </View>

        {/* Location chip */}
        <View style={styles.locationRow}>
          <TouchableOpacity style={styles.locationChip}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={styles.locationText}>{locationLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar huarique, ceviche, ají de gallina..."
              placeholderTextColor={colors.textSecondary}
              value={filterText}
              onChangeText={setFilterText}
            />
            <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
          </View>
        </View>

        {/* FilterBar */}
        <View style={styles.filterBarContainer}>
          <FilterBar selected={selectedChip} onSelect={setSelectedChip} />
        </View>

        {/* Map */}
        <View style={{ height: SCREEN_HEIGHT * 0.33, width: SCREEN_WIDTH }}>
          <RadarMap
            huariques={visibleHuariques}
            coverageZone={coverageZone}
            userCoords={userCoords}
            h3Index={h3Index}
          />
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}> {DEMO_MODE ? 'Huariques para descubrir' : 'Huariques en este Hexágono'}</Text>
          <Text style={styles.sectionCount}>{visibleHuariques.length} cerca</Text>
        </View>

        {/* Huarique list */}
        {isLoading ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} style={styles.skeletonCard} />
            ))}
          </View>
        ) : visibleHuariques.length === 0 ? (
          <EmptyState title="No hay huariques aquí aún, ¡recomienda uno!" />
        ) : (
          <FlatList
            horizontal
            data={visibleHuariques}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <HuariqueCard
                huarique={item}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onPressDetail={() => navigation.navigate('HuariqueDetail', { id: item.id })}
                onPressRoute={() => navigation.navigate('RouteSimulation', { restaurantId: item.id })}
              />
            )}
          />
        )}

        {/* Bottom spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <View pointerEvents="box-none" style={styles.fabDock}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('LiaChat')}>
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.surface} />
          <Text style={styles.fabText}>Preguntar a Lía</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.brownDark,
    flex: 1,
    marginLeft: spacing.sm,
  },
  demoBadge: {
    marginLeft: 2,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.peach,
  },
  demoBadgeText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  headerIcon: {
    marginRight: spacing.md,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.peach,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  locationText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.brownDark,
    marginHorizontal: 4,
  },
  searchRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  filterBarContainer: {
    paddingLeft: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.brownDark,
    flex: 1,
  },
  sectionCount: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  listContent: {
    paddingLeft: spacing.lg,
    paddingBottom: spacing.lg,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
    paddingBottom: spacing.lg,
  },
  skeletonCard: {
    width: 280,
    height: 200,
    marginRight: spacing.sm,
    borderRadius: spacing.borderRadius.lg,
  },
  fabDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: spacing.lg,
    paddingBottom: spacing.md,
  },
  fab: {
    position: 'relative',
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: spacing.sm,
    elevation: 4,
    shadowColor: colors.brownDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.surface,
  },
});
