import { createBrowserClient } from "@supabase/ssr";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const LS_KEY = "cd_supabase_config";

export function getSupabaseConfig(): SupabaseConfig | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (envUrl && envKey) return { url: envUrl, anonKey: envKey };

  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.url && parsed?.anonKey) return parsed;
  } catch {}
  return null;
}

export function setSupabaseConfig(cfg: SupabaseConfig | null) {
  if (typeof window === "undefined") return;
  if (cfg) localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(LS_KEY);
}

export function createSupabaseBrowserClient() {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  return createBrowserClient(cfg.url, cfg.anonKey);
}

export function isSupabaseConfigured(): boolean {
  return !!getSupabaseConfig();
}