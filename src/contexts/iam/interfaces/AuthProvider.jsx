import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth.js';
import { DEMO_MODE } from '../../../shared/demo/demoMode.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    login: authLogin,
    register: authRegister,
    logout: authLogout,
    restoreSession,
    ...authState
  } = useAuth();
  const [isDemoSessionActive, setIsDemoSessionActive] = useState(true);

  const login = useCallback(async (...args) => {
    const result = await authLogin(...args);
    if (DEMO_MODE) setIsDemoSessionActive(true);
    return result;
  }, [authLogin]);

  const register = useCallback(async (...args) => {
    const result = await authRegister(...args);
    if (DEMO_MODE) setIsDemoSessionActive(true);
    return result;
  }, [authRegister]);

  const logout = useCallback(async (...args) => {
    await authLogout(...args);
    if (DEMO_MODE) setIsDemoSessionActive(false);
  }, [authLogout]);

  const value = useMemo(
    () => ({ ...authState, login, register, logout, isDemoSessionActive }),
    [authState, login, register, logout, isDemoSessionActive],
  );

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
