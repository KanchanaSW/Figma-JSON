"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import type { HistoryItem } from "@/types/ui-schema";
import type { OcrResult } from "@/types/ocr";
import type { UiPage } from "@/types/ui-schema";

type GenerateResponse = {
  ocr: OcrResult;
  result: UiPage;
  ocrFailed?: boolean;
  error?: string;
  step?: string;
  retryable?: boolean;
};

export function useGenerate() {
  const abortRef = useRef<AbortController | null>(null);
  const imageFile = useAppStore((s) => s.imageFile);
  const imagePreview = useAppStore((s) => s.imagePreview);
  const setStatus = useAppStore((s) => s.setStatus);
  const setError = useAppStore((s) => s.setError);
  const setResult = useAppStore((s) => s.setResult);
  const addToHistory = useAppStore((s) => s.addToHistory);

  const runGenerate = useCallback(
    async (file?: File) => {
      const targetFile = file ?? imageFile;
      if (!targetFile) {
        toast.error("Upload an image first");
        return;
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setStatus("ocr");
      setError(null);

      const formData = new FormData();
      formData.append("file", targetFile);

      try {
        await new Promise((r) => setTimeout(r, 400));
        setStatus("ai");

        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        });

        const data = (await res.json()) as GenerateResponse;

        if (!res.ok) {
          throw new Error(data.error ?? "Generation failed");
        }

        if (data.ocrFailed) {
          toast.warning("OCR unavailable — using vision-only analysis");
        }

        setResult(data.ocr, data.result);

        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          thumbnail: imagePreview ?? "",
          ocr: data.ocr,
          uiJson: data.result,
        };
        addToHistory(historyItem);

        toast.success("JSON generated successfully");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Generation failed";
        setError(message);
        toast.error(message);
      }
    },
    [
      imageFile,
      imagePreview,
      setStatus,
      setError,
      setResult,
      addToHistory,
    ]
  );

  const retry = useCallback(() => {
    void runGenerate();
  }, [runGenerate]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, [setStatus]);

  return { generate: runGenerate, retry, cancel };
}
