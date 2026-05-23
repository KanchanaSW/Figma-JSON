import path from "path";
import { createWorker } from "tesseract.js";
import type { OcrResult, TextBlock } from "@/types/ocr";

const MIN_CONFIDENCE = 30;

function bboxToBlock(
  text: string,
  bbox: { x0: number; y0: number; x1: number; y1: number },
  confidence?: number
): TextBlock {
  return {
    text: text.trim(),
    x: bbox.x0,
    y: bbox.y0,
    width: bbox.x1 - bbox.x0,
    height: bbox.y1 - bbox.y0,
    confidence,
  };
}

function extractBlocksFromOcrData(data: {
  blocks?: Array<{
    paragraphs?: Array<{
      lines?: Array<{
        words?: Array<{
          text: string;
          confidence: number;
          bbox: { x0: number; y0: number; x1: number; y1: number };
        }>;
      }>;
    }>;
  }>;
}): TextBlock[] {
  const blocks: TextBlock[] = [];

  for (const block of data.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const line of paragraph.lines ?? []) {
        for (const word of line.words ?? []) {
          if (!word.text?.trim()) continue;
          if (word.confidence < MIN_CONFIDENCE) continue;
          blocks.push(
            bboxToBlock(word.text, word.bbox, word.confidence)
          );
        }
      }
    }
  }

  return blocks;
}

export async function runOcr(imageBuffer: Buffer): Promise<OcrResult> {
  const workerPath = path.join(
    process.cwd(),
    "node_modules/tesseract.js/src/worker-script/node/index.js"
  );

  const worker = await createWorker("eng", 1, {
    workerPath,
  });

  try {
    const { data } = await worker.recognize(imageBuffer, {}, { blocks: true });
    const textBlocks = extractBlocksFromOcrData(
      data as Parameters<typeof extractBlocksFromOcrData>[0]
    );
    return { textBlocks };
  } finally {
    await worker.terminate();
  }
}

export async function runOcrSafe(imageBuffer: Buffer): Promise<{
  result: OcrResult;
  failed: boolean;
}> {
  try {
    const result = await runOcr(imageBuffer);
    return { result, failed: false };
  } catch {
    return { result: { textBlocks: [] }, failed: true };
  }
}
