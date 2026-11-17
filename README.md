# Carousel Dashboard

Manage, schedule, generate, and export social-media carousel PNGs from one dashboard. Supports multiple accounts, each with its own design + style prompt. Deploy to Vercel for phone access.

## Features
- Accounts (name, design, accent color, design prompt)
- Carousels (title, account, scheduled date, status, 7 slides)
- Content calendar (grouped by date)
- AI slide generation (OpenAI or Anthropic) from a topic
- Manual slide editing (form or JSON)
- PNG export: 1080x1350 per slide, bundled as ZIP, no server needed
- Auth + per-user data via Supabase (or local mode)

## Quick start (local, no Supabase)
```bash
npm install
npm run dev
```
Open http://localhost:3000. Sign in with any email/password (local mode) — data stored in browser localStorage. AI generation requires an API key in Settings.

## Supabase setup (for sync across devices)
1. Create a project at https://supabase.com
2. Run `sql/schema.sql` in the Supabase SQL editor
3. Copy Project URL + anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. `npm run dev`

## Deploy to Vercel
1. Push repo to GitHub
2. Import in Vercel
3. Add the two env vars
4. Deploy

## Notes
- Designs: `minimal` (black/white/yellow) and `bold` (dark). Add more in `src/components/SlideView.tsx` + `src/lib/types.ts` DESIGNS.
- Export uses html-to-image at pixelRatio 2.7 to reach 1080x1350. Fonts loaded via next/font.