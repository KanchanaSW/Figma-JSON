import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function ListSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "list" }>;
}) {
  return (
    <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle">
      {section.items.map((item) => (
        <li
          key={item}
          className="flex items-center justify-between bg-bg-elevated px-4 py-3 text-sm"
        >
          <span>{item}</span>
          <span className="h-2 w-2 rounded-full bg-border-subtle" />
        </li>
      ))}
    </ul>
  );
}

export const ListSection = memo(ListSectionComponent);
