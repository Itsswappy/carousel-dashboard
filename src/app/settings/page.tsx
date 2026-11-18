"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/storage";
import { AppSettings } from "@/lib/types";
import { getSupabaseConfig, setSupabaseConfig } from "@/lib/supabase";

export default function SettingsPage() {
  const { user } = useUser();
  const [provider, setProvider] = useState<AppSettings["aiProvider"]>("openai");
  const [key, setKey] = useState("");
  const [sbUrl, setSbUrl] = useState("");
  const [sbKey, setSbKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getSettings(user.id).then((s) => {
      if (s) { setProvider(s.aiProvider); setKey(s.aiApiKey); }
    });
    const cfg = getSupabaseConfig();
    if (cfg) { setSbUrl(cfg.url); setSbKey(cfg.anonKey); }
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await saveSettings(user.id, { userId: user.id, aiProvider: provider, aiApiKey: key });
    setSupabaseConfig(sbUrl && sbKey ? { url: sbUrl.trim(), anonKey: sbKey.trim() } : null);
    setMsg("Saved. Reload the page to apply Supabase changes.");
    setTimeout(() => setMsg(null), 4000);
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Settings</h1>
        <form onSubmit={save} className="flex flex-col gap-4">
          <fieldset className="border border-black/10 rounded-xl p-4 flex flex-col gap-3">
            <legend className="text-xs uppercase tracking-wider opacity-60 px-2">Supabase (optional, for sync)</legend>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider opacity-60">Supabase URL</span>
              <input value={sbUrl} onChange={(e) => setSbUrl(e.target.value)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" placeholder="https://xxxx.supabase.co" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider opacity-60">Supabase anon key</span>
              <input value={sbKey} onChange={(e) => setSbKey(e.target.value)} type="password" className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" placeholder="eyJ..." />
            </label>
            <p className="text-xs opacity-50">Leave blank to use local-only mode (data in this browser). Get these from Supabase → Project Settings → API.</p>
          </fieldset>

          <fieldset className="border border-black/10 rounded-xl p-4 flex flex-col gap-3">
            <legend className="text-xs uppercase tracking-wider opacity-60 px-2">AI generation</legend>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider opacity-60">AI provider</span>
              <select value={provider} onChange={(e) => setProvider(e.target.value as any)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
                <option value="groq">Groq (llama-3.3-70b) — fast & free tier</option>
                <option value="openai">OpenAI (gpt-4o-mini)</option>
                <option value="anthropic">Anthropic (claude-3-5-haiku)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider opacity-60">API key</span>
              <input value={key} onChange={(e) => setKey(e.target.value)} type="password" className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" placeholder="sk-..." />
            </label>
          </fieldset>

          <button className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80">Save</button>
          {msg && <div className="text-sm text-green-600">{msg}</div>}
        </form>
      </main>
    </Protected>
  );
}