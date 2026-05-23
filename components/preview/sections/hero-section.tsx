import Image from "next/image";
import { memo } from "react";
import type { UiSection } from "@/types/ui-schema";

function HeroSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "hero" }>;
}) {
  const hasImageSlot = section.image_url !== undefined;

  return (
    <section className="overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated text-center">
      {hasImageSlot && (
        <div className="relative aspect-[2/1] w-full border-b border-border-subtle bg-bg-surface">
          {section.image_url ? (
            <Image
              src={section.image_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-muted">
              image_url
            </div>
          )}
        </div>
      )}
      <div className="px-6 py-10">
        <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
        {section.subtitle && (
          <p className="mt-2 text-sm text-text-muted">{section.subtitle}</p>
        )}
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
