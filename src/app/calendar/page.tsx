"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { listCarousels } from "@/lib/storage";
import { Carousel } from "@/lib/types";
import Link from "next/link";

export default function CalendarPage() {
  const { user } = useUser();
  const [list, setList] = useState<Carousel[]>([]);
  useEffect(() => { if (user) listCarousels(user.id).then(setList); }, [user]);

  // group by date
  const byDate: Record<string, Carousel[]> = {};
  list.forEach((c) => {
    (byDate[c.scheduledDate] = byDate[c.scheduledDate] || []).push(c);
  });
  const dates = Object.keys(byDate).sort();

  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Content Calendar</h1>
        {dates.length === 0 && <p className="text-sm opacity-50">No scheduled carousels.</p>}
        <div className="flex flex-col gap-4">
          {dates.map((d) => (
            <div key={d} className="border border-black/10 rounded-xl p-4">
              <div className="font-bold mb-2">{d}</div>
              <div className="flex flex-col gap-2">
                {byDate[d].map((c) => (
                  <Link key={c.id} href={`/carousels/${c.id}`} className="flex items-center justify-between bg-black/5 rounded-lg px-3 py-2 hover:bg-black/10">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-xs opacity-50">{c.status} · {c.slides.length} slides</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </Protected>
  );
}