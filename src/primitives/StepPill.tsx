import * as React from "react";
import { cx } from "../lib/cx";
import { IconCircle } from "./Icon";

export interface StepPillProps {
  /** Label, e.g. "Discover". */
  label: string;
  /** Optional step number disc in front ("01"). */
  number?: string;
  /** Icon shown in a white disc at the end. */
  icon?: React.ReactNode;
  /** lg = section headers (desktop 86px) · md = cards/lists. */
  size?: "md" | "lg";
  /** black = on cream/yellow (reference) · ink = inside white cards. */
  tone?: "black" | "ink";
  as?: "div" | "h2" | "h3" | "span";
  className?: string;
}

/** The black step capsule: [01] [Discover (icon)]. Used as the heading of every methodology step. */
export function StepPill({ label, number, icon, size = "lg", tone = "black", as = "div", className }: StepPillProps) {
  const Comp = as as any;
  const bg = tone === "black" ? "bg-black" : "bg-ink";
  const lg = size === "lg";
  return (
    <Comp className={cx("inline-flex items-center m-0 font-display font-regular text-white", className)}>
      {number && (
        <span className={cx("inline-flex items-center justify-center rounded-full shrink-0", bg, lg ? "w-16 h-16 lg:w-20 lg:h-20 text-label-lg" : "w-12 h-12 text-button")}>
          {number}
        </span>
      )}
      <span className={cx("inline-flex items-center rounded-pill", bg, lg ? "h-16 lg:h-20 pl-6 lg:pl-8 pr-2 gap-5 text-label-lg" : "h-12 pl-5 pr-1 gap-3 text-button")}>
        <span className={cx(!icon && (lg ? "pr-6" : "pr-4"))}>{label}</span>
        {icon && <IconCircle tone="white" size={lg ? "md" : "sm"} className={lg ? "lg:w-16 lg:h-16" : undefined}>{icon}</IconCircle>}
      </span>
    </Comp>
  );
}
