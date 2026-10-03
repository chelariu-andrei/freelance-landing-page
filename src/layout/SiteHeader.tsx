import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  /** Stick to the top while scrolling. Default true. When false the header stays in flow (inside a hero frame) and a floating copy slides in on scroll-up. */
  sticky?: boolean;
  /** Hide on scroll down, reveal on any scroll up. Default true. */
  hideOnScroll?: boolean;
  /** Start with the mobile menu open (previews). */
  defaultOpen?: boolean;
  /** Href of the current page; that link gets aria-current="page". */
  currentHref?: string;
  /** Below lg, keep the last CTA visible next to the menu button. */
  pinCtaOnMobile?: boolean;
  className?: string;
}

const STUCK_AFTER = 120; // px scrolled before the header counts as "left behind"
const JITTER = 6;        // px of movement ignored as noise

/** `stuck` once scrolled past the in-flow header; `up` reflects the latest scroll direction. */
function useScrollReveal(enabled: boolean) {
  const [state, setState] = React.useState({ stuck: false, up: false });
  React.useEffect(() => {
    if (!enabled) return;
    let last = Math.max(0, window.scrollY);
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY); // ignore iOS rubber-band
      const d = y - last;
      const stuck = y > STUCK_AFTER;
      if (Math.abs(d) >= JITTER) {
        last = y;
        setState((s) => (s.stuck === stuck && s.up === d < 0 ? s : { stuck, up: d < 0 }));
      } else {
        setState((s) => (s.stuck === stuck ? s : { ...s, stuck }));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [enabled]);
  return state;
}

/** Renders overlays on <body> so hero stacking contexts and overflow can never cover or clip them. */
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted ? createPortal(<div className="ac-root">{children}</div>, document.body) : null;
}

/** Site header. Desktop: logo · links · CTAs. Below lg: logo + ink hamburger disc opening a full-width cream sheet. */
export function SiteHeader({ links, ctas = [], logo, logoHref = "/", variant = "bar", notchTone = "cream", sticky = true, hideOnScroll = true, defaultOpen = false, currentHref, pinCtaOnMobile = false, className }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const reduce = useReducedMotion();
  const panelId = React.useId();
  const { stuck, up } = useScrollReveal(hideOnScroll);
  const logoNode = logo ?? <Logo href={logoHref} size="md" />;

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const notch = variant === "notch";
  const floating = hideOnScroll && !sticky;
  const floatingShown = floating && stuck && up;
  const stickyHidden = hideOnScroll && sticky && stuck && !up && !open;
  const slide = { duration: reduce ? 0.01 : D.base, ease: E.out };

  const menuButton = (
    <button
      type="button"
      className="ac-focus inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white border-0 cursor-pointer"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={() => setOpen((o) => !o)}
    >
      {open ? <X size={22} strokeWidth={1.75} aria-hidden /> : <Menu size={22} strokeWidth={1.75} aria-hidden />}
    </button>
  );

  const desktopNav = (label: string) => (
    <>
      <nav aria-label={label} className="hidden lg:block">
        <ul className={"flex items-center gap-10 m-0 p-0 list-none"}>
          {links.map((l) => (
            <li key={l.href}><a href={l.href} aria-current={l.href === currentHref ? "page" : undefined} className="ac-focus rounded-sm font-body text-body-lg text-ink no-underline hover:underline underline-offset-4">{l.label}</a></li>
          ))}
        </ul>
      </nav>
      <div className="hidden lg:flex items-center gap-3">
        {ctas.map((c, i) => <Button key={c.href + i} href={c.href} size="lg" variant={c.variant ?? (i === ctas.length - 1 ? "primary" : "secondary")}>{c.label}</Button>)}
      </div>
    </>
  );

  const mobileControls = (
    <div className="lg:hidden flex items-center gap-2">
      {pinCtaOnMobile && ctas.length > 0 && (() => {
        const c = ctas[ctas.length - 1];
        return <Button href={c.href} size="sm" variant={c.variant ?? "primary"}>{c.label}</Button>;
      })()}
      {menuButton}
    </div>
  );

  return (
    <header className={cx(sticky ? "sticky top-0 z-50" : "relative z-10", notch ? "flex justify-center px-10 lg:px-32" : "bg-cream", sticky && "transition-transform duration-fast ease-out motion-reduce:transition-none", stickyHidden && "-translate-y-full", className)}>
      <div style={notch && notchTone === "white" ? ({ ["--notch-bg" as any]: "var(--white)" } as React.CSSProperties) : undefined} className={cx("w-full flex items-center justify-between gap-6", notch ? "ac-notch max-w-[1380px] pl-6 pr-3 lg:px-10 h-20 lg:h-[7rem]" : "mx-auto max-w-container px-5 md:px-10 lg:px-16 lg:h-[7rem] h-20")}>
        {logoNode}
        {desktopNav("Main")}
        {mobileControls}
      </div>

      <BodyPortal>
      {floating && (
        <motion.div
          className="fixed inset-x-2 top-2 lg:inset-x-gutter lg:top-0 z-50"
          initial={false}
          animate={{ y: floatingShown ? 0 : "-130%", opacity: floatingShown ? 1 : 0 }}
          transition={slide}
          aria-hidden={floatingShown ? undefined : true}
          inert={!floatingShown}
        >
          {/* Mobile: floating pill */}
          <div className="lg:hidden flex items-center justify-between gap-6 h-16 pl-5 pr-2 rounded-lg bg-cream shadow-[0_8px_24px_-8px_rgba(20,20,26,0.35)]">
            {logoNode}
            {mobileControls}
          </div>
          {/* Desktop: the hero notch tab hanging from a cream page margin, so the bar reads as part of the frame */}
          <div className="hidden lg:block relative">
            <div aria-hidden className="absolute inset-x-0 top-0 h-2 bg-cream" />
            <div className="relative flex justify-center px-32 pt-2">
              <div
                style={notchTone === "white" ? ({ ["--notch-bg" as any]: "var(--white)" } as React.CSSProperties) : undefined}
                className="ac-notch w-full max-w-[1380px] flex items-center justify-between gap-8 h-[7rem] px-10"
              >
                {logoNode}
                {desktopNav("Main (floating)")}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="lg:hidden fixed inset-0 z-[55]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : D.base }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="panel"
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="lg:hidden fixed inset-x-0 top-0 z-[60] bg-cream text-ink rounded-b-2xl pb-10 shadow-[0_16px_40px_-12px_rgba(20,20,26,0.4)]"
              initial={{ opacity: 0, y: reduce ? 0 : -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -24 }}
              transition={{ duration: reduce ? 0.01 : D.base, ease: E.out }}
            >
              <div className="flex items-center justify-between h-20 pl-5 pr-3">
                {logoNode}
                {menuButton}
              </div>
              <nav aria-label="Mobile" className="px-5 pt-6">
                <ul className="flex flex-col m-0 p-0 list-none">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} aria-current={l.href === currentHref ? "page" : undefined} onClick={() => setOpen(false)} className="ac-focus rounded-sm block py-3 font-body text-body-lg text-ink no-underline">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
              {ctas.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-3 px-5">
                  {ctas.map((c, i) => <Button key={c.href + i} href={c.href} size="md" variant={c.variant ?? (i === ctas.length - 1 ? "primary" : "secondary")}>{c.label}</Button>)}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </BodyPortal>
    </header>
  );
}
