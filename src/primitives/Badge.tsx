import * as React from "react";
import { cx } from "../lib/cx";

export type Tone = "mint" | "yellow" | "periwinkle" | "blush" | "coral" | "stone" | "ink" | "white";

export const toneClass: Record<Tone, string> = {
  mint: "bg-mint text-ink",
  yellow: "bg-yellow text-ink",
  periwinkle: "bg-periwinkle text-ink",
  blush: "bg-blush text-ink",
  coral: "bg-coral text-ink",
  stone: "bg-stone text-ink",
  ink: "bg-ink text-white",
  white: "bg-white text-ink",
};

export interface BadgeProps {
  children: React.ReactNode;
  /** mint = positive/up · yellow = watch/medium · coral = negative · periwinkle/blush = category. Default "mint". */
  tone?: Tone;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

/** Small pill for scores, deltas and status ("+92%", "Awareness"). Always ink text on a pastel. */
export function Badge({ children, tone = "mint", size = "sm", icon, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-pill font-body font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-1 text-micro" : "px-3 py-1 text-body-md",
        toneClass[tone], className,
      )}
    >
      {icon && <span className="inline-flex shrink-0" aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}
