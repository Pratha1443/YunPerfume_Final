"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthUser {
  email: string;
  signedInAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  sendMagicLink: (email: string) => Promise<{ token: string }>;
  verify: (email: string, token: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "yun:user";
const TOKEN_KEY = "yun:magic-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    // Demo magic link — in production this would call a server function
    // that sends an email via Lovable Cloud / email provider
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ email, token }));
    await new Promise((r) => setTimeout(r, 700));
    return { token };
  }, []);

  const verify = useCallback((email: string, token: string) => {
    try {
      const raw = sessionStorage.getItem(TOKEN_KEY);
      if (!raw) return false;
      const stored = JSON.parse(raw) as { email: string; token: string };
      if (stored.email === email && stored.token === token.toUpperCase()) {
        const u: AuthUser = { email, signedInAt: new Date().toISOString() };
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        sessionStorage.removeItem(TOKEN_KEY);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, sendMagicLink, verify, signOut }),
    [user, sendMagicLink, verify, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
