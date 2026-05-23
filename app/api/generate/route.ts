import { NextResponse } from "next/server";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/schemas";
import { parseUiFromScreenshot } from "@/services/groq-parser";
import { runOcrSafe } from "@/services/ocr";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided", step: "validation", retryable: false },
        { status: 400 }
      );
    }

    if (
      !ALLOWED_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_MIME_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid file type. Use PNG, JPG, or WebP.",
          step: "validation",
          retryable: false,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB.",
          step: "validation",
          retryable: false,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { result: ocr, failed: ocrFailed } = await runOcrSafe(buffer);

    let uiJson;
    try {
      uiJson = await parseUiFromScreenshot(buffer, file.type, ocr);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI processing failed";
      const status = message.includes("GROQ_API_KEY") ? 500 : 502;
      return NextResponse.json(
        { error: message, step: "ai", retryable: true, ocr, ocrFailed },
        { status }
      );
    }

    return NextResponse.json({
      ocr,
      result: uiJson,
      ocrFailed,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json(
      { error: message, step: "ocr", retryable: true },
      { status: 502 }
    );
  }
}
