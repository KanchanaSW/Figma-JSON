"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ProcessPipeline } from "@/components/process-pipeline";
import { UploadZone } from "@/components/upload/upload-zone";
import { useGenerate } from "@/hooks/use-generate";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const JsonViewer = dynamic(
  () =>
    import("@/components/json/json-viewer").then((m) => ({
      default: m.JsonViewer,
    })),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl bg-bg-surface" />
    ),
    ssr: false,
  }
);

const PreviewRenderer = dynamic(
  () =>
    import("@/components/preview/preview-renderer").then((m) => ({
      default: m.PreviewRenderer,
    })),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl bg-bg-surface" />
    ),
    ssr: false,
  }
);

export default function GeneratePage() {
  const [outputTab, setOutputTab] = useState<"preview" | "json">("preview");
  const imageFile = useAppStore((s) => s.imageFile);
  const uiJson = useAppStore((s) => s.uiJson);
  const status = useAppStore((s) => s.status);
  const error = useAppStore((s) => s.error);
  const { generate, retry } = useGenerate();

  const isLoading = status === "ocr" || status === "ai";
  const hasResult = status === "done" && uiJson;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generate JSON</h1>
        <p className="mt-2 text-text-muted">
          Upload a UI screenshot and get structured layout JSON in seconds.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          <UploadZone />
          <ProcessPipeline status={status} />

          {isLoading && (
            <LoadingState
              label={
                status === "ocr"
                  ? "Running OCR — extracting text blocks…"
                  : "Analyzing layout with AI…"
              }
            />
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              size="lg"
              disabled={!imageFile || isLoading}
              onClick={() => void generate()}
            >
              <Sparkles className="h-4 w-4" />
              Generate JSON
            </Button>
            {status === "error" && (
              <Button variant="secondary" size="lg" onClick={retry}>
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>

          {error && (
            <p className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
              {error}
            </p>
          )}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {hasResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-1 rounded-lg bg-bg-surface p-1">
                  {(["preview", "json"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setOutputTab(tab)}
                      className={cn(
                        "flex-1 rounded-md px-4 py-2 text-sm capitalize transition-colors",
                        outputTab === tab
                          ? "bg-accent text-white"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {outputTab === "preview" ? (
                  <PreviewRenderer data={uiJson} />
                ) : (
                  <JsonViewer data={uiJson} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface/50 p-8 text-center"
              >
                <p className="text-lg font-medium">Output will appear here</p>
                <p className="mt-2 max-w-sm text-sm text-text-muted">
                  Upload a screenshot and click Generate to see the live preview
                  and JSON side by side.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
