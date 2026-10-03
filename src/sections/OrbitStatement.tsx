import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
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
  /** Placement on the square phone stage (below `sm`). Default: an even ring that keeps the desktop order. */
  mobile?: OrbitPlacement;
}

/** Centre and diameter of a disc on a stage, all in % of the stage width (y in % of its height). */
export interface OrbitPlacement { x: number; y: number; size: number }

export interface OrbitStatementProps {
  items: OrbitItem[];
  /** The heading under the discs. It never changes on hover. */
  statement: React.ReactNode;
  /** Content of the big yellow disc. Default: the Ac. wordmark. It never changes on hover. */
  center?: React.ReactNode;
  /** Centre disc position/size (same units as items). Default { x: 48, y: 50, size: 47 } — the reference. */
  centerPosition?: { x: number; y: number; size: number };
  /** Centre disc on the square phone stage. Default { x: 50, y: 50, size: 42 }. */
  mobileCenterPosition?: OrbitPlacement;
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

/**
 * Phones get a square stage instead of the 2:1 strip: in the strip every disc is sized off a ~340px width,
 * so the bubbles end up thumbnail-sized next to a dominant centre. On the square the bubbles sit on one even
 * ring around a smaller centre, in the same clockwise order as the desktop scatter, and grow to touch size.
 */
function ringLayout(items: OrbitItem[], center: OrbitPlacement, radius = 37): OrbitPlacement[] {
  // Desktop stage is 2:1, so a y step is half as long as an x step.
  const angleOf = (it: OrbitItem) => Math.atan2((it.y - center.y) / 2, it.x - center.x);
  const order = items.map((it, i) => ({ i, a: angleOf(it) })).sort((p, q) => p.a - q.a);
  const step = (2 * Math.PI) / items.length;
  const start = order.length ? order[0].a : 0;
  const out: OrbitPlacement[] = new Array(items.length);
  order.forEach(({ i }, k) => {
    const a = start + k * step;
    out[i] = { x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a), size: 17 + (items[i].size ?? 16) * 0.3 };
  });
  return out;
}

/** Inline custom properties read by `.ac-orbit-node`: phone placement, then the `sm` and up placement. */
const placementVars = (m: OrbitPlacement, d: OrbitPlacement) =>
  ({ "--mx": `${m.x}%`, "--my": `${m.y}%`, "--ms": `${m.size}%`, "--x": `${d.x}%`, "--y": `${d.y}%`, "--s": `${d.size}%` }) as React.CSSProperties;

function Bubble({ item, mobile, magnet, float, index, tone, once, origin }: { item: OrbitItem; mobile: OrbitPlacement; magnet: number; float: boolean; index: number; tone: "ink" | "cream"; once: boolean; origin: { x: number; y: number } }) {
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
      className="ac-orbit-node"
      style={{ ...placementVars(mobile, { x: item.x, y: item.y, size }), zIndex: 2 }}
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
          "group relative w-full h-full rounded-full flex items-center justify-center bg-white text-ink no-underline transition-shadow duration-base ease-out",
          item.href && "ac-focus ac-on-dark cursor-pointer",
          tone === "cream" && "border border-solid border-line [@media(hover:hover)]:hover:shadow-hover",
        )}
      >
        <span
          className="flex items-center justify-center w-[44%] h-[44%] sm:w-[36%] sm:h-[36%] [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full transition-transform duration-base ease-out group-hover:-rotate-6"
          aria-hidden
        >
          {item.icon}
        </span>
        {/* Names the logo for pointer users; touch has no hover, and the accessible name already carries it. */}
        <span
          className="hidden [@media(hover:hover)]:block pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-sm text-white opacity-0 transition duration-base ease-out group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden
        >
          {item.label}
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
  items, statement, center, centerPosition = { x: 48, y: 50, size: 47 }, mobileCenterPosition = { x: 50, y: 50, size: 42 }, tone = "ink", magnet = 0.15, float = false, once = false, className,
}: OrbitStatementProps) {
  const reduce = !!useReducedMotion();
  const ink = tone === "ink";
  const c = centerPosition;
  const ring = ringLayout(items, c);
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className={cx("rounded-lg lg:rounded-xl overflow-hidden px-4 pt-10 pb-12 lg:pt-16 lg:pb-20", ink ? "bg-ink text-white ac-dark" : "bg-cream text-ink border border-solid border-line")}>
        <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[1100px] aspect-square sm:aspect-[2/1]">
          <motion.div
            className="ac-orbit-node rounded-full bg-yellow text-ink flex items-center justify-center"
            style={{ ...placementVars(mobileCenterPosition, c), zIndex: 1 }}
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once, amount: 0.3 }}
            transition={{ duration: D.slow, ease: E.out }}
            aria-hidden
          >
            {center ?? <span className="font-display font-medium tracking-[-0.03em] leading-none text-[clamp(2.75rem,12vw,3.75rem)] sm:text-[clamp(2.5rem,9vw,8rem)]">Ac.</span>}
          </motion.div>
          {items.map((it, i) => <Bubble key={it.id} item={it} mobile={it.mobile ?? ring[i]} index={i} tone={tone} magnet={magnet} float={float} once={once} origin={c} />)}
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
