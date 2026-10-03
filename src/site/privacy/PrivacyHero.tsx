"use client";
import { PageHero } from "@/site/PageHero";
import { content } from "@/content/content";

export function PrivacyHero() {
  const h = content.privacy.hero;
  return <PageHero current="/privacy" lines={h.lines} subtitle={h.subtitle} />;
}
