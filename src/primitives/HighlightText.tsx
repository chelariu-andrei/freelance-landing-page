import * as React from "react";
import { cx } from "../lib/cx";

export interface HighlightTextProps {
  children: React.ReactNode;
  /** text = yellow letters (only on ink grounds) · marker = yellow pill behind ink letters (any ground). Default "text". */
  variant?: "text" | "marker";
  className?: string;
}

/**
 * The brand's "gradient text": the reference uses solid yellow for the emphasised words, never a gradient.
 * Yellow text is only legible on ink (13:1); on light grounds use variant="marker".
 */
export function HighlightText({ children, variant = "text", className }: HighlightTextProps) {
  if (variant === "marker") {
    return <span className={cx("inline-block bg-yellow text-ink rounded-pill px-[0.4em] leading-[1.15]", className)}>{children}</span>;
  }
  return <span className={cx("text-yellow", className)}>{children}</span>;
}
