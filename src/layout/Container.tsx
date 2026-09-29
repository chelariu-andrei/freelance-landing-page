import * as React from "react";
import { cx } from "../lib/cx";

export interface ContainerProps {
  children: React.ReactNode;
  /** content = 1440px · wide = 1760px (full-bleed frames) · full = no cap. */
  width?: "content" | "wide" | "full";
  /** Side padding. Default true (20px mobile → 64px desktop). */
  padded?: boolean;
  as?: "div" | "section" | "main" | "header" | "footer" | "nav";
  className?: string;
}

/** Centered max-width wrapper. */
export function Container({ children, width = "content", padded = true, as = "div", className }: ContainerProps) {
  const Comp = as as any;
  return (
    <Comp className={cx("mx-auto w-full", width === "content" && "max-w-container", width === "wide" && "max-w-wide", padded && "px-5 md:px-10 lg:px-16", className)}>
      {children}
    </Comp>
  );
}

export interface GridProps {
  children: React.ReactNode;
  /** Columns at desktop; always 1 on mobile, 2 from md when cols ≥ 2. */
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  /** Vertical alignment of cells. */
  align?: "start" | "center" | "stretch";
  className?: string;
}

const colClass = { 1: "grid-cols-1", 2: "grid-cols-1 lg:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" };
const gapClass = { sm: "gap-3", md: "gap-4 lg:gap-6", lg: "gap-8 lg:gap-16" };
const alignClass = { start: "items-start", center: "items-center", stretch: "items-stretch" };

/** Mobile-first responsive grid. */
export function Grid({ children, cols = 2, gap = "md", align = "stretch", className }: GridProps) {
  return <div className={cx("grid", colClass[cols], gapClass[gap], alignClass[align], className)}>{children}</div>;
}
