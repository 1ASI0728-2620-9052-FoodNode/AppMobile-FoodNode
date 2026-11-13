import React, { createContext, useContext, useMemo } from 'react';
import { createContainer } from '../container.js';

const DependencyContext = createContext(null);

export function DependencyProvider({ children }) {
  const container = useMemo(() => createContainer(), []);
  return (
    <DependencyContext.Provider value={container}>
      {children}
    </DependencyContext.Provider>
  );
}

export function useDependencies() {
  const ctx = useContext(DependencyContext);
  if (!ctx) throw new Error('useDependencies must be used within DependencyProvider');
  return ctx;
}

