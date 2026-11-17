export type SlideKind = "cover" | "content" | "cta";

export interface Slide {
  id?: string;
  kind: SlideKind;
  label?: string;
  number?: string;
  headline: string;
  sub?: string;
  yellow?: string;
  bullets?: string[];
  page: string;
  footerLeft: string;
}

export interface Account {
  id: string;
  name: string;
  design: string;
  accentColor: string;
  prompt?: string;
  createdAt: string;
}

export interface Carousel {
  id: string;
  accountId: string;
  title: string;
  scheduledDate: string;
  status: "draft" | "scheduled" | "done";
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  userId: string;
  aiProvider: "openai" | "anthropic";
  aiApiKey: string;
}

export const DESIGNS = [
  { id: "minimal", name: "Minimal Educational (black/white/yellow)" },
  { id: "bold", name: "Bold Dark (inverted)" },
] as const;

export type DesignId = (typeof DESIGNS)[number]["id"];

export function newId(): string {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function defaultSlides(): Slide[] {
  return [
    { kind: "cover", label: "EDUCATIONAL SERIES 01", headline: "Your headline here.", sub: "A short subtitle.", page: "01 / 07", footerLeft: "SYSTEM 01" },
    { kind: "content", number: "01 / 06", headline: "First insight headline.", yellow: "Key insight highlight.", bullets: ["Action one.", "Action two.", "Action three."], page: "02 / 07", footerLeft: "PROFESSIONAL PUBLISHING - 01" },
    { kind: "content", number: "02 / 06", headline: "Second insight headline.", yellow: "Key insight highlight.", bullets: ["Action one.", "Action two.", "Action three."], page: "03 / 07", footerLeft: "PROFESSIONAL PUBLISHING - 02" },
    { kind: "content", number: "03 / 06", headline: "Third insight headline.", yellow: "Key insight highlight.", bullets: ["Action one.", "Action two.", "Action three."], page: "04 / 07", footerLeft: "PROFESSIONAL PUBLISHING - 03" },
    { kind: "content", number: "04 / 06", headline: "Fourth insight headline.", yellow: "Key insight highlight.", bullets: ["Action one.", "Action two.", "Action three."], page: "05 / 07", footerLeft: "PROFESSIONAL PUBLISHING - 04" },
    { kind: "content", number: "05 / 06", headline: "Fifth insight headline.", yellow: "Key insight highlight.", bullets: ["Action one.", "Action two.", "Action three."], page: "06 / 07", footerLeft: "PROFESSIONAL PUBLISHING - 05" },
    { kind: "cta", number: "06 / 06 + NEXT", headline: "Closing call to action.", yellow: "Small system, repeated daily.", bullets: ["Pick one action.", "Schedule it.", "Share with someone."], page: "07 / 07", footerLeft: "Save for later use" },
  ];
}