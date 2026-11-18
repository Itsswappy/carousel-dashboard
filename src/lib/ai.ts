import { Slide } from "./types";

export interface GenerateInput {
  topic: string;
  designPrompt?: string;
  provider: "openai" | "anthropic" | "groq";
  apiKey: string;
  count?: number;
}

const SYSTEM = `You are a social media carousel content writer. You produce educational carousel slide content as strict JSON.

Output ONLY valid JSON, no markdown fences, no commentary. Shape:
{
  "title": "short carousel title",
  "slides": [
    { "kind": "cover", "label": "EDUCATIONAL SERIES 01", "headline": "...", "sub": "...", "page": "01 / 07", "footerLeft": "SYSTEM 01 - ..." },
    { "kind": "content", "number": "01 / 06", "headline": "...", "yellow": "key insight", "bullets": ["action 1","action 2","action 3"], "page": "02 / 07", "footerLeft": "PROFESSIONAL PUBLISHING - 01" },
    ...
    { "kind": "cta", "number": "06 / 06 + NEXT", "headline": "...", "yellow": "...", "bullets": ["..."], "page": "07 / 07", "footerLeft": "Save for later use" }
  ]
}

Rules:
- Exactly 7 slides: 1 cover + 5 content + 1 cta.
- Headlines framed as outcomes, not topics.
- Bullets written as executable actions.
- Concise, mobile-scanning friendly.
- Keep page numbers sequential 01/07..07/07.
- number field for content: "01 / 06".."05 / 06"; cta "06 / 06 + NEXT".
`;

export async function generateCarousel(input: GenerateInput): Promise<{ title: string; slides: Slide[] }> {
  const { topic, designPrompt, provider, apiKey } = input;
  const userMsg = `Topic: ${topic}\n\nDesign/style context (follow tone): ${designPrompt || "Minimal educational, typography-first."}\n\nGenerate the 7-slide carousel JSON now.`;

  let text = "";
  const isOpenAICompat = provider === "openai" || provider === "groq";
  if (isOpenAICompat) {
    const base = provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1";
    const model = provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: userMsg }],
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`${provider} error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    text = json.choices?.[0]?.message?.content || "";
  } else {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 2000,
        system: SYSTEM,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    text = json.content?.[0]?.text || "";
  }

  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  const slides: Slide[] = (parsed.slides || []).map((s: any) => ({
    kind: s.kind,
    label: s.label,
    number: s.number,
    headline: s.headline,
    sub: s.sub,
    yellow: s.yellow,
    bullets: s.bullets,
    page: s.page,
    footerLeft: s.footerLeft,
  }));
  return { title: parsed.title || topic, slides };
}