"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    accountNumber: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "statementiq_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      authApi
        .me()
        .then(({ user }) => setUser(user))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const persistToken = (t: string, u: User) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    persistToken(res.token, res.user);
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      accountNumber: string;
      phone?: string;
    }) => {
      const res = await authApi.register(data);
      persistToken(res.token, res.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
