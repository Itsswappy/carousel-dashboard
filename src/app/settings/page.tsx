"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/storage";
import { AppSettings } from "@/lib/types";

export default function SettingsPage() {
  const { user } = useUser();
  const [provider, setProvider] = useState<AppSettings["aiProvider"]>("openai");
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getSettings(user.id).then((s) => {
      if (s) { setProvider(s.aiProvider); setKey(s.aiApiKey); }
    });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await saveSettings(user.id, { userId: user.id, aiProvider: provider, aiApiKey: key });
    setMsg("Saved");
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Settings</h1>
        <form onSubmit={save} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">AI provider</span>
            <select value={provider} onChange={(e) => setProvider(e.target.value as any)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
              <option value="openai">OpenAI (gpt-4o-mini)</option>
              <option value="anthropic">Anthropic (claude-3-5-haiku)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">API key</span>
            <input value={key} onChange={(e) => setKey(e.target.value)} type="password" className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" placeholder="sk-..." />
          </label>
          <p className="text-xs opacity-50">Stored in your database (Supabase) or browser (local mode). Used only for generation. Never shared.</p>
          <button className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80">Save</button>
          {msg && <div className="text-sm text-green-600">{msg}</div>}
        </form>
      </main>
    </Protected>
  );
}