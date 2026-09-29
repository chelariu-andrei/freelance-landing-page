"use client";
import { CtaSection } from "@/sections/CtaSection";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function Contact() {
  const c = content.landing.contact;
  return (
    <div id="contact">
      <CtaSection tone="ink" title={c.title} subtitle={c.subtitle} cta={{ label: c.cta, hoverLabel: c.ctaHover, href: resolveHref(content.site.calLink) }} />
    </div>
  );
}
