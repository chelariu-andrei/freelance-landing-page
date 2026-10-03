import * as React from "react";
import { motion } from "framer-motion";
import { cx } from "../lib/cx";
import { usePressMotion } from "../motion/Reveal";

export type ButtonVariant = "primary" | "secondary" | "light" | "outline" | "outline-dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** primary = yellow · secondary = ink · light = white (on dark) · outline = hairline on dark · outline-dark = hairline on light · ghost = text only */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a link. */
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  /** Hover scale / press micro-interaction. Default true (off under reduced motion). */
  animated?: boolean;
  children?: React.ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-0 bg-yellow text-ink hover:bg-yellow-hover",
  secondary: "border-0 bg-ink text-white hover:bg-black",
  light: "border-0 bg-white text-ink hover:bg-cream",
  outline: "bg-transparent text-white border border-solid border-line-on-dark hover:bg-white hover:text-ink",
  "outline-dark": "bg-transparent text-ink border border-solid border-ink hover:bg-ink hover:text-white",
  ghost: "border-0 bg-transparent text-current underline-offset-4 hover:underline",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-btn-sm px-5 text-button-sm gap-2",
  md: "h-btn-md px-8 text-button gap-2",
  lg: "h-btn-lg px-10 text-button-lg gap-3",
};

export const buttonClasses = (variant: ButtonVariant = "primary", size: ButtonSize = "md", fullWidth = false, extra?: string) =>
  cx(
    "ac-focus inline-flex items-center justify-center rounded-pill font-body font-regular whitespace-nowrap no-underline cursor-pointer",
    "transition-colors duration-fast ease-out select-none",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:pointer-events-none",
    variantClass[variant], variant === "ghost" ? "h-auto px-0 text-button gap-2" : sizeClass[size], fullWidth && "w-full", extra,
  );

/** Pill button. Every CTA in the system is a pill; yellow is reserved for the single most important action in view. */
export function Button({
  variant = "primary", size = "md", href, iconLeft, iconRight, fullWidth, animated = true, className, children, disabled, ref, ...rest
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement> }) {
  const press = usePressMotion("button", animated && !disabled);
  const cls = buttonClasses(variant, size, fullWidth, className);
  const inner = (<>{iconLeft}{children != null && <span>{children}</span>}{iconRight}</>);
  if (href) {
    return (
      <motion.a ref={ref as any} href={disabled ? undefined : href} aria-disabled={disabled || undefined} className={cls} {...press} {...(rest as any)}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button ref={ref as any} type="button" disabled={disabled} className={cls} {...press} {...(rest as any)}>
      {inner}
    </motion.button>
  );
}
