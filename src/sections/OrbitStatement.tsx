import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cx } from "../lib/cx";
import { duration as D, ease as E } from "../tokens/motion";

export interface OrbitItem {
  id: string;
  /** Icon shown in the white disc. */
  icon: React.ReactNode;
  /** Accessible name of the bubble, e.g. "Launch". */
  label: string;
  /** Optional link — makes the bubble a link instead of a static shape. */
  href?: string;
  /** Centre X, % of the stage width (0–100). */
  x: number;
  /** Centre Y, % of the stage height (0–100). */
  y: number;
  /** Diameter, % of the stage width. Default 16. */
  size?: number;
}

export interface OrbitStatementProps {
  items: OrbitItem[];
  /** The heading under the discs. It never changes on hover. */
  statement: React.ReactNode;
  /** Content of the big yellow disc. Default: the Ac. wordmark. It never changes on hover. */
  center?: React.ReactNode;
  /** Centre disc position/size (same units as items). Default { x: 48, y: 50, size: 47 } — the reference. */
  centerPosition?: { x: number; y: number; size: number };
  /** ink = reference · cream = light variant. */
  tone?: "ink" | "cream";
  /** How far a hovered bubble leans toward the cursor (0–1). Default 0.15 — a small shift. 0 = none. */
  magnet?: number;
  /** Very slow idle bob of the bubbles. Default false. */
  float?: boolean;
  /** Play the scroll entrance only the first time. Default false: everything hides again when scrolled out and replays on re-entry. */
  once?: boolean;
  className?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function Bubble({ item, magnet, float, index, tone, once, origin }: { item: OrbitItem; magnet: number; float: boolean; index: number; tone: "ink" | "cream"; once: boolean; origin: { x: number; y: number } }) {
  const reduce = !!useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 20 });
  const y = useSpring(my, { stiffness: 180, damping: 20 });
  const size = item.size ?? 16;
  const interactive = !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!interactive || !ref.current || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    const lim = r.width * 0.12;
    mx.set(clamp((e.clientX - (r.left + r.width / 2)) * magnet, -lim, lim));
    my.set(clamp((e.clientY - (r.top + r.height / 2)) * magnet, -lim, lim));
  };
  const reset = () => { mx.set(0); my.set(0); };

  const Comp: any = item.href ? motion.a : motion.div;
  return (
    <motion.div
      className="absolute"
      style={{ left: `calc(${item.x}% - ${size / 2}%)`, top: `calc(${item.y}% - ${size}%)`, width: `${size}%`, aspectRatio: "1", zIndex: 2 }}
      animate={float && !reduce ? { y: [0, -6, 0] } : undefined}
      transition={float && !reduce ? { duration: 7 + index * 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <motion.div
        className="w-full h-full"
        initial={reduce ? false : { opacity: 0, scale: 0.55, x: (origin.x - item.x) * 3, y: (origin.y - item.y) * 3 }}
        whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        viewport={{ once, amount: 0.3 }}
        transition={{ duration: D.slow, delay: 0.15 + index * 0.08, ease: E.out }}
      >
      <Comp
        ref={ref}
        {...(item.href ? { href: item.href, "aria-label": item.label } : { role: "img", "aria-label": item.label })}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ x, y }}
        whileHover={interactive ? { scale: 1.06 } : undefined}
        transition={{ duration: D.base, ease: E.out }}
        className={cx(
          "group w-full h-full rounded-full flex items-center justify-center bg-white text-ink no-underline",
          item.href && "ac-focus ac-on-dark cursor-pointer",
          tone === "cream" && "border border-solid border-line",
        )}
      >
        <span
          className="flex items-center justify-center w-[34%] h-[34%] [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full transition-transform duration-base ease-out group-hover:-rotate-6"
          aria-hidden
        >
          {item.icon}
        </span>
      </Comp>
      </motion.div>
    </motion.div>
  );
}

/**
 * Dark statement panel: a big yellow disc with white icon bubbles and a heading underneath.
 * Hover is deliberately quiet — only the hovered bubble reacts (grows 6%, leans slightly toward
 * the cursor, icon tilts). The centre disc and the heading never change.
 */
export function OrbitStatement({
  items, statement, center, centerPosition = { x: 48, y: 50, size: 47 }, tone = "ink", magnet = 0.15, float = false, once = false, className,
}: OrbitStatementProps) {
  const reduce = !!useReducedMotion();
  const ink = tone === "ink";
  const c = centerPosition;
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className={cx("rounded-lg lg:rounded-xl overflow-hidden px-4 pt-10 pb-12 lg:pt-16 lg:pb-20", ink ? "bg-ink text-white ac-dark" : "bg-cream text-ink border border-solid border-line")}>
        <div className="relative mx-auto w-full max-w-[1100px] aspect-[2/1]">
          <motion.div
            className="absolute rounded-full bg-yellow text-ink flex items-center justify-center"
            style={{ left: `calc(${c.x}% - ${c.size / 2}%)`, top: `calc(${c.y}% - ${c.size}%)`, width: `${c.size}%`, aspectRatio: "1", zIndex: 1 }}
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once, amount: 0.3 }}
            transition={{ duration: D.slow, ease: E.out }}
            aria-hidden
          >
            {center ?? <span className="font-display font-medium tracking-[-0.03em] leading-none text-[clamp(2.5rem,9vw,8rem)]">Ac.</span>}
          </motion.div>
          {items.map((it, i) => <Bubble key={it.id} item={it} index={i} tone={tone} magnet={magnet} float={float} once={once} origin={c} />)}
        </div>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once, amount: 0.5 }}
          transition={{ duration: D.slow, delay: 0.3, ease: E.out }}
          className={cx("m-0 mx-auto max-w-[22ch] lg:max-w-[24ch] mt-6 lg:mt-10 text-center font-display font-regular text-heading-xl", ink ? "text-white" : "text-ink")}
        >
          {statement}
        </motion.h2>
      </div>
    </section>
  );
}
