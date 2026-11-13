import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from './useFavorites.js';
import { colors } from '../../../shared/interfaces/theme/colors.js';

export function FavoriteButton({ huariqueId, size = 24 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const scale = useRef(new Animated.Value(1)).current;
  const favorited = isFavorite(huariqueId);

  const handlePress = () => {
    Animated.spring(scale, {
      toValue: 1.3,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start(() => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }).start();
    });
    toggleFavorite(huariqueId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={size}
          color={favorited ? colors.danger : colors.textSecondary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
