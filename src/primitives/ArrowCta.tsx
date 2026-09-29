import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cx } from "../lib/cx";
import { duration as D, ease as E } from "../tokens/motion";

export interface ArrowCtaProps {
  label: string;
  /** Text shown while hovered/focused, e.g. "Ready to join?". Default: same as `label`. */
  hoverLabel?: string;
  href?: string;
  onClick?: () => void;
  /** xl = the "See It In Action" hero-size CTA · lg = inline. */
  size?: "lg" | "xl";
  /** Pill colour at rest. Default "white". */
  tone?: "white" | "yellow";
  /** Colour that sweeps in left → right on hover. Default "yellow" (or "white" when tone is yellow). */
  hoverTone?: "yellow" | "white" | "none";
  /**
   * swap = colour sweep + disc travels to the other end + label slides (reference) ·
   * nudge = only the arrow nudges (the previous behaviour). Default "swap".
   */
  hoverEffect?: "swap" | "nudge";
  className?: string;
}

const fillClass = { yellow: "bg-yellow", white: "bg-white" };

/**
 * Oversized pill CTA with an ink arrow disc. On hover/focus the pill fills with the hover colour
 * from left to right, the disc glides to the opposite end and the label slides to `hoverLabel`.
 */
export function ArrowCta({
  label, hoverLabel, href, onClick, size = "xl", tone = "white", hoverTone, hoverEffect = "swap", className,
}: ArrowCtaProps) {
  const reduce = !!useReducedMotion();
  const [on, setOn] = React.useState(false);
  const xl = size === "xl";
  const swap = hoverEffect === "swap";
  const fill = hoverTone ?? (tone === "yellow" ? "white" : "yellow");
  const alt = hoverLabel ?? label;
  const Comp: any = href ? motion.a : motion.button;
  const t = reduce ? { duration: 0 } : { duration: D.slow, ease: E.out };
  const active = swap && on;

  const disc = (
    <motion.span
      layout={swap && !reduce ? "position" : false}
      transition={t}
      className={cx("relative z-10 inline-flex items-center justify-center rounded-full bg-ink text-white shrink-0 overflow-hidden", xl ? "w-16 h-16 lg:w-32 lg:h-32" : "w-12 h-12")}
    >
      <motion.span
        className="inline-flex"
        animate={on && !reduce ? { x: 4, y: -4 } : { x: 0, y: 0 }}
        transition={{ duration: D.base, ease: E.out }}
      >
        <ArrowUpRight size={xl ? 40 : 24} strokeWidth={1.5} aria-hidden className={xl ? "lg:scale-150" : ""} />
      </motion.span>
    </motion.span>
  );

  // Both labels share one grid cell so the pill keeps the width of the longer one — no jump on swap.
  const text = (
    <motion.span
      layout={swap && !reduce ? "position" : false}
      transition={t}
      className={cx("relative z-10 grid tracking-[-0.03em] whitespace-nowrap overflow-hidden", xl ? "px-4 lg:px-10" : "px-4")}
    >
      <span className="invisible [grid-area:1/1]" aria-hidden>{label}</span>
      <span className="invisible [grid-area:1/1]" aria-hidden>{alt}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={active ? "alt" : "label"}
          className="[grid-area:1/1] text-center"
          initial={reduce ? { opacity: 0 } : { x: active ? "-60%" : "60%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { x: active ? "60%" : "-60%", opacity: 0 }}
          transition={t}
          aria-hidden
        >
          {active ? alt : label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );

  return (
    <Comp
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      aria-label={label}
      onHoverStart={() => setOn(true)}
      onHoverEnd={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={cx(
        "ac-focus ac-on-dark relative isolate inline-flex items-center rounded-pill border-0 no-underline cursor-pointer font-display text-ink overflow-hidden",
        tone === "white" ? "bg-white" : "bg-yellow",
        xl ? "p-2 lg:p-4 text-heading-lg lg:text-display-lg" : "p-2 text-lead",
        className,
      )}
    >
      {swap && fill !== "none" && (
        <motion.span
          aria-hidden
          className={cx("absolute inset-0 z-0 origin-left rounded-pill", fillClass[fill])}
          initial={false}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={t}
        />
      )}
      {active ? (<>{text}{disc}</>) : (<>{disc}{text}</>)}
    </Comp>
  );
}
