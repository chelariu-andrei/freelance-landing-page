"use client";
import { PageHero } from "@/site/PageHero";
import { ArrowCta } from "@/primitives/ArrowCta";
import { Button } from "@/primitives/Button";
import { ArrowDown } from "lucide-react";
import { HeroTerminal } from "@/site/HeroTerminal";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function LandingHero() {
  const h = content.landing.hero;
  // One yellow action; the secondary is a quiet text link so the eye lands on booking first.
  const action = (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
      <ArrowCta size="lg" tone="yellow" label={h.primaryCta} hoverLabel={h.primaryCtaHover} href={resolveHref(content.site.calLink)} />
      <Button href={h.secondaryCta.href} variant="ghost" iconRight={<ArrowDown size={18} strokeWidth={1.75} aria-hidden />} className="text-white py-3">{h.secondaryCta.label}</Button>
    </div>
  );
  return (
    <PageHero
      current="/"
      lines={h.lines}
      subtitle={<>{h.subtitle}<span className="block mt-4 font-body text-body-md text-muted-on-dark">{h.trust}</span></>}
      action={action}
      aside={<HeroTerminal {...h.terminal} className="w-full max-w-[30rem] lg:max-w-[34rem] xl:max-w-[37rem] lg:ml-auto" />}
    />
  );
}
