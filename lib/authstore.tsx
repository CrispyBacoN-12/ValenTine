"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabaseClient";
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
