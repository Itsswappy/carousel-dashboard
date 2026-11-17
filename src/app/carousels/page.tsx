"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { listCarousels, deleteCarousel } from "@/lib/storage";
import { Carousel } from "@/lib/types";
import Link from "next/link";

export default function CarouselsPage() {
  const { user } = useUser();
  const [list, setList] = useState<Carousel[]>([]);
  async function refresh() { if (!user) return; setList(await listCarousels(user.id)); }
  useEffect(() => { refresh(); }, [user]);
  async function remove(id: string) {
    if (!user) return;
    if (!confirm("Delete carousel?")) return;
    await deleteCarousel(user.id, id);
    refresh();
  }
  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Carousels</h1>
          <Link href="/carousels/new" className="bg-black text-white rounded-full px-5 h-10 inline-flex items-center text-sm font-semibold hover:bg-black/80">+ New</Link>
        </div>
        <div className="grid gap-3">
          {list.map((c) => (
            <div key={c.id} className="border border-black/10 rounded-xl p-4 flex items-center justify-between">
              <Link href={`/carousels/${c.id}`} className="flex-1">
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs opacity-50">{c.scheduledDate} · {c.status} · {c.slides.length} slides</div>
              </Link>
              <div className="flex gap-2">
                <Link href={`/carousels/${c.id}`} className="text-sm px-3 py-1.5 rounded-full border border-black/15 hover:bg-black hover:text-white">Open</Link>
                <button onClick={() => remove(c.id)} className="text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm opacity-50">No carousels yet.</p>}
        </div>
      </main>
    </Protected>
  );
}