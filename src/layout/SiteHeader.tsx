import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cx } from "../lib/cx";
import { Button, type ButtonVariant } from "../primitives/Button";
import { Logo } from "../primitives/Logo";
import { duration as D, ease as E } from "../tokens/motion";

export interface NavLink { label: string; href: string; }
export interface HeaderCta { label: string; href: string; variant?: ButtonVariant; }

export interface SiteHeaderProps {
  links: NavLink[];
  /** Up to two CTAs; the last is usually the yellow primary. */
  ctas?: HeaderCta[];
  /** Logo slot. Default <Logo /> ("Ac."). */
  logo?: React.ReactNode;
  logoHref?: string;
  /** notch = cream tab cut into a dark hero frame · bar = plain cream bar. */
  variant?: "notch" | "bar";
  /** Colour of the notch tab — cream on ink frames (hero), white on cream frames (pricing). Default "cream". */
  notchTone?: "cream" | "white";
  /** Stick to the top while scrolling. Default true. */
  sticky?: boolean;
  /** Start with the mobile menu open (previews). */
  defaultOpen?: boolean;
  className?: string;
}

/** Site header. Desktop: logo · links · CTAs. Below lg: logo + ink hamburger disc opening a full-width panel. */
export function SiteHeader({ links, ctas = [], logo, logoHref = "/", variant = "bar", notchTone = "cream", sticky = true, defaultOpen = false, className }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const reduce = useReducedMotion();
  const panelId = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const notch = variant === "notch";
  return (
    <header className={cx(sticky ? "sticky top-0 z-50" : "relative z-10", notch ? "flex justify-center px-10 lg:px-32" : "bg-cream", className)}>
      <div style={notch && notchTone === "white" ? ({ ["--notch-bg" as any]: "var(--white)" } as React.CSSProperties) : undefined} className={cx("w-full flex items-center justify-between gap-6", notch ? "ac-notch max-w-container pl-6 pr-3 lg:px-8 h-20 lg:h-24" : "mx-auto max-w-container px-5 md:px-10 lg:px-16 h-20 lg:h-24")}>
        {logo ?? <Logo href={logoHref} size="md" />}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 m-0 p-0 list-none">
            {links.map((l) => (
              <li key={l.href}><a href={l.href} className="ac-focus rounded-sm font-body text-body-md text-ink no-underline hover:underline underline-offset-4">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {ctas.map((c, i) => <Button key={c.href + i} href={c.href} size="md" variant={c.variant ?? (i === ctas.length - 1 ? "primary" : "secondary")}>{c.label}</Button>)}
        </div>
        <button
          type="button"
          className="ac-focus lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white border-0 cursor-pointer"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} strokeWidth={1.75} aria-hidden /> : <Menu size={22} strokeWidth={1.75} aria-hidden />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            className="lg:hidden absolute left-2 right-2 top-full mt-2 rounded-lg bg-cream text-ink p-6 flex flex-col gap-6 z-50"
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: D.base, ease: E.out }}
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                {links.map((l) => (
                  <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="ac-focus rounded-sm font-display text-heading-lg text-ink no-underline">{l.label}</a></li>
                ))}
              </ul>
            </nav>
            {ctas.length > 0 && (
              <div className="flex flex-col gap-3">
                {ctas.map((c, i) => <Button key={c.href + i} href={c.href} fullWidth size="md" variant={c.variant ?? (i === ctas.length - 1 ? "primary" : "secondary")}>{c.label}</Button>)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
