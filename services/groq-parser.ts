import Groq from "groq-sdk";
import { uiPageSchema } from "@/lib/schemas";
import type { OcrResult } from "@/types/ocr";
import type { UiPage } from "@/types/ui-schema";

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPT = `You are a UI layout analyst. Given a screenshot and OCR text blocks with positions, output ONLY valid JSON matching this shape:
{
  "page": {
    "type": "dashboard|landing|form|other",
    "theme": "dark|light",
    "sections": [
      { "type": "navbar", "items": ["..."] },
      { "type": "sidebar", "items": ["..."] },
      { "type": "hero", "title": "...", "subtitle": "..." },
      { "type": "card_grid", "columns": 3, "cards": [{ "title": "...", "value": "..." }] },
      { "type": "list", "items": ["..."] },
      { "type": "buttons", "items": [{ "label": "...", "variant": "primary|secondary" }] },
      { "type": "form", "fields": [{ "label": "...", "type": "text", "placeholder": "..." }] }
    ]
  }
}
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
  return new Groq({ apiKey });
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
  return uiPageSchema.parse(parsed);
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
    try {
      const raw = await callGroq(
        client,
        imageDataUrl,
        ocr,
        `${SYSTEM_PROMPT}\n\nYour previous output was invalid JSON. Return ONLY corrected valid JSON, no other text.`
      );
      return parseUiJson(raw);
    } catch {
      throw firstError;
    }
  }
}
