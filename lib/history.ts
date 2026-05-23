import type { HistoryItem } from "@/types/ui-schema";

export const HISTORY_STORAGE_KEY = "figma-json-history";
export const MAX_HISTORY_ITEMS = 20;

export function loadHistoryFromStorage(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryToStorage(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS))
  );
}

export function addHistoryItem(
  items: HistoryItem[],
  item: HistoryItem
): HistoryItem[] {
  const next = [item, ...items.filter((i) => i.id !== item.id)].slice(
    0,
    MAX_HISTORY_ITEMS
  );
  saveHistoryToStorage(next);
  return next;
}

export function removeHistoryItem(
  items: HistoryItem[],
  id: string
): HistoryItem[] {
  const next = items.filter((i) => i.id !== id);
  saveHistoryToStorage(next);
  return next;
}
