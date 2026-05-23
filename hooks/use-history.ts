"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";

export function useHistory() {
  const router = useRouter();
  const history = useAppStore((s) => s.history);
  const hydrateHistory = useAppStore((s) => s.hydrateHistory);
  const loadFromHistory = useAppStore((s) => s.loadFromHistory);
  const deleteHistoryItem = useAppStore((s) => s.deleteHistoryItem);

  useEffect(() => {
    hydrateHistory();
  }, [hydrateHistory]);

  const openHistoryItem = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (!item) return;
    loadFromHistory(item);
    router.push("/generate");
  };

  return { history, openHistoryItem, deleteHistoryItem };
}
