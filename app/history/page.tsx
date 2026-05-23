"use client";

import { motion } from "framer-motion";
import { HistoryList } from "@/components/history/history-list";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-2 text-text-muted">
          Your recent generations, stored locally in this browser.
        </p>
      </motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <HistoryList />
      </motion.div>
    </div>
  );
}
