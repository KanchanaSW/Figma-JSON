"use client";

import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, ChevronDown, ChevronRight, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type JsonViewerProps = {
  data: unknown;
};

function JsonTreeNode({
  label,
  value,
  depth = 0,
}: {
  label: string;
  value: unknown;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const entries = isObject
    ? isArray
      ? (value as unknown[]).map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>)
    : [];

  if (!isObject) {
    return (
      <div className="flex gap-2 py-0.5 pl-4 font-mono text-xs" style={{ paddingLeft: depth * 12 + 16 }}>
        <span className="text-text-muted">{label}:</span>
        <span className="text-accent">{JSON.stringify(value)}</span>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 py-0.5 font-mono text-xs text-text-primary hover:text-accent"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="text-text-muted">{label}</span>
        <span className="text-text-muted">
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </button>
      {open &&
        entries.map(([k, v]) => (
          <JsonTreeNode key={k} label={k} value={v} depth={depth + 1} />
        ))}
    </div>
  );
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"raw" | "tree">("raw");
  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const copy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ui-structure-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded");
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex gap-1 rounded-md bg-bg-elevated p-0.5">
          {(["raw", "tree"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded px-3 py-1 text-xs capitalize transition-colors",
                view === v
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={download}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[min(520px,60vh)] flex-1">
        {view === "raw" ? (
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.8rem",
            }}
          >
            {jsonString}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4">
            <JsonTreeNode label="root" value={data} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
