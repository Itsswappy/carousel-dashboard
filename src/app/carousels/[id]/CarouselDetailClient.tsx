"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { getCarousel, saveCarousel, deleteCarousel, listAccounts } from "@/lib/storage";
import { Carousel, Account } from "@/lib/types";
import ExportButton from "@/components/ExportButton";
import SlideView from "@/components/SlideView";

export default function CarouselDetailClient() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [c, setC] = useState<Carousel | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!user) return;
    getCarousel(user.id, id).then(setC);
    listAccounts(user.id).then(setAccounts);
  }, [user, id]);

  if (!c) return <Protected><Nav /><main className="p-10">Loading...</main></Protected>;

  const account = accounts.find((a) => a.id === c.accountId);
  const design = account?.design || "minimal";

  async function updateStatus(status: Carousel["status"]) {
    if (!user || !c) return;
    const updated = { ...c, status, updatedAt: new Date().toISOString() };
    await saveCarousel(user.id, updated);
    setC(updated);
  }

  async function remove() {
    if (!user) return;
    if (!confirm("Delete?")) return;
    await deleteCarousel(user.id, c!.id);
    router.push("/carousels");
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{c.title}</h1>
            <p className="text-sm opacity-60">{c.scheduledDate} · {c.status} · {account?.name} · {design}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ExportButton slides={c.slides} design={design} />
            <button onClick={() => updateStatus("done")} className="text-sm px-3 py-1.5 rounded-full border border-black/15 hover:bg-black hover:text-white">Mark done</button>
            <button onClick={remove} className="text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {c.slides.map((s, i) => (
            <div key={i} className="shrink-0" style={{ width: 280 }}>
              <div className="scale-[0.7] origin-top-left" style={{ width: 400, height: 500, marginBottom: -150 }}>
                <SlideView slide={s} index={i} design={design} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {c.slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${active === i ? "w-6 bg-black" : "w-2 bg-black/20"}`} />
          ))}
        </div>
      </main>
    </Protected>
  );
}