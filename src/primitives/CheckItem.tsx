import * as React from "react";
import { Check } from "lucide-react";
import { cx } from "../lib/cx";

export interface CheckItemProps {
  /** Bold lead-in, e.g. "Live trends". */
  lead?: React.ReactNode;
  /** The rest of the line. */
  children?: React.ReactNode;
  /** ink disc on light grounds · white disc on ink · yellow disc for emphasis. Default "ink". */
  tone?: "ink" | "white" | "yellow";
  /** Not included — shows a hollow disc and muted text. */
  excluded?: boolean;
  size?: "md" | "lg";
  className?: string;
}

/** Checklist line: check disc + bold lead + description. Use inside <ul> (renders an <li>). */
export function CheckItem({ lead, children, tone = "ink", excluded, size = "lg", className }: CheckItemProps) {
  const disc = excluded ? "bg-transparent border-2 border-solid border-line text-transparent" : tone === "ink" ? "bg-ink text-white" : tone === "white" ? "bg-white text-ink" : "bg-yellow text-ink";
  return (
    <li className={cx("flex items-start gap-3 lg:gap-4 list-none font-body", size === "lg" ? "text-body-md lg:text-button-lg lg:leading-[1.45]" : "text-body", excluded && "opacity-60", className)}>
      <span className={cx("inline-flex items-center justify-center rounded-full shrink-0", size === "lg" ? "w-6 h-6 lg:w-8 lg:h-8 mt-0.5" : "w-6 h-6", disc)} aria-hidden>
        <Check size={size === "lg" ? 16 : 14} strokeWidth={3} />
      </span>
      <span>
        {excluded && <span className="sr-only">Not included: </span>}
        {lead && <strong className="font-semibold">{lead}</strong>}
        {lead && children ? " " : ""}
        {children}
      </span>
    </li>
  );
}
