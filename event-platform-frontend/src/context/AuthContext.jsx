import { createContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
} from "../services/api/authApi";
import { getToken, removeToken, saveToken } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = Boolean(user);

  const loadCurrentUser = async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setInitialLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      removeToken();
      setUser(null);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (payload) => {
    setAuthLoading(true);

    try {
      const response = await loginApi(payload);
      saveToken(response.token);

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return currentUser;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);

    try {
      const response = await registerApi(payload);
      saveToken(response.token);

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return currentUser;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      initialLoading,
      authLoading,
      login,
      register,
      logout,
      hasRole,
      refreshUser: loadCurrentUser,
    }),
    [user, isAuthenticated, initialLoading, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}