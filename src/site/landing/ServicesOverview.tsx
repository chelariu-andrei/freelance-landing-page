"use client";
import { ArrowDown, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { StepPill } from "@/primitives/StepPill";
import { Reveal, Stagger, StaggerItem } from "@/motion/Reveal";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { ease as E } from "@/tokens/motion";

/**
 * "Three ways I help. One way of working." drawn literally: the three services, three lines merging into one,
 * and the single process every service runs through. Each card jumps to its detailed section below.
 */
export function ServicesOverview() {
  const { servicesOverview: o, services, servicesAriaLabel } = content.landing;
  const reduce = !!useReducedMotion();
  const draw = (delay: number) => reduce ? {} : {
    initial: { opacity: 0, pathLength: 0 },
    whileInView: { opacity: 1, pathLength: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.7, delay, ease: E.out },
  };

  return (
    <section id="services" aria-label={servicesAriaLabel} className="bg-cream px-5 md:px-10 pt-16 lg:pt-32 pb-6 lg:pb-12">
      <Reveal className="mx-auto max-w-[56rem] text-center">
        <h2 className="m-0 font-display font-regular text-display-lg text-ink text-balance">
          {o.title}
          <span className="block">
            {o.titleTail}{" "}
            <span aria-hidden className="inline-flex align-middle items-center justify-center rounded-full bg-yellow text-ink w-[0.9em] h-[0.9em] mx-[0.1em]">
              <Sun size="0.5em" strokeWidth={1.75} />
            </span>{" "}
            <span className="underline decoration-yellow decoration-[0.06em] underline-offset-[0.12em]">{o.titleHighlight}</span>
          </span>
        </h2>
        <p className="mx-auto mt-8 mb-0 max-w-prose font-body text-body-lg text-ink">{o.lead}</p>
      </Reveal>

      <div className="mx-auto mt-12 lg:mt-20 max-w-[72rem]">
        <Reveal><p className="m-0 mb-6 lg:mb-8 text-center font-display text-lead text-ink">{o.pick}</p></Reveal>

        <Stagger as="ol" className="m-0 p-0 list-none grid grid-cols-1 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <StaggerItem as="li" key={s.id}>
              <a
                href={`#service-${s.id}`}
                className="ac-focus group flex h-full flex-col items-center gap-4 rounded-md bg-white p-6 lg:p-8 text-center no-underline transition-shadow duration-base ease-out hover:shadow-hover"
              >
                <StepPill as="h3" number={s.number} label={s.label} icon={iconFor(s.icon)} size="md" tone="ink" className="max-[479px]:[&>span:first-child]:hidden" />
                <p className="m-0 font-body text-body-md text-ink">{s.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 font-body text-sm text-ink-muted transition-colors duration-base ease-out group-hover:text-ink">
                  {o.details}
                  <ArrowDown size={16} strokeWidth={1.75} aria-hidden className="transition-transform duration-base ease-out group-hover:translate-y-0.5" />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Three services merge into one way of working: curves on desktop, a single stem on mobile. */}
        {/* Drawn at the container's real width (72rem) so the stretch stays near 1:1 and pathLength stays exact. */}
        <svg aria-hidden viewBox="0 0 1152 72" preserveAspectRatio="none" className="hidden lg:block w-full h-[72px] text-ink-muted">
          {["M192 0 C192 48 576 24 576 72", "M576 0 V72", "M960 0 C960 48 576 24 576 72"].map((d, i) => (
            <motion.path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.45} {...draw(i * 0.12)} />
          ))}
        </svg>
        <span aria-hidden className="lg:hidden mx-auto block h-10 w-[1.5px] bg-ink-muted opacity-40" />

        <Reveal>
          <div className="ac-dark rounded-lg lg:rounded-xl bg-ink text-white px-6 py-10 md:px-10 lg:px-14 lg:py-14">
            <h3 className="m-0 font-display font-regular text-heading-lg text-white">{o.process.title}</h3>
            <ol className="m-0 mt-10 lg:mt-12 p-0 list-none flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-0">
              {o.process.steps.map((ph, n) => {
                const last = n === o.process.steps.length - 1;
                const grow = (axis: "x" | "y") => reduce ? {} : {
                  initial: { opacity: 0, [axis === "x" ? "scaleX" : "scaleY"]: 0 },
                  whileInView: { opacity: 0.6, [axis === "x" ? "scaleX" : "scaleY"]: 1 },
                  viewport: { once: true, amount: 0.8 },
                  transition: { duration: 0.6, delay: 0.25 + n * 0.35, ease: E.out },
                };
                return (
                  <li key={ph.name} className="relative pl-10 lg:pl-0 lg:pr-10">
                    <span
                      aria-hidden
                      className={`absolute left-0 top-[6px] lg:static lg:block h-[15px] w-[15px] rounded-full border-[1.5px] border-solid ${last ? "border-yellow bg-yellow" : "border-white bg-ink"}`}
                    />
                    {!last && (
                      <>
                        <motion.span aria-hidden className="lg:hidden absolute left-[7px] top-[27px] -bottom-[26px] w-[1.5px] origin-top bg-yellow opacity-60" {...grow("y")} />
                        <motion.span aria-hidden className="hidden lg:block absolute left-[23px] right-[8px] top-[7px] h-[1.5px] origin-left bg-yellow opacity-60" {...grow("x")} />
                      </>
                    )}
                    <h4 className="m-0 lg:mt-6 font-display font-regular text-lead text-white">{ph.name}</h4>
                    <p className="m-0 mt-2 max-w-[22rem] font-body text-body-md text-muted-on-dark">{ph.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
