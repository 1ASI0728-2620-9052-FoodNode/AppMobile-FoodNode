import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './useAuth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();

  useEffect(() => {
    auth.restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
