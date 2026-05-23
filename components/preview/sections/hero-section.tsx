import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function HeroSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "hero" }>;
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-bg-elevated px-6 py-10 text-center">
      <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
      {section.subtitle && (
        <p className="mt-2 text-sm text-text-muted">{section.subtitle}</p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <div className="h-9 w-28 rounded-md bg-accent" />
        <div className="h-9 w-28 rounded-md border border-border-subtle" />
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
