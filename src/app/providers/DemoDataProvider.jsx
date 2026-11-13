import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const DemoDataContext = createContext(null);

export function DemoDataProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set(['h1', 'h2']));
  const [reservations, setReservations] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addReservation = useCallback((reservation) => {
    const saved = {
      ...reservation,
      id: `res-${Date.now()}`,
      code: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
    };
    setReservations((current) => [saved, ...current]);
    return saved;
  }, []);

  const startRoute = useCallback((route) => {
    setActiveRoute({ ...route, currentStopIndex: 0 });
  }, []);

  const advanceRoute = useCallback(() => {
    setActiveRoute((current) => {
      if (!current) return null;
      if (current.currentStopIndex >= current.stops.length - 1) return null;
      return { ...current, currentStopIndex: current.currentStopIndex + 1 };
    });
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (id) => favorites.has(id),
      toggleFavorite,
      reservations,
      addReservation,
      activeRoute,
      startRoute,
      advanceRoute,
    }),
    [favorites, toggleFavorite, reservations, addReservation, activeRoute, startRoute, advanceRoute],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error('useDemoData must be used within DemoDataProvider');
  return context;
}
