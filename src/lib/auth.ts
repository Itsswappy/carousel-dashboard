"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./supabase";
import { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sb = createSupabaseBrowserClient();

  useEffect(() => {
    if (!sb) {
      // fallback: fake local user
      setUser({ id: "local-user", email: "local@local" } as any);
      setLoading(false);
      return;
    }
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    if (!sb) return { error: null };
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return { error };
  }
  async function signUp(email: string, password: string) {
    if (!sb) return { error: null };
    const { error } = await sb.auth.signUp({ email, password });
    return { error };
  }
  async function signOut() {
    if (sb) await sb.auth.signOut();
    window.location.href = "/login";
  }

  return { user, loading, signIn, signUp, signOut, configured: !!sb };
}