"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Protected from "@/components/Protected";
import { useUser } from "@/lib/auth";
import { listAccounts, saveCarousel } from "@/lib/storage";
import { Account, Carousel, Slide, defaultSlides, newId } from "@/lib/types";
import { generateCarousel } from "@/lib/ai";
import { getSettings } from "@/lib/storage";
import SlideView from "@/components/SlideView";

export default function NewCarousel() {
  const { user } = useUser();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<Carousel["status"]>("draft");
  const [slides, setSlides] = useState<Slide[]>(defaultSlides());
  const [slidesJson, setSlidesJson] = useState(JSON.stringify(defaultSlides(), null, 2));
  const [mode, setMode] = useState<"form" | "json">("form");
  const [topic, setTopic] = useState("");
  const [genBusy, setGenBusy] = useState(false);
  const [genErr, setGenErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listAccounts(user.id).then((a) => {
      setAccounts(a);
      if (a.length) setAccountId(a[0].id);
    });
  }, [user]);

  async function handleGenerate() {
    if (!user || !topic.trim()) return;
    setGenBusy(true);
    setGenErr(null);
    try {
      const settings = await getSettings(user.id);
      const provider = settings?.aiProvider || "openai";
      const apiKey = settings?.aiApiKey || "";
      if (!apiKey) throw new Error("No AI API key set. Go to Settings first.");
      const acc = accounts.find((a) => a.id === accountId);
      const res = await generateCarousel({ topic, designPrompt: acc?.prompt, provider, apiKey });
      setSlides(res.slides);
      setSlidesJson(JSON.stringify(res.slides, null, 2));
      if (!title) setTitle(res.title);
    } catch (e: any) {
      setGenErr(e.message || "Generation failed");
    } finally {
      setGenBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    let finalSlides = slides;
    if (mode === "json") {
      try { finalSlides = JSON.parse(slidesJson); } catch { alert("Invalid JSON"); return; }
    }
    const c: Carousel = {
      id: newId(), accountId, title: title || "Untitled", scheduledDate: date,
      status, slides: finalSlides, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await saveCarousel(user.id, c);
    router.push(`/carousels/${c.id}`);
  }

  return (
    <Protected>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">New Carousel</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" /></Field>
            <Field label="Account">
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Scheduled date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full" /></Field>
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full">
                <option value="draft">draft</option>
                <option value="scheduled">scheduled</option>
                <option value="done">done</option>
              </select>
            </Field>

            <div className="flex gap-2">
              <button type="button" onClick={() => setMode(mode === "form" ? "json" : "form")} className="text-xs px-3 py-1.5 rounded-full border border-black/15">
                {mode === "form" ? "Edit as JSON" : "Edit as form"}
              </button>
            </div>

            {mode === "json" && (
              <Field label="Slides JSON">
                <textarea value={slidesJson} onChange={(e) => setSlidesJson(e.target.value)} rows={18} className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full font-mono" />
              </Field>
            )}

            <button className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80">Save Carousel</button>
          </form>

          <div className="flex flex-col gap-4">
            <div className="border border-black/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Generate with AI</h3>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic, e.g. How to retain what you learn" className="border border-black/15 rounded-lg px-3 py-2 text-sm w-full mb-3" />
              <button onClick={handleGenerate} disabled={genBusy} className="bg-[#FFE600] text-black rounded-full h-10 px-5 font-semibold text-sm hover:bg-[#ffd700] disabled:opacity-60">
                {genBusy ? "Generating..." : "Generate slides"}
              </button>
              {genErr && <div className="text-red-600 text-xs mt-2">{genErr}</div>}
              <p className="text-xs opacity-50 mt-2">Uses API key from Settings. Fills slides (and title).</p>
            </div>

            <div className="border border-black/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Preview</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(mode === "json" ? safeParse(slidesJson) : slides).slice(0, 3).map((s, i) => (
                  <div key={i} className="shrink-0 scale-[0.4] origin-top-left" style={{ width: 400, height: 500, marginRight: -240 }}>
                    <SlidePreview slide={s} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Protected>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1"><span className="text-xs uppercase tracking-wider opacity-60">{label}</span>{children}</label>;
}
function safeParse(j: string) {
  try { return JSON.parse(j); } catch { return []; }
}
function SlidePreview({ slide, index }: { slide: any; index: number }) {
  return <SlideView slide={slide} index={index} />;
}