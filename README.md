# FigmaJSON

A minimal developer tool that turns UI screenshots into structured JSON. Upload a Figma export or any design screenshot, run OCR + AI layout analysis, and get semantic JSON you can use to mock frontends—with a live preview and local history.

## Features

- **Drag-and-drop upload** — PNG, JPG, WebP (max 10MB), with client-side resize to 1920px width
- **OCR** — [Tesseract.js](https://github.com/naptha/tesseract.js) extracts text and bounding boxes
- **AI layout parsing** — [Groq](https://console.groq.com/) vision (`meta-llama/llama-4-scout-17b-16e-instruct`) infers sections, hierarchy, and components
- **Live preview** — Renders navbar, sidebar, hero, cards, lists, buttons, and forms from JSON
- **JSON panel** — Syntax highlighting, collapsible tree, copy, and download
- **History** — Last 20 generations stored in `localStorage` (no backend)

## Prerequisites

- Node.js 20+
- A [Groq API key](https://console.groq.com/keys)

## Quick start

```bash
npm install
cp .env.example .env.local
```

Add your key to `.env.local`:

```env
GROQ_API_KEY=gsk_...
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), go to **Generate**, upload a screenshot, and click **Generate JSON**.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | Run ESLint               |

## How it works

```text
Screenshot upload
       ↓
POST /api/generate
       ↓
Tesseract.js OCR  →  textBlocks[{ text, x, y, width, height }]
       ↓
Groq vision + OCR context  →  structured UiPage JSON
       ↓
Preview renderer + JSON viewer (+ history saved locally)
```

If OCR fails, the API continues with vision-only analysis and shows a warning toast.

## JSON output shape

```json
{
  "page": {
    "type": "dashboard",
    "theme": "dark",
    "sections": [
      { "type": "navbar", "items": ["Home", "Analytics", "Settings"] },
      {
        "type": "hero",
        "title": "Welcome Back",
        "subtitle": "Manage your dashboard",
        "image_url": ""
      },
      {
        "type": "card_grid",
        "columns": 3,
        "cards": [
          {
            "title": "Revenue",
            "value": "$12,000",
            "icons": [{ "icon_url": "", "text": "vs last month" }]
          },
          { "title": "Users", "value": "1,240" }
        ]
      }
    ]
  }
}
```

Supported section types: `navbar`, `sidebar`, `hero`, `card_grid`, `list`, `buttons`, `form`.

## Pages

| Route       | Description                                      |
|-------------|--------------------------------------------------|
| `/`         | Landing page with feature overview               |
| `/generate` | Upload, pipeline status, preview + JSON output   |
| `/history`  | Browse, reload, or delete past generations       |

## Tech stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling** — Tailwind CSS v4, shadcn-style UI components
- **State** — Zustand
- **Motion** — Framer Motion
- **OCR** — tesseract.js v7
- **AI** — groq-sdk (`meta-llama/llama-4-scout-17b-16e-instruct`, JSON mode)

## Project structure

```text
app/
  api/generate/route.ts   # OCR + Groq pipeline
  generate/page.tsx       # Main tool
  history/page.tsx
  page.tsx                # Landing
components/
  upload/                 # Drag-and-drop zone
  preview/                # JSON → UI renderer
  json/                   # Viewer (raw + tree)
  history/
services/
  ocr.ts                  # Tesseract worker
  groq-parser.ts          # Vision + Zod validation
store/app-store.ts        # Zustand state
lib/                      # Schemas, history, image utils
types/                    # OCR + UI schema types
```

## Deploy on Netlify

1. Push the repo and connect it in the [Netlify dashboard](https://app.netlify.com/).
2. Set the environment variable `GROQ_API_KEY`.
3. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Plugin:** `@netlify/plugin-nextjs` (auto-installed)

OCR depends on Tesseract WASM files bundled into serverless functions. That is configured in `netlify.toml` and `next.config.ts` (`serverExternalPackages`, `outputFileTracingIncludes`).

**Note:** OCR + AI can take 15–30+ seconds on cold start. Netlify function timeout is set to 26s in `netlify.toml`; longer runs may need a paid plan or local use.

## Environment variables

| Variable       | Required | Description        |
|----------------|----------|--------------------|
| `GROQ_API_KEY` | Yes      | Groq API secret key |

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `GROQ_API_KEY is not configured` | Add the key to `.env.local` and restart `npm run dev` |
| `502` after ~60s | Pipeline exceeded route limit; use a smaller image or retry (uploads are resized to 1280px wide) |
| Slow first request | Tesseract worker cold start; wait for OCR step to finish |
| OCR warning toast | Vision-only fallback ran; result may still be useful |
| Netlify `ENOENT` for `.wasm` | Confirm `netlify.toml` `included_files` paths and redeploy |
| Invalid file upload | Use PNG, JPG, or WebP under 10MB |

## License

Private — see repository owner for terms.
