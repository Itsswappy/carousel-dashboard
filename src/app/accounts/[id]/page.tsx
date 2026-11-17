"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { getAccount, saveAccount } from "@/lib/storage";
import { Account, DESIGNS } from "@/lib/types";

export default function EditAccount() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [acc, setAcc] = useState<Account | null>(null);

  useEffect(() => {
    if (!user) return;
    getAccount(user.id, id).then(setAcc);
  }, [user, id]);

  if (!acc) return <Protected><Nav /><main className="p-10">Loading...</main></Protected>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !acc) return;
    await saveAccount(user.id, acc);
    router.push("/accounts");
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Edit Account</h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">Account name</span>
            <input value={acc.name} onChange={(e) => setAcc({ ...acc, name: e.target.value })} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">Design</span>
            <select value={acc.design} onChange={(e) => setAcc({ ...acc, design: e.target.value })} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
              {DESIGNS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">Accent color</span>
            <input type="color" value={acc.accentColor} onChange={(e) => setAcc({ ...acc, accentColor: e.target.value })} className="h-10 w-20" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider opacity-60">Design prompt</span>
            <textarea value={acc.prompt || ""} onChange={(e) => setAcc({ ...acc, prompt: e.target.value })} rows={6} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" />
          </label>
          <button className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80">Save</button>
        </form>
      </main>
    </Protected>
  );
}