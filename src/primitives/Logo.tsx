import * as React from "react";
import { cx } from "../lib/cx";

export interface LogoProps {
  /** Wordmark text. Default "Ac." (placeholder until a real logo is supplied). */
  name?: string;
  /** Replace the wordmark with a real logo image. */
  src?: string;
  size?: "sm" | "md" | "xl";
  /** ink on light grounds, white on dark. */
  tone?: "ink" | "white";
  href?: string;
  className?: string;
}

const sz = { sm: "text-button-lg", md: "text-heading-lg", xl: "text-display-lg" };

/** Placeholder wordmark set in the display face. Swap `src` for the real logo when available. */
export function Logo({ name = "Ac.", src, size = "md", tone = "ink", href, className }: LogoProps) {
  const inner = src
    ? <img src={src} alt={name} className="block h-[1em] w-auto" />
    : <span className="font-display font-medium tracking-[-0.03em] leading-none">{name}</span>;
  const cls = cx("inline-flex items-center no-underline", sz[size], tone === "ink" ? "text-ink" : "text-white", className);
  return href ? <a href={href} className={cx("ac-focus rounded-sm", cls)} aria-label={name}>{inner}</a> : <span className={cls}>{inner}</span>;
}
