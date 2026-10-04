"use client";
import * as React from "react";
import { HeroSection, type HeroLine } from "@/sections/HeroSection";
import { SiteHeader } from "@/layout/SiteHeader";
import { content } from "@/content/content";
import { CONTACT_FALLBACK } from "@/content/links";

export interface PageHeroProps {
  current: string;
  lines: HeroLine[];
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  aside?: React.ReactNode;
  media?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHero({ current, ...hero }: PageHeroProps) {
  return (
    <HeroSection
      {...hero}
      header={
        <SiteHeader
          variant="notch"
          sticky={false}
          links={content.nav.links}
          ctas={[{ label: content.nav.cta, href: CONTACT_FALLBACK, variant: "primary" }]}
          currentHref={current}
          pinCtaOnMobile
        />
      }
    />
  );
}
