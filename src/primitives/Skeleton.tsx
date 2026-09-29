import * as React from "react";
import { cx } from "../lib/cx";

export interface SkeletonProps {
  /** Tailwind size classes, e.g. "h-4 w-32". */
  className?: string;
  shape?: "rect" | "pill" | "circle";
}

/** Loading placeholder with a shimmer (static under reduced motion). */
export function Skeleton({ className, shape = "rect" }: SkeletonProps) {
  return <span aria-hidden className={cx("ac-skeleton block", shape === "pill" && "rounded-pill", shape === "circle" && "rounded-full", className)} />;
}
