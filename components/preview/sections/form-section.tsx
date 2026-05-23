import { memo } from "react";
import { Input } from "@/components/ui/input";
import type { UiSection } from "@/types/ui-schema";

function FormSectionComponent({
  section,
}: {
  section: Extract<UiSection, { type: "form" }>;
}) {
  return (
    <form className="space-y-4 rounded-lg border border-border-subtle bg-bg-elevated p-4">
      {section.fields.map((field) => (
        <div key={field.label} className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            {field.label}
          </label>
          <Input
            type={field.type ?? "text"}
            placeholder={field.placeholder ?? field.label}
            readOnly
          />
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-md bg-accent py-2 text-sm font-medium text-white"
      >
        Submit
      </button>
    </form>
  );
}

export const FormSection = memo(FormSectionComponent);
