"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./supabase";
import { User } from "@supabase/supabase-js";

const LOCAL_USER = { id: "local-user", email: "local@local" } as User;

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sb = createSupabaseBrowserClient();

  useEffect(() => {
    let cancelled = false;

    if (!sb) {
      setUser(LOCAL_USER);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (cancelled) return;
      // Don't hang forever if Supabase is unreachable
      setUser(null);
      setLoading(false);
    }, 8000);

    sb.auth
      .getUser()
      .then(({ data, error }) => {
        if (cancelled) return;
        clearTimeout(timeout);
        if (error) {
          setUser(null);
        } else {
          setUser(data.user ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeout);
        setUser(null);
        setLoading(false);
      });

    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    if (!sb) return { error: null };
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      return { error };
    } catch (e: any) {
      return { error: { message: e?.message || "Sign in failed" } as any };
    }
  }
  async function signUp(email: string, password: string) {
    if (!sb) return { error: null };
    try {
      const { error } = await sb.auth.signUp({ email, password });
      return { error };
    } catch (e: any) {
      return { error: { message: e?.message || "Sign up failed" } as any };
    }
  }
  async function signOut() {
    if (sb) {
      try { await sb.auth.signOut(); } catch {}
    }
    window.location.href = "/login";
  }

  return { user, loading, signIn, signUp, signOut, configured: !!sb };
}