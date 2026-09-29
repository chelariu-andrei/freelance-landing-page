"use client";
import { StatStatement } from "@/sections/StatStatement";
import { content } from "@/content/content";

export function Stats() {
  return (
    <StatStatement
      rows={content.landing.stats.map((s) => ({ parts: [{ kind: "value" as const, text: s.value }, { kind: "text" as const, text: s.text }] }))}
    />
  );
}
