# CoverYourATS — Resume Keyword Optimizer

## Project Overview
AI-powered resume keyword optimization tool with a cyberpunk/hacker-style UI.
Users paste or upload a job posting and resume, get keyword gap analysis with
match scores, AI-powered bullet rewrites, and cover letter generation.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **State**: Zustand (sliced stores)
- **AI Proxy**: Supabase Edge Functions (Deno) → Google Gemini 2.5 Flash
- **Hosting**: GitHub Pages (app) + Supabase (Edge Functions)
- **Parsing**: pdfjs-dist (PDF), mammoth.js (DOCX), compromise.js (NLP)
- **Export**: jsPDF + html2canvas (lazy-loaded), navigator.clipboard API

## Key Commands
- `npm run dev` — Start Vite dev server (http://localhost:5173)
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm test` — Run Vitest tests
- `supabase functions serve --debug` — Run Edge Functions locally
- `supabase functions deploy gemini-proxy` — Deploy Edge Function

## Architecture
- `/src/components/` — React UI components (layout, steps, input, analysis, optimize, export, animations, ui)
- `/src/services/` — Business logic (parsers, keywords, scoring, ai, export)
- `/src/stores/` — Zustand state management (slices per domain)
- `/src/hooks/` — Custom React hooks
- `/src/types/` — TypeScript type definitions
- `/src/config/` — Constants, Supabase config
- `/supabase/functions/` — Edge Functions (gemini-proxy)

## Design System
- Background: #0a0e17 (near-black) with subtle grid
- Primary: #00ffcc (neon cyan)
- Secondary: #39ff14 (neon green)
- Warning: #ff0040 (neon red)
- Fonts: Inter (body/UI), JetBrains Mono (terminal/data)
- Dark cards with neon border glow, glitch text effects, scanning animations

## Important Notes
- GitHub Pages base path: `/CoverYourATS/`
- Gemini API key is a Supabase secret — NEVER in client code
- Supabase URL + anon key come from env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Heavy libs (pdfjs-dist, jsPDF, html2canvas) must be lazy-loaded
- "Copy AI Prompt" fallback is a first-class feature, always available
