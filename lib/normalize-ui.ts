import type { UiPage, UiSection } from "@/types/ui-schema";

function normalizeHero(
  section: Extract<UiSection, { type: "hero" }>
): Extract<UiSection, { type: "hero" }> {
  return { ...section, image_url: section.image_url ?? "" };
}

function normalizeCardGrid(
  section: Extract<UiSection, { type: "card_grid" }>
): Extract<UiSection, { type: "card_grid" }> {
  return {
    ...section,
    cards: section.cards.map((card) => ({
      ...card,
      icons: (card.icons ?? []).map((icon) => ({
        ...icon,
        icon_url: icon.icon_url ?? "",
      })),
      button: card.button
        ? {
            ...card.button,
            background_color: card.button.background_color ?? "",
            text_color: card.button.text_color ?? "",
          }
        : undefined,
    })),
  };
}

function normalizeButtons(
  section: Extract<UiSection, { type: "buttons" }>
): Extract<UiSection, { type: "buttons" }> {
  return {
    ...section,
    items: section.items.map((btn) => ({
      ...btn,
      background_color: btn.background_color ?? "",
      text_color: btn.text_color ?? "",
    })),
  };
}

function normalizeSection(section: UiSection): UiSection {
  switch (section.type) {
    case "hero":
      return normalizeHero(section);
    case "card_grid":
      return normalizeCardGrid(section);
    case "buttons":
      return normalizeButtons(section);
    default:
      return section;
  }
}

export function normalizeUiPage(data: UiPage): UiPage {
  return {
    page: {
      ...data.page,
      sections: data.page.sections.map(normalizeSection),
    },
  };
}
