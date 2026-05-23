"use client";

import { memo } from "react";
import type { UiPage, UiSection } from "@/types/ui-schema";
import { NavbarSection } from "./sections/navbar-section";
import { SidebarSection } from "./sections/sidebar-section";
import { HeroSection } from "./sections/hero-section";
import { CardGridSection } from "./sections/card-grid-section";
import { ListSection } from "./sections/list-section";
import { ButtonsSection } from "./sections/buttons-section";
import { FormSection } from "./sections/form-section";

function SectionBlock({ section }: { section: UiSection }) {
  switch (section.type) {
    case "navbar":
      return <NavbarSection section={section} />;
    case "sidebar":
      return <SidebarSection section={section} />;
    case "hero":
      return <HeroSection section={section} />;
    case "card_grid":
      return <CardGridSection section={section} />;
    case "list":
      return <ListSection section={section} />;
    case "buttons":
      return <ButtonsSection section={section} />;
    case "form":
      return <FormSection section={section} />;
    default:
      return null;
  }
}

function PreviewRendererComponent({ data }: { data: UiPage }) {
  const { page } = data;
  const isLight = page.theme === "light";

  return (
    <div
      className={`space-y-4 rounded-xl border border-border-subtle p-4 ${
        isLight ? "bg-white text-neutral-900" : "bg-bg-surface"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <span className="text-xs uppercase tracking-wider text-text-muted">
          {page.type} · {page.theme}
        </span>
        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
          Live preview
        </span>
      </div>
      <div className="space-y-4">
        {page.sections.map((section, i) => (
          <SectionBlock key={`${section.type}-${i}`} section={section} />
        ))}
      </div>
    </div>
  );
}

export const PreviewRenderer = memo(PreviewRendererComponent);
