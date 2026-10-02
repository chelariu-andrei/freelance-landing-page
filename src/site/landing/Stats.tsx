"use client";
import { CornerRightDown } from "lucide-react";
import { StatStatement, type StatPart } from "@/sections/StatStatement";
import { iconFor } from "@/site/icons";
import { content, type StatPart as StatPartContent } from "@/content/content";

const toPart = (p: StatPartContent): StatPart =>
  "text" in p ? { kind: "text", text: p.text } :
  "value" in p ? { kind: "value", text: p.value } :
  { kind: "icon", label: p.label, icon: iconFor(p.icon, 56, 1.75, "w-6 h-6 lg:w-16 lg:h-16") };

export function Stats() {
  return (
    <StatStatement
      rows={content.landing.stats.map((s) => ({
        parts: s.parts.map(toPart),
        bubble: s.arrow ? <CornerRightDown className="w-8 h-8 lg:w-24 lg:h-24" strokeWidth={1.75} /> : undefined,
      }))}
    />
  );
}
