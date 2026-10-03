import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cx } from "../lib/cx";
import { duration as D, ease as E, stagger as S } from "../tokens/motion";

export type StatPart =
  | { kind: "text"; text: string }
  | { kind: "icon"; icon: React.ReactNode; label?: string }
  | { kind: "value"; text: string };

export interface StatRow {
  parts: StatPart[];
  /** Optional round bubble after the pill (the stone arrow disc). */
  bubble?: React.ReactNode;
}

export interface StatStatementProps {
  rows: StatRow[];
  /** Horizontal offset of each following row at desktop, like the reference's stepped layout. Default true. */
  stepped?: boolean;
  animated?: boolean;
  /** Decorative layer behind the pills, e.g. <DottedSurface contained color="#1c1b1f" fogColor="#f9f6f0" />. */
  background?: React.ReactNode;
  className?: string;
}

const ROW_GAP = 0.35;
/** Corner radius of the wipe: half the phone pill's height, and never rounder than the larger pills themselves. */
const PILL_R = "1.75rem";

/**
 * Scroll choreography, one row after the other: the white pill wipes open from the left, the words rise
 * into place, the yellow bubbles pop, and finally the stone disc rolls in with its arrow dropping down.
 * Under reduced motion everything simply fades.
 */
function rowVariants(reduce: boolean, ri: number) {
  const at = ri * ROW_GAP;
  const fade: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: D.base, delay: at } } };
  if (reduce) return { pill: fade, word: fade, bubble: fade, disc: fade, arrow: fade };
  const pill: Variants = {
    hidden: { opacity: 0, clipPath: `inset(0% 100% 0% 0% round ${PILL_R})` },
    show: { opacity: 1, clipPath: `inset(0% 0% 0% 0% round ${PILL_R})`, transition: { duration: D.hero, delay: at, ease: E.out } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
    show: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: D.slow, delay: at + 0.25 + i * S.base, ease: E.out } }),
  };
  const bubble: Variants = {
    hidden: { opacity: 0, scale: 0.4, rotate: -20 },
    show: (i: number) => ({ opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 18, delay: at + 0.3 + i * S.base } }),
  };
  const disc: Variants = {
    hidden: { opacity: 0, x: -64, rotate: -90 },
    show: { opacity: 1, x: 0, rotate: 0, transition: { duration: D.hero, delay: at + 0.55, ease: E.out } },
  };
  const arrow: Variants = {
    hidden: { opacity: 0, y: -24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 14, delay: at + 1.1 } },
  };
  return { pill, word, bubble, disc, arrow };
}

/** Big white pills carrying a sentence with yellow icon/value bubbles ("In minutes ⏱ not months", "Up to 90% savings…"). */
export function StatStatement({ rows, stepped = true, animated = true, background, className }: StatStatementProps) {
  const reduce = !!useReducedMotion();
  const on = animated;
  return (
    <section className={cx("relative bg-cream py-10 lg:py-16 px-2 lg:px-gutter overflow-hidden", className)}>
      {background}
      <motion.div
        className="relative z-10 mx-auto w-fit max-w-wide flex flex-col gap-2 lg:gap-3"
        initial={on ? "hidden" : false}
        whileInView={on ? "show" : undefined}
        viewport={{ once: false, amount: 0.35 }}
      >
        {rows.map((row, ri) => {
          const v = rowVariants(reduce, ri);
          return (
            <div key={ri} className={cx("flex items-start", stepped && ri > 0 && "pl-6 sm:pl-12 lg:pl-20")}>
              <motion.p
                variants={on ? v.pill : undefined}
                className="m-0 flex flex-wrap items-center gap-x-2 sm:gap-x-3 lg:gap-x-6 gap-y-1 bg-white rounded-pill px-4 sm:px-10 lg:px-16 py-3 sm:py-5 lg:min-h-[9rem] font-display whitespace-nowrap text-[clamp(1rem,5vw,1.375rem)] leading-[1.25] sm:text-heading-lg lg:text-[clamp(2.75rem,1.2rem+3vw,4.5rem)] lg:leading-[1.1] tracking-[-0.02em] text-ink"
              >
                {row.parts.map((p, pi) => {
                  const common = { custom: pi, variants: on ? (p.kind === "text" ? v.word : v.bubble) : undefined };
                  return p.kind === "text" ? <motion.span key={pi} className="inline-block" {...common}>{p.text}</motion.span> :
                    p.kind === "value" ? <motion.span key={pi} className="inline-flex items-center bg-yellow rounded-pill px-4 lg:px-8 py-1 lg:py-3 tabular-nums" {...common}>{p.text}</motion.span> :
                    <motion.span key={pi} role={p.label ? "img" : undefined} aria-label={p.label} aria-hidden={p.label ? undefined : true} className="inline-flex items-center justify-center bg-yellow rounded-full w-8 h-8 sm:w-12 sm:h-12 lg:w-24 lg:h-24" {...common}>{p.icon}</motion.span>;
                })}
              </motion.p>
              {row.bubble && (
                <motion.span aria-hidden variants={on ? v.disc : undefined} className="inline-flex self-start items-center justify-center shrink-0 w-[3.5rem] h-[3.5rem] sm:w-[5.5rem] sm:h-[5.5rem] lg:w-[9rem] lg:h-[9rem] bg-stone rounded-full -ml-1">
                  <motion.span className="inline-flex" variants={on ? v.arrow : undefined}>{row.bubble}</motion.span>
                </motion.span>
              )}
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
