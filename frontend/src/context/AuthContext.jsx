import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, getStoredToken, setStoredToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const me = await apiRequest("/api/auth/me", { token: t });
      setUser(me);
      return me;
    } catch {
      setStoredToken("");
      setToken("");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setToken(getStoredToken());
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async ({ name, email, password }) => {
    const data = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setStoredToken("");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [token, user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
