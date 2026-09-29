import * as React from "react";
import { cx } from "../lib/cx";
import { Button } from "../primitives/Button";
import { Logo } from "../primitives/Logo";
import type { NavLink } from "./SiteHeader";

export interface SocialLink { label: string; href: string; icon: React.ReactNode; }
export interface FooterColumn { title?: string; links: NavLink[]; }

export interface SiteFooterProps {
  tagline: React.ReactNode;
  /** Primary (white) + secondary (outline) CTAs under the tagline. */
  ctas?: { label: string; href: string }[];
  columns: FooterColumn[];
  socials?: SocialLink[];
  /** Large logo at the bottom. Default <Logo tone="white" size="xl" />. */
  logo?: React.ReactNode;
  copyright: string;
  legal?: NavLink[];
  className?: string;
}

/** Dark framed footer: tagline + CTAs, link columns, socials, oversized logo, legal row. */
export function SiteFooter({ tagline, ctas = [], columns, socials = [], logo, copyright, legal = [], className }: SiteFooterProps) {
  return (
    <footer className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className="ac-dark bg-ink text-white rounded-lg lg:rounded-xl px-6 lg:px-20 pt-10 lg:pt-40 pb-10 lg:pb-16 flex flex-col gap-16 lg:gap-32">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 lg:gap-6 order-1">
            {socials.length > 0 && (
              <ul className="flex lg:hidden gap-3 m-0 p-0 list-none">
                {socials.map((s) => <li key={s.href}><a href={s.href} aria-label={s.label} className="ac-focus inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-ink">{s.icon}</a></li>)}
              </ul>
            )}
            <p className="m-0 font-display text-heading-lg">{tagline}</p>
            <div className="flex flex-col items-start gap-4">
              {ctas.map((c, i) => <Button key={c.href + i} href={c.href} variant={i === 0 ? "light" : "outline"} size={i === 0 ? "md" : "lg"} className="lg:h-btn-lg">{c.label}</Button>)}
            </div>
          </div>
          {columns.map((col, ci) => (
            <nav key={ci} aria-label={col.title ?? "Footer"} className="col-span-1 lg:col-span-3 order-2">
              {col.title && <p className="m-0 mb-4 font-body text-sm text-muted-on-dark">{col.title}</p>}
              <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                {col.links.map((l) => <li key={l.href}><a href={l.href} className="ac-focus rounded-sm font-display text-nav-lg text-subtle-on-dark no-underline hover:text-white transition-colors duration-fast">{l.label}</a></li>)}
              </ul>
            </nav>
          ))}
          {socials.length > 0 && (
            <ul className="hidden lg:flex lg:col-span-4 lg:justify-end gap-6 m-0 p-0 list-none order-3">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="ac-focus rounded-pill inline-flex items-center gap-4 font-display text-button-lg text-white no-underline">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-ink">{s.icon}</span>{s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-8">
          {logo ?? <Logo tone="white" size="xl" />}
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-body text-sm text-subtle-on-dark">
            <span>{copyright}</span>
            {legal.map((l) => <a key={l.href} href={l.href} className="ac-focus rounded-sm text-subtle-on-dark no-underline hover:text-white">{l.label}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
