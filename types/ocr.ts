export type TextBlock = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: number;
};

export type OcrResult = {
  textBlocks: TextBlock[];
};
