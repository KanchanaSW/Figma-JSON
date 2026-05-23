"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resizeImageFile, validateImageFile } from "@/lib/image-utils";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const imagePreview = useAppStore((s) => s.imagePreview);
  const setImage = useAppStore((s) => s.setImage);
  const clearImage = useAppStore((s) => s.clearImage);

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        setLocalError(validationError);
        toast.error(validationError);
        return;
      }

      setLocalError(null);
      try {
        const { file: resized, preview } = await resizeImageFile(file);
        setImage(resized, preview);
      } catch {
        toast.error("Failed to process image");
      }
    },
    [setImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface"
          >
            <div className="relative aspect-video w-full">
              <Image
                src={imagePreview}
                alt="Upload preview"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3"
              onClick={() => {
                clearImage();
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
              dragOver
                ? "border-accent bg-accent/5"
                : "border-border-subtle bg-bg-surface hover:border-accent/50 hover:bg-bg-elevated/50"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated">
              <ImagePlus className="h-6 w-6 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-medium">Drop screenshot here</p>
              <p className="mt-1 text-sm text-text-muted">
                or click to upload · PNG, JPG, WebP
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {localError && (
        <p className="text-sm text-accent">{localError}</p>
      )}
    </div>
  );
}
