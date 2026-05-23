import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function NavbarSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "navbar" }>;
}) {
  return (
    <nav className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
      <span className="text-sm font-semibold text-accent">App</span>
      <ul className="flex flex-wrap gap-4">
        {section.items.map((item, i) => (
          <li
            key={item}
            className={
              i === 0
                ? "text-sm font-medium text-accent"
                : "text-sm text-text-muted"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const NavbarSection = memo(NavbarSectionComponent);
