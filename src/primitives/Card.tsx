import * as React from "react";
import { motion } from "motion/react";
import { cx } from "../lib/cx";
import { usePressMotion } from "../motion/Reveal";

export type Surface = "white" | "cream" | "stone" | "yellow" | "ink";
export const surfaceClass: Record<Surface, string> = {
  white: "bg-white text-ink",
  cream: "bg-cream text-ink",
  stone: "bg-stone text-ink",
  yellow: "bg-yellow text-ink",
  ink: "bg-ink text-white ac-dark",
};

export interface CardProps {
  children: React.ReactNode;
  surface?: Surface;
  /** md = rows & small cards · lg = feature cards · xl = frames · 2xl = media panels. Default "lg". */
  radius?: "md" | "lg" | "xl" | "2xl";
  /** Inner padding step. Default "md" (24px). */
  padding?: "none" | "sm" | "md" | "lg";
  /** Lift + soft shadow on hover. Use only for clickable cards. */
  interactive?: boolean;
  href?: string;
  as?: "div" | "article" | "li" | "section";
  className?: string;
}

const rad = { md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", "2xl": "rounded-2xl" };
const pad = { none: "p-0", sm: "p-3", md: "p-6", lg: "p-8 lg:p-12" };

/** Flat rounded surface. No border, no shadow at rest — depth comes from placing white on cream, cream on stone, anything on ink. */
export function Card({ children, surface = "white", radius = "lg", padding = "md", interactive, href, as = "div", className }: CardProps) {
  const press = usePressMotion("card", !!interactive);
  const cls = cx(
    surfaceClass[surface], rad[radius], pad[padding],
    interactive && "ac-focus block no-underline text-current transition-shadow duration-base ease-out hover:shadow-hover cursor-pointer",
    className,
  );
  if (href) return <motion.a href={href} className={cls} {...press}>{children}</motion.a>;
  const Comp = (motion as any)[as];
  return <Comp className={cls} {...press}>{children}</Comp>;
}
