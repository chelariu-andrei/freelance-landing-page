import * as React from "react";
import { cx } from "../lib/cx";
import { toneClass, type Tone } from "./Badge";

export interface ChipProps {
  children: React.ReactNode;
  /** Default "periwinkle" (audience). blush = trend, mint = positive, white/stone = neutral. */
  tone?: Tone;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  /** Makes the chip a toggle button. */
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

/** Tag chip for audiences, topics and formats. Static label by default; a toggle when onClick is given. */
export function Chip({ children, tone = "periwinkle", icon, size = "md", onClick, selected, className }: ChipProps) {
  const cls = cx(
    "inline-flex items-center gap-2 rounded-pill font-body whitespace-nowrap border-0",
    size === "md" ? "px-4 py-2 text-body-md" : "px-2 py-1 text-caption font-medium",
    toneClass[tone],
    onClick && "ac-focus cursor-pointer transition-transform duration-fast ease-out hover:-translate-y-0.5",
    selected && "ring-2 ring-ink",
    className,
  );
  const inner = (<>{icon && <span className="inline-flex shrink-0" aria-hidden>{icon}</span>}{children}</>);
  return onClick
    ? <button type="button" className={cls} onClick={onClick} aria-pressed={!!selected}>{inner}</button>
    : <span className={cls}>{inner}</span>;
}
