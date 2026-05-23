"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHistory } from "@/hooks/use-history";

export function HistoryList() {
  const { history, openHistoryItem, deleteHistoryItem } = useHistory();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle py-20 text-center">
        <p className="text-lg font-medium">No generations yet</p>
        <p className="mt-2 text-sm text-text-muted">
          Upload a screenshot on the Generate page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {history.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="group overflow-hidden transition-colors hover:border-accent/30">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => openHistoryItem(item.id)}
            >
              <div className="relative aspect-video bg-bg-elevated">
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt="Screenshot thumbnail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <CardContent className="p-4">
                <p className="font-medium capitalize">
                  {item.uiJson.page.type}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {item.uiJson.page.sections.length} sections
                </p>
              </CardContent>
            </button>
            <div className="px-4 pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-text-muted hover:text-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHistoryItem(item.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
