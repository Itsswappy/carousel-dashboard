import { createSupabaseBrowserClient, isSupabaseConfigured } from "./supabase";
import { Account, Carousel, AppSettings } from "./types";

const LS = {
  accounts: "cd_accounts",
  carousels: "cd_carousels",
  settings: "cd_settings",
};

function readLS<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function writeLS(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

// ---------- Accounts ----------
export async function listAccounts(userId: string): Promise<Account[]> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { data, error } = await sb.from("accounts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((r: any) => ({
      id: r.id, name: r.name, design: r.design, accentColor: r.accent_color,
      prompt: r.prompt, createdAt: r.created_at,
    }));
  }
  return readLS<Account>(LS.accounts).filter((a: any) => (a as any).userId === userId || true);
}

export async function saveAccount(userId: string, acc: Account): Promise<void> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { error } = await sb.from("accounts").upsert({
      id: acc.id, user_id: userId, name: acc.name, design: acc.design,
      accent_color: acc.accentColor, prompt: acc.prompt, created_at: acc.createdAt,
    });
    if (error) throw error;
    return;
  }
  const all = readLS<any>(LS.accounts);
  const idx = all.findIndex((a: any) => a.id === acc.id);
  const rec = { ...acc, userId };
  if (idx >= 0) all[idx] = rec; else all.unshift(rec);
  writeLS(LS.accounts, all);
}

export async function getAccount(userId: string, id: string): Promise<Account | null> {
  const all = await listAccounts(userId);
  return all.find((a) => a.id === id) || null;
}

export async function deleteAccount(userId: string, id: string): Promise<void> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { error } = await sb.from("accounts").delete().eq("id", id).eq("user_id", userId);
    if (error) throw error;
    return;
  }
  writeLS(LS.accounts, readLS<any>(LS.accounts).filter((a: any) => a.id !== id));
}

// ---------- Carousels ----------
export async function listCarousels(userId: string): Promise<Carousel[]> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { data, error } = await sb.from("carousels").select("*").eq("user_id", userId).order("scheduled_date", { ascending: true });
    if (error) throw error;
    return (data || []).map((r: any) => ({
      id: r.id, accountId: r.account_id, title: r.title, scheduledDate: r.scheduled_date,
      status: r.status, slides: r.slides, createdAt: r.created_at, updatedAt: r.updated_at,
    }));
  }
  return readLS<Carousel>(LS.carousels).filter((c: any) => (c as any).userId === userId || true);
}

export async function getCarousel(userId: string, id: string): Promise<Carousel | null> {
  const all = await listCarousels(userId);
  return all.find((c) => c.id === id) || null;
}

export async function saveCarousel(userId: string, c: Carousel): Promise<void> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { error } = await sb.from("carousels").upsert({
      id: c.id, user_id: userId, account_id: c.accountId, title: c.title,
      scheduled_date: c.scheduledDate, status: c.status, slides: c.slides,
      created_at: c.createdAt, updated_at: c.updatedAt,
    });
    if (error) throw error;
    return;
  }
  const all = readLS<any>(LS.carousels);
  const idx = all.findIndex((x: any) => x.id === c.id);
  const rec = { ...c, userId };
  if (idx >= 0) all[idx] = rec; else all.unshift(rec);
  writeLS(LS.carousels, all);
}

export async function deleteCarousel(userId: string, id: string): Promise<void> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { error } = await sb.from("carousels").delete().eq("id", id).eq("user_id", userId);
    if (error) throw error;
    return;
  }
  writeLS(LS.carousels, readLS<any>(LS.carousels).filter((x: any) => x.id !== id));
}

// ---------- Settings ----------
export async function getSettings(userId: string): Promise<AppSettings | null> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { data, error } = await sb.from("settings").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { userId, aiProvider: data.ai_provider, aiApiKey: data.ai_api_key };
  }
  const all = readLS<any>(LS.settings);
  const rec = all.find((s: any) => s.userId === userId);
  return rec ? { userId, aiProvider: rec.aiProvider, aiApiKey: rec.aiApiKey } : null;
}

export async function saveSettings(userId: string, s: AppSettings): Promise<void> {
  const sb = createSupabaseBrowserClient();
  if (sb && isSupabaseConfigured()) {
    const { error } = await sb.from("settings").upsert({
      user_id: userId, ai_provider: s.aiProvider, ai_api_key: s.aiApiKey,
    });
    if (error) throw error;
    return;
  }
  const all = readLS<any>(LS.settings);
  const idx = all.findIndex((x: any) => x.userId === userId);
  const rec = { userId, aiProvider: s.aiProvider, aiApiKey: s.aiApiKey };
  if (idx >= 0) all[idx] = rec; else all.push(rec);
  writeLS(LS.settings, all);
}