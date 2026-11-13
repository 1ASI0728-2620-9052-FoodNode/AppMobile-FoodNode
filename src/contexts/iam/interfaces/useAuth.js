import { useState, useCallback, useRef, useEffect } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';

export function useAuth() {
  const deps = useDependencies();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const safe = (fn) => async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fn(...args);
      return result;
    } catch (err) {
      if (mounted.current) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Ocurrió un error inesperado';
        setError(message);
      }
      throw err;
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  const register = useCallback(
    safe(async ({ email, password, name, username, role }) => {
      const result = await deps.iam.registerHandler.execute({
        email, password, name, username, role,
      });
      if (mounted.current) setUser(result.user);
      return result;
    }),
    [deps],
  );

  const login = useCallback(
    safe(async ({ email, password }) => {
      const result = await deps.iam.loginHandler.execute({ email, password });
      if (mounted.current) setUser(result.user);
      return result;
    }),
    [deps],
  );

  const logout = useCallback(
    safe(async () => {
      await deps.iam.logoutHandler.execute();
      if (mounted.current) setUser(null);
    }),
    [deps],
  );

  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await deps.iam.restoreSessionHandler.execute();
      if (session && mounted.current) {
        setUser(session.user);
      }
    } catch {
      // no stored session — ignore
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, [deps]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    restoreSession,
    clearError: () => setError(null),
  };
}
