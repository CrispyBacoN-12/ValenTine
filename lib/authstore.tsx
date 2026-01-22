"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
const supabaseBrowser = createClient;

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  userEmail: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.getSession();

    const session = data?.session;
    if (!error && session?.user?.email) {
      setIsLoggedIn(true);
      setUserEmail(session.user.email);
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // 1) โหลด session ครั้งแรก
    refresh();

    // 2) ฟัง event login/logout/refresh
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    await refresh();
  };

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, userEmail, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
// lib/authstore.tsx
// Simple client-side token storage for Admin/User tokens.
// NOTE: This runs in the browser only. Do NOT use on server.

const ADMIN_KEY = "si135_admin_token";
const USER_KEY = "si135_user_token";

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

// ✅ Admin token
export function getAdminToken(): string | null {
  return safeGet(ADMIN_KEY);
}

export function setAdminToken(token: string) {
  safeSet(ADMIN_KEY, token);
}

export function clearAdminToken() {
  safeRemove(ADMIN_KEY);
}

// ✅ User token
export function getUserToken(): string | null {
  return safeGet(USER_KEY);
}

export function setUserToken(token: string) {
  safeSet(USER_KEY, token);
}

export function clearUserToken() {
  safeRemove(USER_KEY);
}
