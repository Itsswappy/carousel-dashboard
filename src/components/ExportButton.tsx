"use client";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import SlideView from "./SlideView";
import { Slide } from "@/lib/types";

export default function ExportButton({ slides, design }: { slides: Slide[]; design: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleExport() {
    if (!stageRef.current) return;
    setBusy(true);
    setMsg(null);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const nodes = Array.from(stageRef.current.children) as HTMLElement[];
      const zip = new JSZip();
      for (let i = 0; i < nodes.length; i++) {
        const dataUrl = await toPng(nodes[i], {
          pixelRatio: 2.7,
          cacheBust: true,
          backgroundColor: "#ffffff",
        });
        const base64 = dataUrl.split(",")[1];
        zip.file(`carousel-slide-${String(i + 1).padStart(2, "0")}.png`, base64, { base64: true });
        // small delay to let browser breathe
        await new Promise((r) => setTimeout(r, 50));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "carousel-slides.zip");
      setMsg(`Exported ${nodes.length} slides at 1080x1350 -> carousel-slides.zip`);
      setTimeout(() => setMsg(null), 6000);
    } catch (e) {
      console.error(e);
      setMsg("Export failed. Try a modern browser (Chrome/Edge).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onClick={handleExport}
        disabled={busy}
        className="group relative inline-flex items-center gap-2.5 bg-[#111] text-white rounded-full px-7 h-[48px] text-[14px] font-semibold tracking-[-0.01em] hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_0_0_#FFE600]"
      >
        {busy ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        )}
        {busy ? "Exporting..." : "Download All Slides (PNG)"}
      </button>
      {msg && (
        <div className="text-[13px] font-medium bg-[#FFE600] text-[#111] px-3.5 py-2 rounded-full flex items-center gap-1.5 max-w-[360px]">
          {msg}
        </div>
      )}
      {/* offscreen export stage */}
      <div
        ref={stageRef}
        style={{ position: "fixed", left: "-9999px", top: 0, width: 400, height: "auto", pointerEvents: "none", opacity: 1 }}
        aria-hidden
      >
        {slides.map((s, i) => (
          <div key={i} style={{ width: 400, height: 500, marginBottom: 0 }}>
            <SlideView slide={s} index={i} design={design} />
          </div>
        ))}
      </div>
    </div>
  );
}

// file-saver polyfill inline (avoid extra dep)
function saveAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}