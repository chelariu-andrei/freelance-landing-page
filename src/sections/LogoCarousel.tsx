import * as React from "react";
import {
  AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion,
  useScroll, useTransform, useVelocity, type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";
import { Reveal } from "../motion/Reveal";
import { duration as D, ease as E } from "../tokens/motion";

export interface CarouselItem {
  /** Stable id — used as the React key so added items animate in. */
  id: string;
  /** Label under the tile (shown uppercase). */
  name: string;
  /** Mark shown in the tile: an icon, an <img>, or the tool's own SVG logo. */
  icon: React.ReactNode;
  /** One line on what it is for; revealed on hover/focus. */
  description?: string;
  href?: string;
  /** Dimmed tile — e.g. a tool being phased out. */
  inactive?: boolean;
}

/** A CSS length (number = px, or any CSS length incl. clamp()/vw). */
export type Length = number | string;
/** One value for every screen, or per breakpoint (mobile-first: base → sm 640 → md 768 → lg 1024 → xl 1280 → 2xl 1536). */
export type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T; "2xl"?: T };

export interface CarouselSizing {
  /** Tile (the square container around each logo). */
  tile?: Responsive<Length>;
  /** Logo/icon inside the tile. */
  icon?: Responsive<Length>;
  /** Space between tiles. */
  gap?: Responsive<Length>;
  /** Arrow size (the chevron fills it; the button is transparent). */
  arrow?: Responsive<Length>;
  /** Vertical space above and below the row of tiles (makes the carousel area taller or shorter). */
  trackPadding?: Responsive<Length>;
  /** Corner radius of the tiles. */
  radius?: Responsive<Length>;
}

export interface LogoCarouselProps extends CarouselSizing {
  /** The queue. Append to it at any time — the loop re-measures and new tiles animate in. */
  items: CarouselItem[];
  /** Small tag above the title, e.g. "AI tools". */
  eyebrow?: string;
  /** First title line (ink). */
  title?: React.ReactNode;
  /** Second title line (muted). */
  titleMuted?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Size preset; any sizing prop you pass overrides the preset for that property. Default "lg". */
  size?: "sm" | "md" | "lg";
  /** Auto-drift speed in px/s. Default 40. 0 = no drift. */
  speed?: number;
  /** Drift direction. Default "left". */
  direction?: "left" | "right";
  /** Share of page scroll distance added to the track (0 = not scroll-linked). Default 0.35. */
  scrollBoost?: number;
  /** Element whose scroll drives the track. Default: the window. */
  scrollContainer?: React.RefObject<HTMLElement>;
  /** Drift on its own. Default true (always off under reduced motion). */
  autoplay?: boolean;
  /** Show the left/right arrows at the ends of the row. Default true. */
  arrows?: boolean;
  /** Tiles moved per arrow press. Default 2. */
  step?: number;
  /** Seconds the drift waits after the user drags or presses an arrow. Default 2. */
  resumeDelay?: number;
  onItemClick?: (item: CarouselItem) => void;
  loading?: boolean;
  /** Tiles shown while loading. Default 6. */
  loadingCount?: number;
  emptyText?: string;
  /** Background of the section. Default "cream". */
  tone?: "cream" | "white";
  className?: string;
}

/** Presets — measured from the reference (lg = 156px tiles on desktop). */
export const carouselPresets: Record<"sm" | "md" | "lg", Required<CarouselSizing>> = {
  sm: { tile: { base: 72, lg: 96 }, icon: { base: 32, lg: 44 }, gap: { base: 12, lg: 16 }, arrow: { base: 36, lg: 48 }, trackPadding: { base: 8, lg: 12 }, radius: 12 },
  md: { tile: { base: 96, lg: 128 }, icon: { base: 44, lg: 60 }, gap: { base: 12, lg: 20 }, arrow: { base: 40, lg: 60 }, trackPadding: { base: 12, lg: 16 }, radius: 16 },
  lg: { tile: { base: 112, md: 136, lg: 156 }, icon: { base: 52, md: 64, lg: 76 }, gap: { base: 16, lg: 20 }, arrow: { base: 44, md: 56, lg: 72 }, trackPadding: { base: 16, lg: 24 }, radius: 16 },
};

const BP: Array<["base" | "sm" | "md" | "lg" | "xl" | "2xl", number]> = [["base", 0], ["sm", 640], ["md", 768], ["lg", 1024], ["xl", 1280], ["2xl", 1536]];
const len = (v: Length) => (typeof v === "number" ? `${v}px` : v);
const isMap = (v: unknown): v is Record<string, Length> => typeof v === "object" && v !== null;

/** Builds scoped CSS custom properties, one @media block per breakpoint that sets something. */
function sizingCss(scope: string, s: Required<CarouselSizing>) {
  const vars: Array<[string, Responsive<Length>]> = [["--lc-tile", s.tile], ["--lc-icon", s.icon], ["--lc-gap", s.gap], ["--lc-arrow", s.arrow], ["--lc-pad", s.trackPadding], ["--lc-radius", s.radius]];
  return BP.map(([bp, min]) => {
    const decl = vars
      .map(([name, v]) => (isMap(v) ? (v[bp] != null ? `${name}:${len(v[bp] as Length)};` : "") : bp === "base" ? `${name}:${len(v)};` : ""))
      .join("");
    if (!decl) return "";
    return min === 0 ? `.${scope}{${decl}}` : `@media (min-width:${min}px){.${scope}{${decl}}}`;
  }).join("");
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// AnimatePresence's popLayout mode measures each tile through its ref (a plain prop in React 19).
function Tile({ item, clone, onItemClick, ref }: { item: CarouselItem; clone: boolean; onItemClick?: (i: CarouselItem) => void; ref?: React.Ref<HTMLLIElement> }) {
  const Comp: any = item.href ? "a" : onItemClick ? "button" : "div";
  const interactive = !!(item.href || onItemClick);
  return (
    <motion.li
      ref={ref}
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: D.slow, ease: E.out }}
      className="shrink-0 list-none"
      style={{ width: "var(--lc-tile)" }}
      aria-hidden={clone || undefined}
    >
      <Comp
        {...(item.href ? { href: item.href } : {})}
        {...(Comp === "button" ? { type: "button", onClick: () => onItemClick?.(item) } : {})}
        tabIndex={clone ? -1 : undefined}
        draggable={false}
        className={cx(
          "group flex flex-col items-center gap-4 w-full bg-transparent border-0 p-0 no-underline text-ink font-body",
          interactive && "ac-focus rounded-md cursor-pointer",
          item.inactive && "opacity-40",
        )}
      >
        <span
          className={cx(
            "flex items-center justify-center bg-stone border border-solid border-line",
            "transition-[background-color,transform,box-shadow] duration-base ease-out",
            "group-hover:bg-white group-hover:-translate-y-1 group-hover:shadow-hover group-focus-visible:bg-white",
          )}
          style={{ width: "var(--lc-tile)", height: "var(--lc-tile)", borderRadius: "var(--lc-radius)" }}
        >
          <span
            className="flex items-center justify-center transition-transform duration-base ease-out group-hover:scale-110 [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
            style={{ width: "var(--lc-icon)", height: "var(--lc-icon)" }}
            aria-hidden
          >
            {item.icon}
          </span>
        </span>
        <span className="text-overline uppercase text-ink-muted text-center whitespace-nowrap group-hover:text-ink transition-colors duration-fast" style={{ fontSize: "clamp(10px, calc(var(--lc-tile) * 0.1), 13px)" }}>{item.name}</span>
        {item.description && (
          <span className="text-caption text-center text-ink-muted -mt-2 opacity-0 translate-y-1 transition-[opacity,transform] duration-base ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            {item.description}
          </span>
        )}
      </Comp>
    </motion.li>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  const nudgeX = side === "left" ? -4 : 4;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous items" : "Next items"}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.9 }}
      className="ac-focus shrink-0 inline-flex items-center justify-center rounded-full border-0 bg-transparent p-0 cursor-pointer text-ink hover:text-black transition-colors duration-fast ease-out"
      style={{
        width: "var(--lc-arrow)", height: "var(--lc-arrow)",
        marginTop: "calc(var(--lc-pad) + var(--lc-tile) / 2 - var(--lc-arrow) / 2)",
      }}
    >
      <motion.span
        className="inline-flex w-full h-full"
        variants={{ rest: { x: 0 }, hover: { x: nudgeX } }}
        transition={{ duration: D.fast, ease: E.out }}
      >
        <Icon className="w-full h-full" strokeWidth={1.5} aria-hidden />
      </motion.span>
    </motion.button>
  );
}

/**
 * Infinite logo/tool carousel. Drifts on its own, speeds up with page scroll, and can be dragged,
 * swiped, or stepped with the end arrows / keyboard. Tile, icon, gap, arrow and track height are
 * configurable per breakpoint.
 */
export function LogoCarousel({
  items, eyebrow, title, titleMuted, subtitle, size = "lg", speed = 40, direction = "left", scrollBoost = 0.35, scrollContainer,
  autoplay = true, arrows = true, step = 2, resumeDelay = 2, onItemClick, loading, loadingCount = 6,
  emptyText = "Nothing in the queue yet.", tone = "cream", className,
  tile, icon, gap, arrow, trackPadding, radius,
}: LogoCarouselProps) {
  const reduce = !!useReducedMotion();
  const scope = "ac-lc-" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const preset = carouselPresets[size];
  const css = sizingCss(scope, {
    tile: tile ?? preset.tile, icon: icon ?? preset.icon, gap: gap ?? preset.gap,
    arrow: arrow ?? preset.arrow, trackPadding: trackPadding ?? preset.trackPadding, radius: radius ?? preset.radius,
  });

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const setRef = React.useRef<HTMLUListElement>(null);
  const inView = useInView(viewportRef, { margin: "200px" });
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [setW, setSetW] = React.useState(0);
  const [copies, setCopies] = React.useState(2);
  const [stepPx, setStepPx] = React.useState(0);
  const idleUntil = React.useRef(0);
  const dragging = React.useRef(false);
  const liveRef = React.useRef<HTMLParagraphElement>(null);
  const drifting = autoplay && !reduce;

  const raw = useMotionValue(0);
  const setWRef = React.useRef(0);
  setWRef.current = setW;
  const x = useTransform(raw, (v) => (setWRef.current > 0 ? wrap(-setWRef.current, 0, v) : 0));
  // Re-wrap immediately when the measured width changes (breakpoint, items added).
  React.useEffect(() => { raw.set(raw.get()); }, [setW, raw]);

  // Measure one set + one step whenever items, sizing or the viewport change (breakpoints included).
  React.useLayoutEffect(() => {
    const measure = () => {
      const set = setRef.current, vp = viewportRef.current;
      if (!set || !vp) return;
      const g = parseFloat(getComputedStyle(set).columnGap || "0") || 0;
      const lis = Array.from(set.children) as HTMLElement[];
      if (!lis.length) return;
      // offsetWidth ignores transforms and overflowing text, so enter/exit animations can't skew it.
      const w = lis.reduce((sum, li) => sum + li.offsetWidth, 0) + g * lis.length;
      setSetW(w);
      setCopies(Math.max(2, Math.ceil(vp.clientWidth / Math.max(1, w)) + 1));
      setStepPx(lis[0].offsetWidth + g);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    (document as any).fonts?.ready?.then(measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [items.length, css, loading]);

  const { scrollY } = useScroll(scrollContainer ? { container: scrollContainer } : undefined);
  const scrollVelocity = useVelocity(scrollY);
  const dir = direction === "left" ? -1 : 1;

  useAnimationFrame((_, delta) => {
    if (!drifting || !inView || setW === 0 || dragging.current) return;
    if (hovered || focused || performance.now() < idleUntil.current) return;
    const dt = Math.min(delta, 64) / 1000;
    raw.set(raw.get() + dir * (speed + Math.abs(scrollVelocity.get()) * scrollBoost) * dt);
  });

  const hold = () => { idleUntil.current = performance.now() + resumeDelay * 1000; };
  const nudge = (n: number) => {
    hold();
    animate(raw, raw.get() - n * step * (stepPx || 160), reduce ? { duration: 0 } : { duration: D.slow, ease: E.out });
    if (liveRef.current) liveRef.current.textContent = n > 0 ? "Moved forward" : "Moved back";
  };
  const onPan = (_: unknown, info: PanInfo) => { dragging.current = true; raw.set(raw.get() + info.delta.x); };
  const onPanEnd = (_: unknown, info: PanInfo) => {
    dragging.current = false;
    hold();
    if (!reduce) animate(raw, raw.get() + info.velocity.x * 0.25, { type: "tween", duration: D.slow, ease: E.out });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); nudge(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-1); }
  };

  const hasHeader = eyebrow || title || titleMuted || subtitle;
  const fade = "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

  return (
    <section
      className={cx(scope, tone === "cream" ? "bg-cream" : "bg-white", "text-ink py-16 lg:py-24 overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label={typeof title === "string" ? title : eyebrow ?? "Carousel"}
    >
      <style>{css}</style>
      {hasHeader && (
        <div className="mx-auto max-w-container px-5 md:px-10 lg:px-16 mb-10 lg:mb-16">
          <Reveal className="flex flex-col items-start gap-6 max-w-prose">
            {eyebrow && <span className="inline-flex items-center rounded-pill bg-yellow text-ink px-4 py-2 text-overline uppercase">{eyebrow}</span>}
            {(title || titleMuted) && (
              <h2 className="m-0 font-display font-regular text-heading-xl">
                {title && <span className="block text-ink">{title}</span>}
                {titleMuted && <span className="block text-ink-muted">{titleMuted}</span>}
              </h2>
            )}
            {subtitle && <p className="m-0 font-body text-body-md lg:text-button-lg lg:leading-[1.5] text-ink-muted">{subtitle}</p>}
          </Reveal>
        </div>
      )}

      {loading ? (
        <div className="flex overflow-hidden px-5 md:px-10 lg:px-16" style={{ gap: "var(--lc-gap)", paddingTop: "var(--lc-pad)", paddingBottom: "var(--lc-pad)" }} aria-busy="true">
          {Array.from({ length: loadingCount }).map((_, i) => (
            <div key={i} className="shrink-0 flex flex-col items-center gap-4" style={{ width: "var(--lc-tile)" }}>
              <span className="ac-skeleton block" style={{ width: "var(--lc-tile)", height: "var(--lc-tile)", borderRadius: "var(--lc-radius)" }} />
              <span className="ac-skeleton block h-3 w-3/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-container px-5 md:px-10 lg:px-16">
          <p className="m-0 rounded-md bg-stone px-6 py-10 text-center font-body text-body-md text-ink-muted">{emptyText}</p>
        </div>
      ) : (
        <div className={cx("flex items-start", arrows && "gap-1 md:gap-3 px-1 md:px-4 lg:px-8")}>
          {arrows && <Arrow side="left" onClick={() => nudge(-1)} />}
          <div
            ref={viewportRef}
            tabIndex={0}
            onKeyDown={onKey}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
            className="ac-focus relative flex-1 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ paddingTop: "var(--lc-pad)", paddingBottom: "var(--lc-pad)", maskImage: fade, WebkitMaskImage: fade }}
            aria-label="Use left and right arrow keys to move"
          >
            <motion.div className="flex w-max" style={{ x, gap: "var(--lc-gap)", touchAction: "pan-y" }} onPan={onPan} onPanEnd={onPanEnd}>
              {Array.from({ length: copies }).map((_, c) => (
                <ul key={c} ref={c === 0 ? setRef : undefined} className="flex m-0 p-0" style={{ gap: "var(--lc-gap)" }} aria-hidden={c > 0 || undefined}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((it) => <Tile key={it.id} item={it} clone={c > 0} onItemClick={onItemClick} />)}
                  </AnimatePresence>
                </ul>
              ))}
            </motion.div>
            <p ref={liveRef} className="sr-only" aria-live="polite" />
          </div>
          {arrows && <Arrow side="right" onClick={() => nudge(1)} />}
        </div>
      )}
    </section>
  );
}
