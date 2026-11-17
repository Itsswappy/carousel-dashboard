"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { saveAccount } from "@/lib/storage";
import { Account, DESIGNS, newId } from "@/lib/types";

export default function NewAccount() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [design, setDesign] = useState("minimal");
  const [accent, setAccent] = useState("#FFE600");
  const [prompt, setPrompt] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const acc: Account = {
      id: newId(), name, design, accentColor: accent, prompt, createdAt: new Date().toISOString(),
    };
    await saveAccount(user.id, acc);
    router.push("/accounts");
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">New Account</h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Account name">
            <input value={name} onChange={(e) => setName(e.target.value)} required className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" />
          </Field>
          <Field label="Design">
            <select value={design} onChange={(e) => setDesign(e.target.value)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
              {DESIGNS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Accent color">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-10 w-20" />
          </Field>
          <Field label="Design prompt / style notes (used for AI generation)">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" placeholder="Describe the visual style & tone for this account..." />
          </Field>
          <button className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80">Save Account</button>
        </form>
      </main>
    </Protected>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider opacity-60">{label}</span>
      {children}
    </label>
  );
}