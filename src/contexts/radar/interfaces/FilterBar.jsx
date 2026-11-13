import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip } from '../../../shared/interfaces/ui/index.js';
import { spacing } from '../../../shared/interfaces/theme/spacing.js';

const CHIPS = ['Todos', 'Más Bravos', 'Cevicherías', 'Criollo', 'Marino', 'Tradicional', 'A la brasa', 'Chifa', 'Económico'];

export function FilterBar({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CHIPS.map((chip) => (
        <View key={chip} style={styles.chipWrap}>
          <Chip
            label={chip}
            selected={selected === chip}
            onPress={() => onSelect(chip)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  chipWrap: {
    marginRight: spacing.sm,
  },
});
