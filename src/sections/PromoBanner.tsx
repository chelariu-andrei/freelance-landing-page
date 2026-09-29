import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cx } from "../lib/cx";
import { duration as D, ease as E } from "../tokens/motion";

export interface PromoBannerProps {
  /** Emphasised part, e.g. "$499 credit for first-time sign-ups." */
  highlight: React.ReactNode;
  /** The rest, e.g. "Your first month's on us — for a limited time." */
  children?: React.ReactNode;
  icon?: React.ReactNode;
  /** Makes the whole strip a link. */
  href?: string;
  /** ink = yellow highlight on dark (reference) · yellow = ink text on yellow. Default "ink". */
  tone?: "ink" | "yellow";
  /** Shows a close button; called when dismissed. */
  onDismiss?: () => void;
  /** Slide in on mount. Default true. */
  animated?: boolean;
  className?: string;
}

/** Announcement strip for offers and limited-time promos. */
export function PromoBanner({ highlight, children, icon, href, tone = "ink", onDismiss, animated = true, className }: PromoBannerProps) {
  const reduce = useReducedMotion();
  const ink = tone === "ink";
  const Comp: any = href ? "a" : "div";
  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      initial={animated ? { opacity: 0, y: reduce ? 0 : 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: D.slow, ease: E.out }}
      className={cx("relative", ink ? "bg-ink text-white ac-dark" : "bg-yellow text-ink", className)}
    >
      <Comp
        {...(href ? { href } : {})}
        className={cx("flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-12 py-5 lg:py-6 text-center no-underline text-current font-body", href && "ac-focus group")}
      >
        {icon && <span className={cx("inline-flex shrink-0", ink ? "text-white" : "text-ink")} aria-hidden>{icon}</span>}
        <strong className={cx("font-semibold text-button-lg lg:text-heading-lg lg:leading-tight tracking-[-0.01em]", ink ? "text-yellow" : "text-ink")}>{highlight}</strong>
        {children && <span className="text-button-lg lg:text-[1.875rem] lg:leading-tight">{children}</span>}
      </Comp>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss announcement" className="ac-focus absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full border-0 bg-transparent text-current cursor-pointer opacity-70 hover:opacity-100">
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>
      )}
    </motion.div>
  );
}
