import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cx } from "../lib/cx";
import { Button } from "../primitives/Button";
import { Reveal } from "../motion/Reveal";

export interface CtaBannerProps {
  /** One short sentence, e.g. "Three months to prove it." */
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Default label "Let's connect". */
  cta?: { label?: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** yellow (reference) · ink · white. */
  tone?: "yellow" | "ink" | "white";
  /** Show a → icon in the button. Default true. */
  arrow?: boolean;
  className?: string;
}

/** Compact closing banner: one-line heading left, pill button right. Stacks on mobile. */
export function CtaBanner({ title, subtitle, cta = { href: "#contact" }, secondaryCta, tone = "yellow", arrow = true, className }: CtaBannerProps) {
  const ink = tone === "ink";
  const bg = { yellow: "bg-yellow text-ink", ink: "bg-ink text-white ac-dark", white: "bg-white text-ink border border-solid border-line" }[tone];
  const primaryVariant = tone === "yellow" ? "secondary" : ink ? "primary" : "secondary";
  return (
    <section className={cx("bg-cream px-2 lg:px-24 py-8 lg:py-16", className)}>
      <Reveal variant="scale">
        <div className={cx("rounded-lg lg:rounded-xl px-6 md:px-10 lg:px-24 py-10 lg:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8", bg)}>
          <div className="flex flex-col gap-3">
            <h2 className="m-0 font-display font-regular text-heading-xl">{title}</h2>
            {subtitle && <p className={cx("m-0 font-body text-body-md lg:text-button-lg", ink ? "text-muted-on-dark" : "text-ink-muted")}>{subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            {secondaryCta && <Button href={secondaryCta.href} size="lg" variant={ink ? "outline" : "outline-dark"}>{secondaryCta.label}</Button>}
            <Button href={cta.href} size="lg" variant={primaryVariant} iconRight={arrow ? <ArrowRight size={20} strokeWidth={1.75} /> : undefined}>{cta.label ?? "Let's connect"}</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
