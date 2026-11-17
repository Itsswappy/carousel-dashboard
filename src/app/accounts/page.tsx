"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { listAccounts, deleteAccount } from "@/lib/storage";
import { Account } from "@/lib/types";
import Link from "next/link";

export default function AccountsPage() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<Account[]>([]);
  async function refresh() {
    if (!user) return;
    setAccounts(await listAccounts(user.id));
  }
  useEffect(() => { refresh(); }, [user]);

  async function remove(id: string) {
    if (!user) return;
    if (!confirm("Delete account?")) return;
    await deleteAccount(user.id, id);
    refresh();
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Accounts</h1>
          <Link href="/accounts/new" className="bg-black text-white rounded-full px-5 h-10 inline-flex items-center text-sm font-semibold hover:bg-black/80">
            + New Account
          </Link>
        </div>
        <div className="grid gap-3">
          {accounts.map((a) => (
            <div key={a.id} className="border border-black/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs opacity-50">{a.design} · {a.accentColor}</div>
                {a.prompt && <div className="text-xs opacity-40 mt-1 line-clamp-2 max-w-xl">{a.prompt.slice(0, 120)}</div>}
              </div>
              <div className="flex gap-2">
                <Link href={`/accounts/${a.id}`} className="text-sm px-3 py-1.5 rounded-full border border-black/15 hover:bg-black hover:text-white">Edit</Link>
                <button onClick={() => remove(a.id)} className="text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-sm opacity-50">No accounts yet.</p>}
        </div>
      </main>
    </Protected>
  );
}