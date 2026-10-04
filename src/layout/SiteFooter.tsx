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
  /** Small heading above the socials column. */
  socialsTitle?: string;
  /** Large logo at the bottom. Default <Logo tone="white" size="xl" />. */
  logo?: React.ReactNode;
  copyright: string;
  legal?: NavLink[];
  className?: string;
}

const linkCls = "ac-focus rounded-sm inline-flex items-center min-h-10 font-display text-nav-lg text-subtle-on-dark no-underline hover:text-white transition-colors duration-fast";
/** Social/CV links always open in a new tab; mailto: hands off to the mail app and never navigates the site. */
const newTab = (href: string) => !/^mailto:/i.test(href);

/** Dark framed footer: tagline + CTA, "Pages" and icon-led "Connect" columns on one shared row grid, oversized logo, legal row. */
export function SiteFooter({ tagline, ctas = [], columns, socials = [], socialsTitle, logo, copyright, legal = [], className }: SiteFooterProps) {
  return (
    <footer className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className="ac-dark bg-ink text-white rounded-lg lg:rounded-xl px-6 lg:px-20 pt-12 lg:pt-32 pb-10 lg:pb-16 flex flex-col gap-16 lg:gap-28">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-2 lg:col-span-6 flex flex-col items-start gap-8">
            <p className="m-0 max-w-[20ch] font-display text-heading-lg">{tagline}</p>
            {ctas.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {ctas.map((c, i) => <Button key={c.href + i} href={c.href} variant={i === 0 ? "light" : "outline"} size="lg">{c.label}</Button>)}
              </div>
            )}
          </div>
          {columns.map((col, ci) => (
            <nav key={ci} aria-label={col.title ?? "Footer"} className="col-span-1 lg:col-span-3">
              {col.title && <p className="m-0 mb-4 font-body text-sm text-muted-on-dark">{col.title}</p>}
              <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                {col.links.map((l) => <li key={l.href}><a href={l.href} className={linkCls}>{l.label}</a></li>)}
              </ul>
            </nav>
          ))}
          {socials.length > 0 && (
            <div className="col-span-1 lg:col-span-3">
              {socialsTitle && <p className="m-0 mb-4 font-body text-sm text-muted-on-dark">{socialsTitle}</p>}
              <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      {...(newTab(s.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group ac-focus rounded-pill inline-flex items-center gap-3 min-h-10 font-display text-nav-lg text-subtle-on-dark no-underline hover:text-white transition-colors duration-fast"
                    >
                      <span className="inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white text-ink transition-colors duration-fast group-hover:bg-yellow [&>svg]:w-5 [&>svg]:h-5" aria-hidden>{s.icon}</span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-8">
          {logo ?? <Logo tone="white" size="xl" href="/" />}
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-body text-sm text-subtle-on-dark">
            <span>{copyright}</span>
            {legal.map((l) => <a key={l.href} href={l.href} className="ac-focus rounded-sm text-subtle-on-dark no-underline hover:text-white">{l.label}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
