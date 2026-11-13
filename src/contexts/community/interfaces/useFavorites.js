import { useState, useCallback, useEffect } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';

export function useFavorites() {
  const container = useDependencies();
  const { addFavoriteHandler, removeFavoriteHandler, getFavoritesHandler } = container.community;

  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getFavoritesHandler.execute();
      const ids = result.map((f) => f.huariqueId);
      setFavorites(new Set(ids));
    } catch (err) {
      // silently fail — favorites are not critical
    } finally {
      setIsLoading(false);
    }
  }, [getFavoritesHandler]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback((id) => favorites.has(id), [favorites]);

  const toggleFavorite = useCallback(async (id) => {
    if (favorites.has(id)) {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      try {
        await removeFavoriteHandler.execute({ huariqueId: id });
      } catch (err) {
        // rollback
        setFavorites((prev) => new Set([...prev, id]));
      }
    } else {
      setFavorites((prev) => new Set([...prev, id]));
      try {
        await addFavoriteHandler.execute({ huariqueId: id });
      } catch (err) {
        // rollback
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  }, [favorites, addFavoriteHandler, removeFavoriteHandler]);

  return { favorites, isFavorite, toggleFavorite, isLoading };
}
