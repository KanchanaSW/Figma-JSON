import { memo } from "react";
import type { ButtonItem, UiSection } from "@/types/ui-schema";

function CardButton({ button }: { button: ButtonItem }) {
  const style =
    button.background_color || button.text_color
      ? {
          backgroundColor: button.background_color || undefined,
          color: button.text_color || undefined,
          borderColor: button.background_color || undefined,
        }
      : undefined;

  return (
    <button
      type="button"
      style={style}
      className={
        button.variant === "secondary"
          ? "mt-4 w-full rounded-md border border-border-subtle px-4 py-2 text-sm"
          : "mt-4 w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
      }
    >
      {button.label}
    </button>
  );
}

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
          <p className="font-semibold">{card.title}</p>
          {card.value && (
            <p className="mt-1 text-sm text-text-muted">{card.value}</p>
          )}
          {card.description && (
            <p className="mt-1 text-xs text-text-muted">{card.description}</p>
          )}
          {card.icons && card.icons.length > 0 && (
            <ul className="mt-3 space-y-2">
              {card.icons.map((icon, i) => (
                <li key={`${icon.text ?? i}`} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] text-text-muted">
                    {icon.icon_url ? "◉" : "○"}
                  </span>
                  {icon.text && <span>{icon.text}</span>}
                </li>
              ))}
            </ul>
          )}
          {card.button && <CardButton button={card.button} />}
        </div>
      ))}
    </div>
  );
}

export const CardGridSection = memo(CardGridSectionComponent);
