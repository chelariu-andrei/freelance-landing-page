import * as React from "react";
import { cx } from "../lib/cx";

export interface SparklineProps {
  /** Series values; any range, scaled to fit. */
  points: number[];
  width?: number;
  height?: number;
  /** Accessible summary, e.g. "Rising 12% over 30 days". */
  label?: string;
  className?: string;
}

/** Tiny ink trend line in a white pill, as in "Trending Topics". */
export function Sparkline({ points, width = 64, height = 20, label, className }: SparklineProps) {
  if (points.length < 2) return null;
  const min = Math.min(...points), max = Math.max(...points), span = max - min || 1;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${((i / (points.length - 1)) * width).toFixed(1)},${(height - ((p - min) / span) * (height - 2) - 1).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={cx("block text-ink", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
