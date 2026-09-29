import * as React from "react";
import { cx } from "../lib/cx";
import { SectionHeading } from "../primitives/SectionHeading";
import { ArrowCta } from "../primitives/ArrowCta";
import { Reveal } from "../motion/Reveal";

export interface CtaSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** `hoverLabel` is the text the button slides to on hover, e.g. "Ready to join?". */
  cta: { label: string; href: string; hoverLabel?: string };
  /** ink = reference · yellow = alternate. */
  tone?: "ink" | "yellow";
  animated?: boolean;
  className?: string;
}

/** Closing call to action: centered heading, muted subtitle, oversized ArrowCta, in a framed panel. */
export function CtaSection({ title, subtitle, cta, tone = "ink", animated = true, className }: CtaSectionProps) {
  const ink = tone === "ink";
  const body = (
    <div className="flex flex-col items-center gap-10 lg:gap-24">
      <SectionHeading title={title} subtitle={subtitle} align="center" tone={ink ? "dark" : "light"} size="xl" />
      <ArrowCta label={cta.label} hoverLabel={cta.hoverLabel} href={cta.href} hoverTone={ink ? "yellow" : "none"} />
    </div>
  );
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className={cx("rounded-lg lg:rounded-xl px-4 py-16 lg:py-32", ink ? "bg-ink text-white ac-dark" : "bg-yellow text-ink")}>
        {animated ? <Reveal variant="scale">{body}</Reveal> : body}
      </div>
    </section>
  );
}
