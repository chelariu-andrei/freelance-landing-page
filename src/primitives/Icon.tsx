import * as React from "react";
import { cx } from "../lib/cx";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export const iconPx: Record<IconSize, number> = { xs: 14, sm: 18, md: 24, lg: 32, xl: 48 };

export interface IconProps {
  /** Any lucide-react icon (or compatible component taking size/strokeWidth). */
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  size?: IconSize;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
  className?: string;
}

/** Line icon at a token size, 1.75 stroke — matches the reference's outline icons. */
export function Icon({ icon: I, size = "md", label, className }: IconProps) {
  const svg = <I size={iconPx[size]} strokeWidth={1.75} className={className} aria-hidden />;
  return label ? <span role="img" aria-label={label} className="inline-flex">{svg}</span> : svg;
}

export interface IconCircleProps {
  children: React.ReactNode;
  /** white disc on ink pills · yellow disc in stat lines · ink disc in the CTA · stone for the arrow bubble. */
  tone?: "white" | "yellow" | "ink" | "stone" | "periwinkle" | "mint" | "blush" | "coral";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const circleSize = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-32 h-32" };
const circleTone = { white: "bg-white text-ink", yellow: "bg-yellow text-ink", ink: "bg-ink text-white", stone: "bg-stone text-ink", periwinkle: "bg-periwinkle text-ink", mint: "bg-mint text-ink", blush: "bg-blush text-ink", coral: "bg-coral text-ink" };

/** Icon or numeral centered in a disc. */
export function IconCircle({ children, tone = "white", size = "md", className }: IconCircleProps) {
  return (
    <span className={cx("inline-flex items-center justify-center rounded-full shrink-0", circleSize[size], circleTone[tone], className)}>
      {children}
    </span>
  );
}
