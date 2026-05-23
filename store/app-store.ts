import { create } from "zustand";
import {
  addHistoryItem,
  loadHistoryFromStorage,
  removeHistoryItem as removeFromStorage,
  saveHistoryToStorage,
} from "@/lib/history";
import type { OcrResult } from "@/types/ocr";
import type { HistoryItem, UiPage } from "@/types/ui-schema";

export type AppStatus =
  | "idle"
  | "uploading"
  | "ocr"
  | "ai"
  | "done"
  | "error";

type AppState = {
  imagePreview: string | null;
  imageFile: File | null;
  ocrResult: OcrResult | null;
  uiJson: UiPage | null;
  status: AppStatus;
  error: string | null;
  history: HistoryItem[];
  setImage: (file: File, preview: string) => void;
  clearImage: () => void;
  setStatus: (status: AppStatus) => void;
  setError: (error: string | null) => void;
  setResult: (ocr: OcrResult, uiJson: UiPage) => void;
  addToHistory: (item: HistoryItem) => void;
  loadFromHistory: (item: HistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  hydrateHistory: () => void;
  clearSession: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  imagePreview: null,
  imageFile: null,
  ocrResult: null,
  uiJson: null,
  status: "idle",
  error: null,
  history: [],

  setImage: (file, preview) =>
    set({
      imageFile: file,
      imagePreview: preview,
      ocrResult: null,
      uiJson: null,
      status: "idle",
      error: null,
    }),

  clearImage: () =>
    set({
      imageFile: null,
      imagePreview: null,
      ocrResult: null,
      uiJson: null,
      status: "idle",
      error: null,
    }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: error ? "error" : "idle" }),

  setResult: (ocr, uiJson) =>
    set({ ocrResult: ocr, uiJson, status: "done", error: null }),

  addToHistory: (item) => {
    const next = addHistoryItem(get().history, item);
    set({ history: next });
  },

  loadFromHistory: (item) =>
    set({
      imagePreview: item.thumbnail,
      imageFile: null,
      ocrResult: item.ocr,
      uiJson: item.uiJson,
      status: "done",
      error: null,
    }),

  deleteHistoryItem: (id) => {
    const next = removeFromStorage(get().history, id);
    set({ history: next });
  },

  hydrateHistory: () => set({ history: loadHistoryFromStorage() }),

  clearSession: () =>
    set({
      ocrResult: null,
      uiJson: null,
      status: "idle",
      error: null,
    }),
}));

export function persistHistory(items: HistoryItem[]) {
  saveHistoryToStorage(items);
}
