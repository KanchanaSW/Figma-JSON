export type CardItem = {
  title: string;
  value?: string;
  description?: string;
};

export type ButtonItem = {
  label: string;
  variant?: "primary" | "secondary";
};

export type FormField = {
  label: string;
  type?: string;
  placeholder?: string;
};

export type UiSection =
  | { type: "navbar"; items: string[] }
  | { type: "sidebar"; items: string[] }
  | { type: "hero"; title: string; subtitle?: string }
  | {
      type: "card_grid";
      columns: number;
      cards: CardItem[];
    }
  | { type: "list"; items: string[] }
  | { type: "buttons"; items: ButtonItem[] }
  | { type: "form"; fields: FormField[] };

export type UiPage = {
  page: {
    type: string;
    theme: "dark" | "light";
    sections: UiSection[];
  };
};

export type HistoryItem = {
  id: string;
  createdAt: string;
  thumbnail: string;
  ocr: import("./ocr").OcrResult;
  uiJson: UiPage;
};
