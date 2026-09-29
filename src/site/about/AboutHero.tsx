"use client";
import { PageHero } from "@/site/PageHero";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function AboutHero() {
  const h = content.about.hero;
  return <PageHero current="/about" lines={h.lines} subtitle={h.subtitle} primaryCta={{ label: h.primaryCta, href: resolveHref(content.site.calLink) }} />;
}
