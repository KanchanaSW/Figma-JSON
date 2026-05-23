# FigmaJSON

Turn UI screenshots into structured JSON using OCR (Tesseract.js) and AI (Groq vision).

## Setup

```bash
npm install
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS, shadcn-style UI
- Zustand, Framer Motion
- tesseract.js (OCR)
- Groq API (`meta-llama/llama-4-scout-17b-16e-instruct`)

## Deploy (Netlify)

1. Connect repo to Netlify
2. Set `GROQ_API_KEY` in environment variables
3. Build command: `npm run build`
4. Uses `@netlify/plugin-nextjs` (see `netlify.toml`)

OCR requires WASM files bundled with serverless functions — configured in `netlify.toml` and `next.config.ts`.

## Pages

- `/` — Landing
- `/generate` — Upload, process, preview + JSON
- `/history` — Local generation history
