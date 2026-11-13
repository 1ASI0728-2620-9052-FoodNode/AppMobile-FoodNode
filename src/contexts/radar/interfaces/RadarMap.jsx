import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { colors } from '../../../shared/interfaces/theme/colors.js';
import { typography } from '../../../shared/interfaces/theme/typography.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';

const DEFAULT_REGION = {
  latitude: -12.1403,
  longitude: -77.0219,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function toMapCoords(boundary) {
  if (!boundary || !Array.isArray(boundary)) return [];
  return boundary.map((pair) => ({
    latitude: pair[0],
    longitude: pair[1],
  }));
}

export function RadarMap({ huariques, coverageZone, userCoords, h3Index }) {
  const region = userCoords
    ? {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : DEFAULT_REGION;

  const centralBoundary = coverageZone?.boundaries?.[coverageZone?.centralCell]
    ? toMapCoords(coverageZone.boundaries[coverageZone.centralCell])
    : null;

  const neighborBoundaries = (coverageZone?.neighborCells ?? []).map((cellIndex) => ({
    cellIndex,
    coords: toMapCoords(coverageZone?.boundaries?.[cellIndex] ?? []),
  }));

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region}>
        {/* Central cell polygon */}
        {centralBoundary && centralBoundary.length > 0 && (
          <Polygon
            coordinates={centralBoundary}
            fillColor="rgba(150,65,0,0.2)"
            strokeColor={colors.primary}
            strokeWidth={2}
          />
        )}

        {/* Neighbor cell polygons */}
        {neighborBoundaries.map(({ cellIndex, coords }) =>
          coords.length > 0 ? (
            <Polygon
              key={cellIndex}
              coordinates={coords}
              fillColor="transparent"
              strokeColor={colors.primary}
              strokeWidth={1}
              opacity={0.5}
            />
          ) : null
        )}

        {/* Huarique markers */}
        {(huariques ?? []).map((h) => (
          <Marker
            key={h.id}
            coordinate={{
              latitude: h.coordinates?.lat ?? h.coordinates?.latitude ?? 0,
              longitude: h.coordinates?.lng ?? h.coordinates?.longitude ?? 0,
            }}
            title={h.name}
          />
        ))}
      </MapView>

      {/* Zona Caliente badge */}
      <View style={styles.zoneBadge}>
        <Text style={styles.zoneBadgeText}>
          Zona Caliente: {huariques?.length ?? 0} huariques activos
        </Text>
      </View>

      {/* H3 index label */}
      {h3Index ? (
        <View style={styles.h3Label}>
          <Text style={styles.h3Text} numberOfLines={1}>{h3Index}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  zoneBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colors.peach,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  zoneBadgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.brownDark,
  },
  h3Label: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    opacity: 0.85,
  },
  h3Text: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },
});
