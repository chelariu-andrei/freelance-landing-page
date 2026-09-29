import * as React from "react";
import { cx } from "../lib/cx";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed";
  /** light grounds use `line`; dark grounds use `line-on-dark`. */
  tone?: "light" | "dark";
  className?: string;
}

/** Hairline rule. Solid for grouping inside cards; dashed for flow/loop connectors. */
export function Divider({ orientation = "horizontal", variant = "solid", tone = "light", className }: DividerProps) {
  const color = tone === "light" ? "border-line" : "border-line-on-dark";
  const style = variant === "dashed" ? "border-dashed" : "border-solid";
  return orientation === "horizontal"
    ? <hr className={cx("w-full m-0 border-0 border-t", style, color, className)} />
    : <span role="separator" aria-orientation="vertical" className={cx("self-stretch border-0 border-l", style, color, className)} />;
}
