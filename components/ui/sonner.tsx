"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-bg-surface group-[.toaster]:text-text-primary group-[.toaster]:border-border-subtle",
        description: "group-[.toast]:text-text-muted",
        actionButton: "group-[.toast]:bg-accent group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-bg-elevated",
      },
    }}
    {...props}
  />
);

export { Toaster };
