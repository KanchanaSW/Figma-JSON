"use client";

import { motion } from "framer-motion";

export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col gap-3 py-6">
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full bg-accent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ width: "40%" }}
        />
      </div>
      {label && (
        <p className="text-center text-sm text-text-muted">{label}</p>
      )}
    </div>
  );
}
