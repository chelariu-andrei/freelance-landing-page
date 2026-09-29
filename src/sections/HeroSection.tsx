import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cx } from "../lib/cx";
import { Button } from "../primitives/Button";
import { HighlightText } from "../primitives/HighlightText";
import { Reveal } from "../motion/Reveal";
import { duration as D, ease as E, stagger as S } from "../tokens/motion";

export interface HeroLine {
  /** Plain part of the line. */
  text?: string;
  /** Emphasised part, rendered in yellow. */
  highlight?: string;
}

export interface HeroSectionProps {
  /** Headline as lines; each may end with a yellow highlight. */
  lines: HeroLine[];
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Right-hand/below content: cards, image, stats. */
  aside?: React.ReactNode;
  /** Header rendered inside the frame (use <SiteHeader variant="notch" sticky={false} />). */
  header?: React.ReactNode;
  /** Entrance animation params. */
  entrance?: { duration?: number; delay?: number; stagger?: number; disabled?: boolean };
  className?: string;
}

/** Dark framed hero: huge display headline (line-by-line entrance), subtitle, outline + white CTAs, aside slot. */
export function HeroSection({ lines, subtitle, primaryCta, secondaryCta, aside, header, entrance = {}, className }: HeroSectionProps) {
  const reduce = !!useReducedMotion();
  const dur = entrance.duration ?? D.hero;
  const delay = entrance.delay ?? 0.1;
  const stg = entrance.stagger ?? S.loose;
  const off = entrance.disabled;
  const lineAnim = (i: number) => off ? {} : {
    initial: { opacity: 0, y: reduce ? 0 : "0.4em" },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? D.fast : dur, delay: delay + i * stg, ease: E.out },
  };
  const after = delay + lines.length * stg;
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter pt-2 pb-2", className)}>
      <div className="ac-dark relative bg-ink text-white rounded-lg lg:rounded-xl overflow-hidden">
        {header}
        <div className={cx("px-5 md:px-10 lg:px-16 pb-10 lg:pb-16 flex flex-col gap-10 lg:gap-16", header ? "pt-12 lg:pt-32" : "pt-16 lg:pt-32")}>
          <h1 className="m-0 font-display font-regular text-display-xl">
            {lines.map((l, i) => (
              <motion.span key={i} className="block lg:whitespace-nowrap" {...lineAnim(i)}>
                {l.text}{l.text && l.highlight ? " " : ""}{l.highlight && <HighlightText>{l.highlight}</HighlightText>}
              </motion.span>
            ))}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
            <Reveal immediate delay={off ? 0 : after} className="lg:col-span-5 flex flex-col gap-10 lg:gap-16">
              {subtitle && <p className="m-0 font-body text-body-lg text-white max-w-prose">{subtitle}</p>}
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap gap-4">
                  {primaryCta && <Button href={primaryCta.href} variant="outline" size="lg">{primaryCta.label}</Button>}
                  {secondaryCta && <Button href={secondaryCta.href} variant="light" size="lg">{secondaryCta.label}</Button>}
                </div>
              )}
            </Reveal>
            {aside && <Reveal immediate delay={off ? 0 : after + 0.15} variant="up" className="lg:col-span-7">{aside}</Reveal>}
          </div>
        </div>
      </div>
    </section>
  );
}
