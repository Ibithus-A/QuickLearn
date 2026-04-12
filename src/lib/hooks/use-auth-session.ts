"use client";

import { accountFromUser } from "@/lib/supabase/account";
import { createClient } from "@/lib/supabase/client";
import type { AuthenticatedAccount } from "@/types/auth";
import { useCallback, useEffect, useState } from "react";

function isMissingRefreshTokenError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  const normalized = message.toLowerCase();
  return (
    normalized.includes("invalid refresh token") ||
    normalized.includes("refresh token not found")
  );
}

function purgeStoredSupabaseSession() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // localStorage may be unavailable (private mode); nothing to clean up.
  }
}

function installSupabaseAuthConsoleFilter() {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { __sbAuthFilterInstalled?: boolean };
  if (w.__sbAuthFilterInstalled) return;
  w.__sbAuthFilterInstalled = true;

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const text = args
      .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
      .join(" ");
    if (isMissingRefreshTokenError(text)) {
      return;
    }
    originalError(...args);
  };
}

export function useAuthSession() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedAccount | null>(null);

  useEffect(() => {
    installSupabaseAuthConsoleFilter();

    const supabase = createClient();
    let isMounted = true;

    const clearStaleSession = async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // ignore — we are about to wipe local storage anyway
      }
      purgeStoredSupabaseSession();
      if (isMounted) setCurrentUser(null);
    };

    const hydrateSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          if (isMissingRefreshTokenError(error)) {
            await clearStaleSession();
            return;
          }
          throw error;
        }

        setCurrentUser(data.session?.user ? accountFromUser(data.session.user) : null);
      } catch (error) {
        if (isMissingRefreshTokenError(error)) {
          await clearStaleSession();
          return;
        }
        throw error;
      }
    };

    void hydrateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? accountFromUser(session.user) : null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthenticated = useCallback((account: AuthenticatedAccount) => {
    setCurrentUser(account);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    setAuthenticatedUser: handleAuthenticated,
    signOut,
  };
}
