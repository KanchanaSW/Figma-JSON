import Groq from "groq-sdk";
import { ZodError } from "zod";
import { normalizeUiPage } from "@/lib/normalize-ui";
import { uiPageSchema } from "@/lib/schemas";
import type { OcrResult } from "@/types/ocr";
import type { UiPage } from "@/types/ui-schema";

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const GROQ_TIMEOUT_MS = 45_000;

const SYSTEM_PROMPT = `You are a UI layout analyst. Given a screenshot and OCR text blocks with positions, output ONLY valid JSON matching this shape:
{
  "page": {
    "type": "dashboard|landing|form|other",
    "theme": "dark|light",
    "sections": [
      { "type": "navbar", "items": ["..."] },
      { "type": "sidebar", "items": ["..."] },
      {
        "type": "hero",
        "title": "...",
        "subtitle": "...",
        "image_url": ""
      },
      {
        "type": "card_grid",
        "columns": 1,
        "cards": [{
          "title": "...",
          "value": "main description text",
          "icons": [
            { "icon_url": "", "text": "feature line with icon" },
            { "icon_url": "", "text": "another feature line" }
          ],
          "button": {
            "label": "...",
            "variant": "primary",
            "background_color": "",
            "text_color": ""
          }
        }]
      },
      { "type": "list", "items": ["..."] },
      {
        "type": "buttons",
        "items": [{
          "label": "...",
          "variant": "primary|secondary",
          "background_color": "",
          "text_color": ""
        }]
      },
      { "type": "form", "fields": [{ "label": "...", "type": "text", "placeholder": "..." }] }
    ]
  }
}
Rules:
- Include hero "image_url" as "" when a banner/photo/illustration appears above hero text.
- For each card row with small icons beside text, add an "icons" array; each entry needs "icon_url": "" and "text" from OCR.
- When a CTA button sits inside a card, use the card's "button" object (with color fields). Use a separate "buttons" section only for standalone button rows.
- For every visible button, set "background_color" and "text_color" to hex codes you infer (e.g. "#009639", "#FFFFFF") or "" if unsure.
- Asset URLs are not extractable from screenshots: always use "" for image_url and icon_url.
Infer hierarchy and group elements into semantic sections. Use OCR text for labels and values. No markdown, no explanation.`;

function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey, timeout: GROQ_TIMEOUT_MS });
}

function isInvalidJsonOutputError(error: unknown): boolean {
  return error instanceof SyntaxError || error instanceof ZodError;
}

async function callGroq(
  client: Groq,
  imageDataUrl: string,
  ocr: OcrResult,
  systemOverride?: string
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: systemOverride ?? SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageDataUrl },
          },
          {
            type: "text",
            text: `OCR blocks:\n${JSON.stringify(ocr, null, 2)}`,
          },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 4096,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Groq");
  }
  return content;
}

function parseUiJson(raw: string): UiPage {
  const parsed = JSON.parse(raw) as unknown;
  return normalizeUiPage(uiPageSchema.parse(parsed));
}

export async function parseUiFromScreenshot(
  imageBuffer: Buffer,
  mimeType: string,
  ocr: OcrResult
): Promise<UiPage> {
  const client = getGroqClient();
  const imageDataUrl = bufferToDataUrl(imageBuffer, mimeType);

  try {
    const raw = await callGroq(client, imageDataUrl, ocr);
    return parseUiJson(raw);
  } catch (firstError) {
    if (!isInvalidJsonOutputError(firstError)) {
      throw firstError;
    }
    const raw = await callGroq(
      client,
      imageDataUrl,
      ocr,
      `${SYSTEM_PROMPT}\n\nYour previous output was invalid JSON. Return ONLY corrected valid JSON, no other text.`
    );
    return parseUiJson(raw);
  }
}
