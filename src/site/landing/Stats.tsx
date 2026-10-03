"use client";
import { CornerRightDown } from "lucide-react";
import { StatStatement, type StatPart } from "@/sections/StatStatement";
import { iconFor } from "@/site/icons";
import { content, type StatPart as StatPartContent } from "@/content/content";

const toPart = (p: StatPartContent): StatPart =>
  "text" in p ? { kind: "text", text: p.text } :
  "value" in p ? { kind: "value", text: p.value } :
  { kind: "icon", label: p.label, icon: iconFor(p.icon, 56, 1.75, "w-4 h-4 sm:w-6 sm:h-6 lg:w-12 lg:h-12") };

export function Stats() {
  return (
    <StatStatement
      rows={content.landing.stats.map((s) => ({
        parts: s.parts.map(toPart),
        bubble: s.arrow ? <CornerRightDown className="w-6 h-6 sm:w-10 sm:h-10 lg:w-16 lg:h-16" strokeWidth={1.75} /> : undefined,
      }))}
    />
  );
}
