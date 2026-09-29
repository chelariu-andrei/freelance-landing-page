import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { duration as D, ease as E, distance as DIST, stagger as S } from "../tokens/motion";

export type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "scale";

export interface RevealProps {
  children: React.ReactNode;
  /** Entrance style. Default "up". */
  variant?: RevealVariant;
  /** Seconds. Default motion token duration.slow (0.6). */
  duration?: number;
  /** Seconds before starting. Default 0. */
  delay?: number;
  /** Cubic-bezier. Default ease.out. */
  ease?: [number, number, number, number];
  /** Travel distance in px for slide variants. Default distance.md (24). */
  distance?: number;
  /** Play only the first time it enters the viewport. Default true. */
  once?: boolean;
  /** Fraction of the element visible before it plays (0–1). Default 0.2. */
  amount?: number;
  /** Play on mount instead of on scroll (hero entrance). Default false. */
  immediate?: boolean;
  as?: "div" | "section" | "li" | "span" | "article" | "header" | "footer";
  className?: string;
}

function offset(variant: RevealVariant, d: number) {
  switch (variant) {
    case "up": return { y: d };
    case "down": return { y: -d };
    case "left": return { x: d };
    case "right": return { x: -d };
    case "scale": return { scale: 0.96 };
    default: return {};
  }
}

export function revealVariants(variant: RevealVariant = "up", d: number = DIST.md, reduce = false): Variants {
  if (reduce) return { hidden: { opacity: 0 }, show: { opacity: 1 } };
  return {
    hidden: { opacity: 0, ...offset(variant, d) },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  };
}

/** Scroll-reveal wrapper. Fades/slides its child in when it enters the viewport; opacity-only under prefers-reduced-motion. */
export function Reveal({
  children, variant = "up", duration = D.slow, delay = 0, ease = E.out, distance = DIST.md,
  once = true, amount = 0.2, immediate = false, as = "div", className,
}: RevealProps) {
  const reduce = !!useReducedMotion();
  const Comp = (motion as any)[as];
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once, amount } };
  return (
    <Comp
      className={className}
      initial="hidden"
      {...trigger}
      variants={revealVariants(variant, distance, reduce)}
      transition={{ duration: reduce ? D.fast : duration, delay, ease }}
    >
      {children}
    </Comp>
  );
}

export interface StaggerProps extends Omit<RevealProps, "variant" | "distance"> {
  /** Seconds between children. Default stagger.base (0.1). */
  stagger?: number;
}

/** Parent that staggers its <StaggerItem> children in sequence. */
export function Stagger({
  children, stagger = S.base, delay = 0, once = true, amount = 0.2, immediate = false, as = "div", className,
}: StaggerProps) {
  const Comp = (motion as any)[as];
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once, amount } };
  return (
    <Comp
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  distance?: number;
  duration?: number;
  ease?: [number, number, number, number];
  as?: RevealProps["as"];
  className?: string;
}

/** One child of <Stagger>. */
export function StaggerItem({
  children, variant = "up", distance = DIST.md, duration = D.slow, ease = E.out, as = "div", className,
}: StaggerItemProps) {
  const reduce = !!useReducedMotion();
  const Comp = (motion as any)[as];
  const base = revealVariants(variant, distance, reduce);
  return (
    <Comp
      className={className}
      variants={{ hidden: base.hidden, show: { ...(base.show as object), transition: { duration: reduce ? D.fast : duration, ease } } }}
    >
      {children}
    </Comp>
  );
}

/** Shared hover/press micro-interaction for buttons and interactive cards. */
export function usePressMotion(kind: "button" | "card" = "button", enabled = true) {
  const reduce = !!useReducedMotion();
  if (!enabled || reduce) return {};
  return kind === "button"
    ? { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, transition: { duration: D.fast, ease: E.out } }
    : { whileHover: { y: -4 }, whileTap: { scale: 0.99 }, transition: { duration: D.base, ease: E.out } };
}
