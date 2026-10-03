import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cx } from "../lib/cx";
import { duration as D, ease as E } from "../tokens/motion";

export interface ScoreMeterProps {
  label: string;
  /** 0–100. */
  value: number;
  /** Word shown next to the %, e.g. "Excellent". Default derived from value. */
  verdict?: string;
  /** Number of dots. Default 30. */
  dots?: number;
  /** Fill the dots in sequence on scroll. Default true. */
  animated?: boolean;
  className?: string;
}

const verdictFor = (v: number) => (v >= 80 ? "Excellent" : v >= 60 ? "Good" : v >= 40 ? "Fair" : "Low");

/** Dot meter ("Brand Relevance Score"): ink % chip inside a mint pill, then a row of filled/empty dots. */
export function ScoreMeter({ label, value, verdict, dots = 30, animated = true, className }: ScoreMeterProps) {
  const reduce = useReducedMotion();
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * dots);
  const animate = animated && !reduce;
  return (
    <div className={cx("flex flex-col gap-3 text-ink", className)}>
      <span className="font-display text-button-lg">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-3 rounded-pill bg-mint p-2 pr-4">
          <span className="rounded-pill bg-ink text-white px-2 py-1 text-caption font-medium">{Math.round(value)}%</span>
          <span className="text-sm font-medium">{verdict ?? verdictFor(value)}</span>
        </span>
        <motion.div
          className="flex flex-nowrap gap-1 flex-1 min-w-[10rem]"
          role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}
          initial={animate ? "off" : "on"} whileInView="on" viewport={{ once: false, amount: 0.5 }}
          variants={{ off: {}, on: { transition: { staggerChildren: 0.02 } } }}
        >
          {Array.from({ length: dots }).map((_, i) => (
            <motion.span
              key={i}
              className={cx("block flex-1 aspect-square max-w-dot rounded-full", i < filled ? "bg-mint" : "bg-stone")}
              variants={{ off: { scale: 0.4, opacity: 0 }, on: { scale: 1, opacity: 1, transition: { duration: D.fast, ease: E.out } } }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
