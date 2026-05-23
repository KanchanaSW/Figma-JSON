import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function SidebarSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "sidebar" }>;
}) {
  return (
    <div className="flex gap-3 overflow-hidden rounded-lg border border-border-subtle">
      <aside className="w-36 shrink-0 bg-bg-elevated p-3">
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li
              key={item}
              className={`rounded px-2 py-1.5 text-xs ${
                i === 0
                  ? "bg-accent/20 font-medium text-accent"
                  : "text-text-muted"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-bg-elevated" />
        <div className="h-3 w-1/2 rounded bg-bg-elevated" />
        <div className="h-16 rounded bg-bg-elevated" />
      </div>
    </div>
  );
}

export const SidebarSection = memo(SidebarSectionComponent);
