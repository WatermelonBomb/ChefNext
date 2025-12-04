import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { identityClient } from '../lib/apiClient';
import type { AuthTokens, AuthUser, UserRole } from '@chefnext/api-client';
import { ApiError } from '@chefnext/api-client';

interface AuthContextValue {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isReady: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (params: { email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
}

const STORAGE_KEY = 'chefnext.auth.tokens';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface PersistedAuth {
  user: AuthUser;
  tokens: AuthTokens;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    loading: false,
    error: null,
    isReady: false,
  });

  const persist = useCallback((payload: PersistedAuth | null) => {
    if (typeof window === 'undefined') return;
    if (!payload) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setState((prev) => ({ ...prev, isReady: true }));
      return;
    }

    try {
      const parsed: PersistedAuth = JSON.parse(raw);
      setState((prev) => ({ ...prev, tokens: parsed.tokens }));
      identityClient
        .getMe(parsed.tokens.accessToken)
        .then((user) => {
          setState({ user, tokens: parsed.tokens, loading: false, error: null, isReady: true });
          persist({ user, tokens: parsed.tokens });
        })
        .catch(() => {
          persist(null);
          setState({ user: null, tokens: null, loading: false, error: null, isReady: true });
        });
    } catch (error) {
      console.warn('Failed to restore auth session', error);
      window.localStorage.removeItem(STORAGE_KEY);
      setState((prev) => ({ ...prev, isReady: true }));
    }
  }, [persist]);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      setState((prev) => ({ ...prev, error: error.message }));
    } else if (error instanceof Error) {
      setState((prev) => ({ ...prev, error: error.message }));
    } else {
      setState((prev) => ({ ...prev, error: '予期せぬエラーが発生しました' }));
    }
  }, []);

  const setAuthState = useCallback((payload: PersistedAuth) => {
    persist(payload);
    setState({ user: payload.user, tokens: payload.tokens, loading: false, error: null, isReady: true });
  }, [persist]);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await identityClient.login({ email, password });
      setAuthState({ user: result.user, tokens: result.tokens });
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [handleError, setAuthState]);

  const register = useCallback(async (params: { email: string; password: string; role: UserRole }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await identityClient.register(params);
      setAuthState({ user: result.user, tokens: result.tokens });
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [handleError, setAuthState]);

  const logout = useCallback(async () => {
    if (!state.tokens) {
      persist(null);
      setState({ user: null, tokens: null, loading: false, error: null, isReady: true });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));
    try {
      await identityClient.logout(state.tokens.refreshToken);
    } catch (error) {
      console.warn('Failed to invalidate refresh token', error);
    } finally {
      persist(null);
      setState({ user: null, tokens: null, loading: false, error: null, isReady: true });
    }
  }, [persist, state.tokens]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    tokens: state.tokens,
    isAuthenticated: Boolean(state.user),
    isReady: state.isReady,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  }), [state, login, register, logout, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
