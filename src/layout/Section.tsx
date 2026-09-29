import * as React from "react";
import { cx } from "../lib/cx";

export type SectionTone = "cream" | "ink" | "yellow" | "white" | "stone";

export interface SectionProps {
  children: React.ReactNode;
  /** Background. ink sections are framed dark panels (hero, CTA, footer). */
  tone?: SectionTone;
  /** framed = rounded panel inset by the 16px frame gutter (reference) · bleed = edge to edge. */
  frame?: "framed" | "bleed";
  /** Vertical padding. */
  padding?: "none" | "sm" | "md" | "lg";
  /** Leave room for a notched header at the top (hero). */
  notched?: boolean;
  id?: string;
  "aria-label"?: string;
  as?: "section" | "div" | "footer" | "header";
  className?: string;
}

const toneClass: Record<SectionTone, string> = {
  cream: "bg-cream text-ink",
  ink: "bg-ink text-white ac-dark",
  yellow: "bg-yellow text-ink",
  white: "bg-white text-ink",
  stone: "bg-stone text-ink",
};
const padClass = { none: "", sm: "py-10 lg:py-16", md: "py-16 lg:py-24", lg: "py-20 lg:py-32" };

/** Section wrapper: background tone, framed-panel geometry and vertical rhythm. */
export function Section({ children, tone = "cream", frame = "framed", padding = "md", notched, id, as = "section", className, ...aria }: SectionProps) {
  const Comp = as as any;
  const framed = frame === "framed";
  const inner = (
    <div className={cx(toneClass[tone], framed && "rounded-lg lg:rounded-xl overflow-hidden", padClass[padding], notched && "pt-0 lg:pt-0", "relative", className)}>
      {children}
    </div>
  );
  return (
    <Comp id={id} {...aria} className={cx(framed && "px-2 lg:px-gutter py-2", "bg-cream")}>
      {inner}
    </Comp>
  );
}
