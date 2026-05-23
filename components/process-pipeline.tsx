"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import type { AppStatus } from "@/store/app-store";
import { cn } from "@/lib/utils";

const steps = [
  { key: "upload", label: "Upload" },
  { key: "ocr", label: "OCR" },
  { key: "ai", label: "AI" },
  { key: "done", label: "Done" },
] as const;

function stepIndex(status: AppStatus): number {
  switch (status) {
    case "idle":
    case "uploading":
      return 0;
    case "ocr":
      return 1;
    case "ai":
      return 2;
    case "done":
      return 3;
    case "error":
      return -1;
    default:
      return 0;
  }
}

export function ProcessPipeline({ status }: { status: AppStatus }) {
  const current = stepIndex(status);
  const isError = status === "error";

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, i) => {
        const completed = !isError && current > i;
        const active = !isError && current === i && status !== "idle";
        const pending = current < i || (status === "idle" && i > 0);

        return (
          <div key={step.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full items-center">
              {i > 0 && (
                <div
                  className={cn(
                    "absolute right-1/2 h-px w-full -translate-y-1/2",
                    completed ? "bg-accent" : "bg-border-subtle"
                  )}
                />
              )}
              <motion.div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border",
                  completed && "border-accent bg-accent text-white",
                  active && "border-accent bg-bg-elevated",
                  pending && "border-border-subtle bg-bg-surface text-text-muted",
                  isError && i === current && "border-accent"
                )}
                animate={active ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: active ? Infinity : 0, duration: 1.5 }}
              >
                {completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle
                    className={cn(
                      "h-3 w-3",
                      active ? "fill-accent text-accent" : ""
                    )}
                  />
                )}
              </motion.div>
            </div>
            <span
              className={cn(
                "text-xs",
                active || completed ? "text-text-primary" : "text-text-muted"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
