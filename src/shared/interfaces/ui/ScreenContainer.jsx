import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/index.js';

export function ScreenContainer({ children, scrollable = true, style, padded = true }) {
  const content = (
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1 },
  padded: { padding: spacing.screenPadding },
  scroll: { flexGrow: 1 },
});
