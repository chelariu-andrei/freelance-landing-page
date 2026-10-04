"use client";
import * as React from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { iconFor } from "@/site/icons";
import { ease as E } from "@/tokens/motion";
import type { ProcessStep } from "@/content/content";

/** Centre of a 15px checkpoint dot that sits 6px below its row's top. */
const DOT_CENTER = 13.5;

/**
 * The delivery path as a vertical rail. A yellow marker is tied to scroll: it leaves the first checkpoint, visits each one
 * in turn and reaches the last as the list scrolls past, and walks back the same way on a reverse scroll.
 * Checkpoints it has passed keep a yellow ring, and the rail fills behind it. Reduced motion gets the finished state.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reduce = !!useReducedMotion();
  const listRef = React.useRef<HTMLOListElement>(null);
  /** Vertical centre of every checkpoint, measured from the top of the list. */
  const [dots, setDots] = React.useState<number[]>([]);
  const [reached, setReached] = React.useState(0);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      setDots(Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"), (d) => {
        const r = d.getBoundingClientRect();
        return r.top - top + r.height / 2;
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [steps.length]);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const markerY = useMotionValue(DOT_CENTER);
  const fillH = useMotionValue(0);

  const place = React.useCallback((p: number) => {
    if (dots.length < 2) return;
    const first = dots[0], last = dots[dots.length - 1];
    const y = first + Math.min(Math.max(p, 0), 1) * (last - first);
    markerY.set(y);
    fillH.set(y - first);
    const n = dots.filter((d) => d <= y + 1).length;
    setReached((prev) => (prev === n ? prev : n));
  }, [dots, markerY, fillH]);

  useMotionValueEvent(progress, "change", place);
  React.useEffect(() => { place(progress.get()); }, [place, progress]);

  const first = dots[0] ?? DOT_CENTER;
  const trackH = dots.length > 1 ? dots[dots.length - 1] - first : 0;

  return (
    <ol ref={listRef} className="relative m-0 mt-10 lg:mt-12 p-0 list-none">
      {/* Rail: a dim track between the first and last checkpoint, and the part already travelled. */}
      <span aria-hidden className="absolute left-[6.75px] w-[1.5px] bg-white opacity-20" style={{ top: first, height: trackH }} />
      <motion.span
        aria-hidden
        className="absolute left-[6.75px] w-[1.5px] bg-yellow"
        style={{ top: first, height: reduce ? trackH : fillH }}
      />

      {steps.map((ph, n) => {
        const last = n === steps.length - 1;
        const visited = reduce || n < reached;
        return (
          <li key={ph.name} className={`relative pl-10 lg:pl-14 ${last ? "" : "pb-[2.25rem] lg:pb-[2.75rem]"}`}>
            <span
              aria-hidden
              data-dot
              className={`absolute left-0 top-[6px] h-[15px] w-[15px] rounded-full border-[1.5px] border-solid transition-colors duration-base ease-out ${
                reduce && last ? "border-yellow bg-yellow" : visited ? "border-yellow bg-ink" : "border-white bg-ink"
              }`}
            />
            <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
              <h4 className="m-0 font-display font-regular text-lead text-white text-balance">{ph.name}</h4>
              <div className="mt-2 lg:mt-0">
                <p className="m-0 max-w-[34rem] font-body text-body-md text-muted-on-dark">{ph.text}</p>
                {ph.handover && (
                  <motion.div
                    className="mt-5 flex max-w-[34rem] items-start gap-4 rounded-md bg-yellow p-4 lg:p-5 text-ink"
                    {...(reduce ? {} : {
                      initial: { opacity: 0, y: 10 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.6 },
                      transition: { duration: 0.6, delay: 0.2, ease: E.out },
                    })}
                  >
                    <span aria-hidden className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      {iconFor("shipped", 20)}
                    </span>
                    <p className="m-0 font-body text-body-md text-pretty">
                      <strong className="block font-display font-regular text-lead">{ph.handover.label}</strong>
                      {ph.handover.text}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </li>
        );
      })}

      {/* The marker rides above the rail; it is decoration, the steps themselves carry the meaning. */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-[-3px] top-[-10.5px] h-[21px] w-[21px] rounded-full bg-yellow ring-4 ring-ink"
          style={{ y: markerY }}
        />
      )}
    </ol>
  );
}
