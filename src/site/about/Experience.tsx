"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/primitives/SectionHeading";
import { IconCircle } from "@/primitives/Icon";
import { Stagger, StaggerItem } from "@/motion/Reveal";
import { iconFor } from "@/site/icons";
import { content, type ExperienceFigure } from "@/content/content";
import { cx } from "@/lib/cx";

const DottedSurface = dynamic(() => import("@/components/ui/dotted-surface").then((m) => m.DottedSurface), { ssr: false });

/**
 * Counts from 0 to the figure's number each time it scrolls into view. The server renders the final value,
 * so the static HTML (no JS, crawlers) always carries the real figure; reduced motion skips the count.
 */
function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = !!useReducedMotion();
  const [, num, suffix] = value.match(/^(\d+)(.*)$/) ?? [, "", value];
  const target = num ? Number(num) : 0;
  const [shown, setShown] = React.useState(target);
  React.useEffect(() => {
    if (!num || reduce) return;
    if (!inView) { setShown(0); return; }
    const c = animate(0, target, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, num, target, reduce]);
  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {num ? `${shown}${suffix}` : value}
    </span>
  );
}

function Figure({ f, className }: { f: ExperienceFigure; className?: string }) {
  return (
    <div className={cx("h-full bg-white border border-solid border-line rounded-lg p-6 lg:p-8 flex flex-col justify-between gap-8", className)}>
      <IconCircle tone="stone" size="md">{iconFor(f.icon, 22)}</IconCircle>
      <div className="flex flex-col gap-2">
        <CountUp value={f.value} className="font-display font-regular text-display-lg leading-none text-ink" />
        <p className="m-0 font-body text-body-md text-ink">{f.label}</p>
      </div>
    </div>
  );
}

/** About: experience in numbers. One featured yellow card (projects shipped) beside three white figures. */
export function Experience() {
  const e = content.about.experience;
  const [a, b, c] = e.figures;
  return (
    <section className="bg-cream px-2 lg:px-gutter py-2" aria-labelledby="experience-title">
      <div className="bg-cream border border-solid border-line rounded-lg lg:rounded-xl px-4 md:px-10 lg:px-16 py-12 lg:py-20 flex flex-col gap-10 lg:gap-14">
        <SectionHeading title={<span id="experience-title">{e.title}</span>} subtitle={e.subtitle} />
        <Stagger className="grid grid-cols-1 lg:grid-cols-12 gap-4" amount={0.25}>
          <StaggerItem className="lg:col-span-5">
            <div className="relative isolate overflow-hidden h-full min-h-[320px] lg:min-h-[520px] bg-yellow text-ink rounded-lg p-6 lg:p-10 flex flex-col justify-between gap-10">
              <div aria-hidden className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
                <DottedSurface contained color="#1c1b1f" fogColor="#ffd64e" speed={0.4} amplitude={30} spacing={110} size={5} />
              </div>
              <IconCircle tone="ink" size="lg">{iconFor(e.featured.icon, 28)}</IconCircle>
              <div className="flex flex-col gap-3">
                <CountUp value={e.featured.value} className="font-display font-regular text-price" />
                <p className="m-0 font-display text-lead max-w-[16ch]">{e.featured.label}</p>
              </div>
            </div>
          </StaggerItem>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StaggerItem><Figure f={a} /></StaggerItem>
            <StaggerItem><Figure f={b} /></StaggerItem>
            <StaggerItem className="sm:col-span-2"><Figure f={c} /></StaggerItem>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
