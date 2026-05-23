import { z } from "zod";

export const textBlockSchema = z.object({
  text: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  confidence: z.number().optional(),
});

export const ocrResultSchema = z.object({
  textBlocks: z.array(textBlockSchema),
});

const cardIconSchema = z.object({
  icon_url: z.string(),
  text: z.string().optional(),
});

const buttonItemSchema = z.object({
  label: z.string(),
  variant: z.enum(["primary", "secondary"]).optional(),
  background_color: z.string().optional(),
  text_color: z.string().optional(),
});

const cardItemSchema = z.object({
  title: z.string(),
  value: z.string().optional(),
  description: z.string().optional(),
  icons: z.array(cardIconSchema).optional(),
  button: buttonItemSchema.optional(),
});

const formFieldSchema = z.object({
  label: z.string(),
  type: z.string().optional(),
  placeholder: z.string().optional(),
});

export const uiSectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("navbar"), items: z.array(z.string()) }),
  z.object({ type: z.literal("sidebar"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("hero"),
    title: z.string(),
    subtitle: z.string().optional(),
    image_url: z.string().optional(),
  }),
  z.object({
    type: z.literal("card_grid"),
    columns: z.number(),
    cards: z.array(cardItemSchema),
  }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("buttons"),
    items: z.array(buttonItemSchema),
  }),
  z.object({
    type: z.literal("form"),
    fields: z.array(formFieldSchema),
  }),
]);

export const uiPageSchema = z.object({
  page: z.object({
    type: z.string(),
    theme: z.enum(["dark", "light"]),
    sections: z.array(uiSectionSchema),
  }),
});

export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
