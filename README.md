# FigmaJSON

A minimal developer tool that turns UI screenshots into structured JSON. Upload a Figma export or any design screenshot, run OCR + AI layout analysis, and get semantic JSON you can use to mock frontends—with a live preview and local history.

## Features

- **Drag-and-drop upload** — PNG, JPG, WebP (max 10MB), with client-side resize to 1280px width
- **OCR** — [Tesseract.js](https://github.com/naptha/tesseract.js) extracts text and bounding boxes (25s server timeout; falls back to vision-only)
- **AI layout parsing** — [Groq](https://console.groq.com/) vision (`meta-llama/llama-4-scout-17b-16e-instruct`) infers sections, hierarchy, assets placeholders, and button colors
- **Live preview** — Renders navbar, sidebar, hero (with image slot), cards (icons + in-card CTAs), lists, buttons, and forms from JSON
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

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build       |
| `npm run start` | Serve production build   |
| `npm run lint`  | Run ESLint               |

## How it works

```text
Screenshot upload (resized client-side)
       ↓
POST /api/generate  (max 120s)
       ↓
Tesseract.js OCR  →  textBlocks[{ text, x, y, width, height }]
       ↓  (timeout or failure → empty OCR, vision-only)
Groq vision + OCR context  →  structured UiPage JSON
       ↓
Zod validation + normalize (empty asset URLs, default colors)
       ↓
Preview renderer + JSON viewer (+ history saved locally)
```

If OCR fails or times out, the API continues with vision-only analysis and shows a warning toast.

## JSON output shape

Top-level shape:

```json
{
  "page": {
    "type": "dashboard | landing | form | other",
    "theme": "dark | light",
    "sections": [ /* see section types below */ ]
  }
}
```

### Section types

| `type`       | Purpose |
|--------------|---------|
| `navbar`     | Top navigation labels |
| `sidebar`    | Side navigation labels |
| `hero`       | Banner area + headline |
| `card_grid`  | One or more content cards |
| `list`       | Bulleted or stacked text rows |
| `buttons`    | Standalone button row (when CTAs are not inside cards) |
| `form`       | Input fields |

### Asset placeholders

Screenshots do not yield real CDN URLs. The model emits **empty strings** for assets you fill in later:

| Field           | Where        | Description |
|-----------------|--------------|-------------|
| `image_url`     | `hero`       | Hero / banner image |
| `icon_url`      | `card.icons[]` | Small icon beside feature text |
| `background_color` | `button`, `card.button` | Hex fill (e.g. `#009639`) or `""` |
| `text_color`    | `button`, `card.button` | Hex label color (e.g. `#FFFFFF`) or `""` |

### Example (mobile landing)

```json
{
  "page": {
    "type": "landing",
    "theme": "light",
    "sections": [
      {
        "type": "hero",
        "title": "Welcome to eSIM",
        "subtitle": "With the Smart eSIM, you never have to worry about losing or breaking your SIM card!",
        "image_url": ""
      },
      {
        "type": "card_grid",
        "columns": 1,
        "cards": [
          {
            "title": "Buy New eSIM",
            "value": "Check available numbers, buy your favorite one online and activate it on an eSIM.",
            "icons": [
              { "icon_url": "", "text": "Starts from 8 USD" },
              { "icon_url": "", "text": "Only takes 5 minutes" }
            ],
            "button": {
              "label": "Buy now",
              "variant": "primary",
              "background_color": "#009639",
              "text_color": "#FFFFFF"
            }
          },
          {
            "title": "My eSIM QR Code",
            "value": "View your eSIM QR code and easily set up your eSIM on your device.",
            "icons": [
              { "icon_url": "", "text": "Activate your eSIM for free" },
              { "icon_url": "", "text": "Instant eSIM activation" }
            ],
            "button": {
              "label": "View eSIM QR code",
              "variant": "primary",
              "background_color": "#009639",
              "text_color": "#FFFFFF"
            }
          }
        ]
      }
    ]
  }
}
```

When a CTA sits **inside** a card, use `card.button`. Use a separate `buttons` section only for standalone button rows:

```json
{
  "type": "buttons",
  "items": [
    {
      "label": "Get started",
      "variant": "primary",
      "background_color": "",
      "text_color": ""
    }
  ]
}
```

Schema definitions live in `lib/schemas.ts` and `types/ui-schema.ts`. Post-parse normalization is in `lib/normalize-ui.ts`.

## Pages

| Route       | Description                                    |
|-------------|------------------------------------------------|
| `/`         | Landing page with feature overview             |
| `/generate` | Upload, pipeline status, preview + JSON output |
| `/history`  | Browse, reload, or delete past generations     |

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
  api/generate/route.ts   # OCR + Groq pipeline (maxDuration 120s)
  generate/page.tsx       # Main tool
  history/page.tsx
  page.tsx                # Landing
components/
  upload/                 # Drag-and-drop zone
  preview/                # JSON → UI renderer
  json/                   # Viewer (raw + tree)
  history/
services/
  ocr.ts                  # Tesseract worker (25s timeout)
  groq-parser.ts          # Vision + Zod + normalize
store/app-store.ts        # Zustand state
lib/
  schemas.ts              # Zod validation
  normalize-ui.ts         # Default "" for asset URLs and colors
  history.ts
  image-utils.ts          # Client resize (1280px max width)
types/                    # OCR + UI schema types
```

## Deploy on Netlify

1. Push the repo and connect it in the [Netlify dashboard](https://app.netlify.com/).
2. Set the environment variable `GROQ_API_KEY`.
3. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Plugin:** `@netlify/plugin-nextjs` (auto-installed)

OCR depends on Tesseract WASM files bundled into serverless functions. That is configured in `netlify.toml` and `next.config.ts` (`serverExternalPackages`, `outputFileTracingIncludes`).

**Note:** OCR + AI can take 15–60+ seconds on cold start. The API route allows up to **120s** locally; Netlify function timeout is **26s** in `netlify.toml`, so production runs may time out unless you raise limits on a paid plan or run the tool locally.

## Environment variables

| Variable       | Required | Description           |
|----------------|----------|-----------------------|
| `GROQ_API_KEY` | Yes      | Groq API secret key   |

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `GROQ_API_KEY is not configured` | Add the key to `.env.local` and restart `npm run dev` |
| `502` / slow failure after ~60–120s | Use a smaller screenshot or retry; pipeline is capped at 120s (OCR 25s + Groq 45s per call) |
| `504` / AI timed out | Groq request exceeded 45s; retry or use a smaller image |
| Slow first request | Tesseract worker cold start; wait for OCR step to finish |
| OCR warning toast | Vision-only fallback ran; result may still be useful |
| Missing `image_url` / `icons` in JSON | Re-generate after pulling latest; older history items use the previous shape |
| Netlify `ENOENT` for `.wasm` | Confirm `netlify.toml` `included_files` paths and redeploy |
| Invalid file upload | Use PNG, JPG, or WebP under 10MB |

## License

Private — see repository owner for terms.
