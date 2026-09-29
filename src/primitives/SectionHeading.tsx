import * as React from "react";
import { cx } from "../lib/cx";

export interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small label above the title. */
  eyebrow?: React.ReactNode;
  /** xl = "See It In Action" (64px) · lg = footer tagline (44px) · display = hero-scale (112px). */
  size?: "lg" | "xl" | "display";
  align?: "left" | "center";
  /** light ground → ink text; dark ground → white title, muted subtitle. */
  tone?: "light" | "dark";
  level?: 1 | 2 | 3;
  className?: string;
}

const titleSize = { lg: "text-heading-lg", xl: "text-heading-xl", display: "text-display-xl" };

/** Title + optional subtitle in the display face. */
export function SectionHeading({ title, subtitle, eyebrow, size = "xl", align = "left", tone = "light", level = 2, className }: SectionHeadingProps) {
  const H = (`h${level}`) as any;
  const dark = tone === "dark";
  return (
    <header className={cx("flex flex-col gap-4 lg:gap-6", align === "center" ? "items-center text-center" : "items-start text-left", className)}>
      {eyebrow && <span className={cx("font-body text-sm font-medium", dark ? "text-muted-on-dark" : "text-ink-muted")}>{eyebrow}</span>}
      <H className={cx("font-display font-regular m-0", titleSize[size], dark ? "text-white" : "text-ink")}>{title}</H>
      {subtitle && <p className={cx("font-body text-body-md lg:text-button-lg lg:leading-[1.4] m-0 max-w-prose", dark ? "text-muted-on-dark" : "text-ink-muted")}>{subtitle}</p>}
    </header>
  );
}
