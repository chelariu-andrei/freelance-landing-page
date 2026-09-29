import * as React from "react";
import { cx } from "../lib/cx";
import { DottedSurface } from "../components/ui/dotted-surface";
import { Button } from "../primitives/Button";
import { HighlightText } from "../primitives/HighlightText";
import { Reveal } from "../motion/Reveal";

export type DottedMode = "light" | "cream" | "dark";

export interface DottedSurfaceSectionProps {
  /** light = white ground, ink dots · cream = cream ground, ink dots · dark = ink ground, light dots. Default "light". */
  mode?: DottedMode;
  eyebrow?: string;
  title?: React.ReactNode;
  /** Emphasised end of the title — yellow text on dark, yellow marker on light. */
  highlight?: string;
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Extra content under the CTAs (cards, logos…). */
  children?: React.ReactNode;
  align?: "center" | "left";
  /** Section height. Default "lg". */
  height?: "sm" | "md" | "lg" | "screen";
  /** Rounded panel inset by the frame gutter (default) or edge to edge. */
  frame?: "framed" | "bleed";

  /* ── Wave parameters ── */
  /** Wave speed multiplier: 0 = frozen, 0.5 = calm, 1 = default, 2 = fast. */
  speed?: number;
  /** Dot size in px. Default 8. */
  dotSize?: number;
  /** Wave height. Default 50. */
  amplitude?: number;
  /** Distance between dots — lower = denser. Default 150. */
  spacing?: number;
  /** Dot opacity 0–1. Default 0.8 (light/cream), 0.7 (dark). */
  opacity?: number;
  /** Override the dot colour (hex). Default follows `mode`. */
  dotColor?: string;
  className?: string;
}

const modes: Record<DottedMode, { bg: string; dot: string; fog: string; text: string; muted: string; opacity: number }> = {
  light: { bg: "bg-white", dot: "#1c1b1f", fog: "#ffffff", text: "text-ink", muted: "text-ink-muted", opacity: 0.8 },
  cream: { bg: "bg-cream", dot: "#1c1b1f", fog: "#f9f6f0", text: "text-ink", muted: "text-ink-muted", opacity: 0.7 },
  dark: { bg: "bg-ink ac-dark", dot: "#e4e1db", fog: "#1c1b1f", text: "text-white", muted: "text-muted-on-dark", opacity: 0.7 },
};
const heights = { sm: "min-h-[360px] lg:min-h-[440px]", md: "min-h-[480px] lg:min-h-[600px]", lg: "min-h-[560px] lg:min-h-[760px]", screen: "min-h-screen" };

/** Standalone section on an animated dot-wave background, in light, cream or dark mode, with tunable waves. */
export function DottedSurfaceSection({
  mode = "light", eyebrow, title, highlight, subtitle, primaryCta, secondaryCta, children, align = "center", height = "lg", frame = "framed",
  speed = 1, dotSize = 8, amplitude = 50, spacing = 150, opacity, dotColor, className,
}: DottedSurfaceSectionProps) {
  const m = modes[mode];
  const dark = mode === "dark";
  const center = align === "center";
  return (
    <section className={cx("bg-cream", frame === "framed" && "px-2 lg:px-gutter py-2", className)}>
      <div className={cx("relative overflow-hidden flex", m.bg, heights[height], frame === "framed" && "rounded-lg lg:rounded-xl", mode !== "dark" && frame === "framed" && "border border-solid border-line")}>
        <DottedSurface contained color={dotColor ?? m.dot} fogColor={m.fog} opacity={opacity ?? m.opacity} size={dotSize} speed={speed} amplitude={amplitude} spacing={spacing} />
        <div className={cx("relative z-10 w-full mx-auto max-w-container px-5 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col justify-center gap-8", center ? "items-center text-center" : "items-start text-left")}>
          <Reveal className={cx("flex flex-col gap-6", center ? "items-center" : "items-start")}>
            {eyebrow && <span className={cx("inline-flex rounded-pill px-4 py-2 text-overline uppercase", dark ? "bg-yellow text-ink" : "bg-yellow text-ink")}>{eyebrow}</span>}
            {(title || highlight) && (
              <h2 className={cx("m-0 font-display font-regular text-display-lg max-w-[16ch]", m.text)}>
                {title}{title && highlight ? " " : ""}{highlight && <HighlightText variant={dark ? "text" : "marker"}>{highlight}</HighlightText>}
              </h2>
            )}
            {subtitle && <p className={cx("m-0 font-body text-body-lg max-w-prose", m.muted)}>{subtitle}</p>}
          </Reveal>
          {(primaryCta || secondaryCta) && (
            <Reveal delay={0.15} className="flex flex-wrap gap-3 justify-center">
              {primaryCta && <Button href={primaryCta.href} size="lg" variant="primary">{primaryCta.label}</Button>}
              {secondaryCta && <Button href={secondaryCta.href} size="lg" variant={dark ? "outline" : "outline-dark"}>{secondaryCta.label}</Button>}
            </Reveal>
          )}
          {children && <Reveal delay={0.25} className="w-full">{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}
