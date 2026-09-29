import * as React from "react";
import { cx } from "../lib/cx";

export interface MediaPanelProps {
  children: React.ReactNode;
  /** stone = on cream sections (reference) · cream = on yellow sections · none = no backing. */
  surface?: "stone" | "cream" | "none";
  className?: string;
}

/** The big rounded backing panel that frames a product screenshot or widget. */
export function MediaPanel({ children, surface = "stone", className }: MediaPanelProps) {
  return (
    <div className={cx("rounded-xl lg:rounded-2xl p-4 sm:p-8 lg:p-16", surface === "stone" && "bg-stone", surface === "cream" && "bg-cream", className)}>
      {children}
    </div>
  );
}
