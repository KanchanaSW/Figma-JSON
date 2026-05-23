"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Eye, ScanText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: ScanText,
    title: "OCR extraction",
    description:
      "Tesseract.js pulls text and bounding boxes from your screenshot automatically.",
  },
  {
    icon: Code2,
    title: "AI layout parsing",
    description:
      "Groq vision models infer components, sections, and hierarchy into clean JSON.",
  },
  {
    icon: Eye,
    title: "Live preview",
    description:
      "See your structured JSON rendered as a real UI mock before you ship it.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          Developer tool
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Turn screenshots into
          <br />
          structured JSON
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
          Upload any UI screenshot. Get semantic layout JSON powered by OCR and
          AI — ready to build mock frontends.
        </p>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/generate">
              Upload Screenshot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-24 grid gap-6 md:grid-cols-3"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Card className="h-full border-border-subtle transition-colors hover:border-accent/30">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
