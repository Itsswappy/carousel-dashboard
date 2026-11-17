import { Slide } from "@/lib/types";

export default function SlideView({ slide, index, design = "minimal" }: { slide: Slide; index: number; design?: string }) {
  const isCover = slide.kind === "cover";
  const isCta = slide.kind === "cta";
  const dark = design === "bold";

  const bg = dark ? "bg-[#111] text-white" : "bg-white text-[#111]";
  const border = dark ? "border-white/20" : "border-[#111]";
  const muted = dark ? "opacity-60" : "opacity-50";
  const yellow = "#FFE600";

  return (
    <div
      className={`relative w-full h-full ${bg} border-[1.5px] ${border} flex flex-col justify-between overflow-hidden select-none`}
      style={{ padding: "48px 40px", width: 400, height: 500 }}
    >
      <div>
        <div className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${muted} mb-10`}>
          {isCover ? slide.label : slide.number}
        </div>
        <h2
          className={`font-extrabold leading-[0.92] tracking-[-0.03em] text-left ${isCover ? "text-[30px] max-w-[95%]" : "text-[28px] max-w-[92%]"}`}
          style={{ lineHeight: 0.95 }}
        >
          {slide.headline}
        </h2>
        {isCover && slide.sub && (
          <>
            <div className={`w-full h-px ${dark ? "bg-white" : "bg-[#111]"} my-6`} />
            <p className={`text-[16px] leading-[1.35] opacity-70 max-w-[80%] text-left`}>{slide.sub}</p>
          </>
        )}
        {!isCover && slide.yellow && (
          <div
            className="inline-block text-[#111] text-[13px] font-bold leading-[1.2] px-[10px] py-[6px] mt-6 max-w-[90%] text-left"
            style={{ backgroundColor: yellow }}
          >
            {slide.yellow}
          </div>
        )}
        {!isCover && slide.bullets && (
          <ul className="mt-7 flex flex-col gap-[18px]">
            {slide.bullets.map((b, i) => (
              <li key={i} className="text-[14.5px] font-medium leading-[1.32] flex gap-2.5 text-left">
                <span className="font-bold shrink-0">→</span>
                <span>{b.replace(/^→\s?/, "")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <div className={`w-full h-px ${dark ? "bg-white" : "bg-[#111]"} mt-8 mb-3.5`} />
        <div className="flex justify-between items-center">
          <span className={`text-[10px] tracking-[0.12em] uppercase opacity-40 font-medium max-w-[60%] truncate`}>
            {slide.footerLeft}
          </span>
          <span className="text-[10px] tracking-[0.12em] uppercase opacity-40">{slide.page}</span>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-2 -bottom-1 text-[120px] font-[800] leading-none opacity-[0.02] select-none">
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}