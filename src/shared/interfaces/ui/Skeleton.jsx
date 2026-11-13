import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { spacing } from '../theme/index.js';

export function Skeleton({ width, height, borderRadius, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: borderRadius || spacing.borderRadius.md, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({ base: { backgroundColor: '#E0D0C4' } });

