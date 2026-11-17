"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { listCarousels, listAccounts } from "@/lib/storage";
import { Carousel, Account } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setCarousels(await listCarousels(user.id));
      setAccounts(await listAccounts(user.id));
    })();
  }, [user]);

  const upcoming = carousels.filter((c) => c.status !== "done").slice(0, 5);

  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-sm opacity-60">Your carousel content calendar at a glance.</p>
          </div>
          <Link href="/carousels/new" className="bg-black text-white rounded-full px-5 h-10 inline-flex items-center text-sm font-semibold hover:bg-black/80">
            + New Carousel
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Stat label="Carousels" value={carousels.length} />
          <Stat label="Accounts" value={accounts.length} />
          <Stat label="Scheduled" value={carousels.filter((c) => c.status === "scheduled").length} />
          <Stat label="Done" value={carousels.filter((c) => c.status === "done").length} />
        </div>

        <h2 className="text-lg font-bold mb-3">Upcoming</h2>
        {upcoming.length === 0 && <p className="text-sm opacity-50">No upcoming carousels. Create one.</p>}
        <div className="flex flex-col gap-2">
          {upcoming.map((c) => (
            <Link key={c.id} href={`/carousels/${c.id}`} className="border border-black/10 rounded-xl p-4 flex items-center justify-between hover:bg-black/5">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs opacity-50">{c.scheduledDate} · {c.status}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-black/5">{c.slides.length} slides</span>
            </Link>
          ))}
        </div>
      </main>
    </Protected>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-black/10 rounded-xl p-4">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs opacity-50 uppercase tracking-wider">{label}</div>
    </div>
  );
}