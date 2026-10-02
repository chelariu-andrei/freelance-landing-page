import * as React from "react";
import { cx } from "../lib/cx";
import { StepPill } from "../primitives/StepPill";
import { Reveal } from "../motion/Reveal";

export interface FeatureStepProps {
  /** "01" */
  number?: string;
  /** "Discover" */
  label: string;
  icon?: React.ReactNode;
  body: React.ReactNode;
  /** Widget / screenshot. Wrap in <MediaPanel> on cream. */
  media?: React.ReactNode;
  /** cream = Discover (media right) · yellow = Create (framed yellow panel, media left). */
  tone?: "cream" | "yellow";
  /** Which side the media sits on at desktop. Default: right on cream, left on yellow. Always below text on mobile. */
  mediaSide?: "left" | "right";
  /** Scroll-reveal. Default true. */
  animated?: boolean;
  /** Anchor id for in-page links. */
  id?: string;
  className?: string;
}

/** One methodology step: StepPill heading, lead paragraph, media. */
export function FeatureStep({ number, label, icon, body, media, tone = "cream", mediaSide, animated = true, id, className }: FeatureStepProps) {
  const side = mediaSide ?? (tone === "yellow" ? "left" : "right");
  const yellow = tone === "yellow";
  const Wrap = ({ children, d = 0, v = "up" as const }: { children: React.ReactNode; d?: number; v?: "up" | "left" | "right" }) =>
    animated ? <Reveal delay={d} variant={v}>{children}</Reveal> : <>{children}</>;
  return (
    <section id={id} className={cx("bg-cream scroll-mt-4", yellow ? "px-2 lg:px-gutter py-2" : "py-10 lg:py-24", className)}>
      <div className={cx(yellow && "bg-yellow rounded-xl lg:rounded-2xl py-10 lg:py-20")}>
        <div className="mx-auto max-w-wide px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className={cx("lg:col-span-5 flex flex-col gap-6 lg:gap-8", side === "left" ? "lg:order-2 lg:col-start-8" : "lg:order-1")}>
            <Wrap><StepPill as="h2" number={number} label={label} icon={icon} /></Wrap>
            <Wrap d={0.1}><div className="font-display text-lead text-ink max-w-prose">{body}</div></Wrap>
          </div>
          {media && (
            <div className={cx("lg:col-span-7", side === "left" ? "lg:order-1 lg:col-start-1 lg:row-start-1" : "lg:order-2")}>
              <Wrap d={0.15} v={side === "left" ? "right" : "left"}>{media}</Wrap>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
