import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/index.js';

export function StarRating({ rating, maxRating = 5, onRate, size = 24 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.round(rating);
        if (onRate) {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onRate(i + 1)}
              style={styles.star}
              accessibilityLabel={`${i + 1} estrella${i > 0 ? 's' : ''}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={size}
                color={filled ? colors.warning : colors.border}
              />
            </TouchableOpacity>
          );
        }
        return (
          <Ionicons
            key={i}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? colors.warning : colors.border}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  star: { padding: 2 },
});

