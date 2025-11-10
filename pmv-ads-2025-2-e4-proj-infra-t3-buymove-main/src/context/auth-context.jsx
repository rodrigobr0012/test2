import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentUser, loginWithEmail } from "@/services/auth";

const TOKEN_STORAGE_KEY = "bm_token";
const USER_STORAGE_KEY = "bm_user";

function readStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Não foi possível recuperar os dados do usuário armazenados", error);
    return null;
  }
}

function readStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(null);
    setAuthError(null);
  }, []);

  const hydrateUser = useCallback(async () => {
    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (error) {
      console.error("Falha ao carregar o usuário autenticado", error);
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const token = readStoredToken();
    if (!token) {
      setInitializing(false);
      return;
    }

    hydrateUser()
      .catch(() => {
        /* já tratado em hydrateUser */
      })
      .finally(() => setInitializing(false));
  }, [hydrateUser]);

  const login = useCallback(
    async ({ email, password }) => {
      setIsAuthenticating(true);
      setAuthError(null);
      try {
        const { access_token } = await loginWithEmail({ email, password });
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        }
        await hydrateUser();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível fazer login.";
        setAuthError(message);
        logout();
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [hydrateUser, logout]
  );

  const value = useMemo(
    () => ({ user, login, logout, initializing, isAuthenticating, authError }),
    [user, login, logout, initializing, isAuthenticating, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
