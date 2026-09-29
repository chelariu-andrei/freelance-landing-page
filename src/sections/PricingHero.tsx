import * as React from "react";
import { cx } from "../lib/cx";
import { Button } from "../primitives/Button";
import { PriceTag, type PriceTagProps } from "../primitives/PriceTag";
import { Reveal } from "../motion/Reveal";

export interface PricingHeroProps {
  /** Big display headline — sentences, each ending with a full stop. */
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Outline pill above the price, e.g. "Subscription model". */
  planLabel?: string;
  price: PriceTagProps;
  cta?: { label: string; href: string };
  /** Header rendered inside the frame (use <SiteHeader variant="notch" notchTone="white" sticky={false} />). */
  header?: React.ReactNode;
  /** Strip at the bottom of the frame, e.g. <PromoBanner />. */
  banner?: React.ReactNode;
  /** Frame colour. Default "cream". */
  tone?: "cream" | "white";
  className?: string;
}

/** Pricing hero: headline + subtitle left, plan label / big price / billing note / CTA right, optional promo strip. */
export function PricingHero({ title, subtitle, planLabel, price, cta, header, banner, tone = "cream", className }: PricingHeroProps) {
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className={cx("relative overflow-hidden rounded-lg lg:rounded-xl", tone === "cream" ? "bg-cream border border-solid border-line" : "bg-white")}>
        {header}
        <div className={cx("mx-auto max-w-container px-5 md:px-10 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end", header ? "pt-10 lg:pt-12" : "pt-16 lg:pt-24", banner ? "pb-12 lg:pb-16" : "pb-16 lg:pb-24")}>
          <Reveal immediate className="lg:col-span-7 flex flex-col gap-8 lg:gap-12">
            <h1 className="m-0 font-display font-regular text-display-xl text-ink">{title}</h1>
            {subtitle && <p className="m-0 font-body text-body-md lg:text-[1.5rem] lg:leading-[1.6] text-ink-muted max-w-prose">{subtitle}</p>}
          </Reveal>
          <Reveal immediate delay={0.2} className="lg:col-span-5 flex flex-col items-start lg:items-end gap-6 lg:gap-8">
            {planLabel && <span className="inline-flex items-center rounded-pill border border-solid border-ink px-6 py-3 font-body text-body-md lg:text-button-lg uppercase tracking-[0.02em] text-ink">{planLabel}</span>}
            <PriceTag {...price} align="left" className={cx("self-start lg:self-end lg:items-end lg:text-right", price.className)} />
            {cta && <Button href={cta.href} size="lg">{cta.label}</Button>}
          </Reveal>
        </div>
        {banner && <div className="px-0 lg:px-12 pb-0">{banner}</div>}
      </div>
    </section>
  );
}
