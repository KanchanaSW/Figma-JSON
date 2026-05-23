import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function CardGridSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "card_grid" }>;
}) {
  const cols = Math.min(Math.max(section.columns, 1), 4);

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {section.cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg border border-border-subtle bg-bg-elevated p-4"
        >
          <p className="text-xs text-text-muted">{card.title}</p>
          {card.value && (
            <p className="mt-1 text-xl font-semibold">{card.value}</p>
          )}
          {card.description && (
            <p className="mt-1 text-xs text-text-muted">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export const CardGridSection = memo(CardGridSectionComponent);
