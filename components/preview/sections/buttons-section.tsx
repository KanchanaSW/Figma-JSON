import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function ButtonsSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "buttons" }>;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {section.items.map((btn) => (
        <button
          key={btn.label}
          type="button"
          className={
            btn.variant === "secondary"
              ? "rounded-md border border-border-subtle px-4 py-2 text-sm text-text-primary"
              : "rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          }
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export const ButtonsSection = memo(ButtonsSectionComponent);
