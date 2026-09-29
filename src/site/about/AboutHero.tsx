"use client";
import { PageHero } from "@/site/PageHero";
import { ArrowCta } from "@/primitives/ArrowCta";
import { content } from "@/content/content";
import { isSet } from "@/content/links";

export function AboutHero() {
  const h = content.about.hero;
  const { photo, europass } = content.site;
  const media = isSet(photo) ? (
    <img src={photo} alt={content.about.orbit.photoAlt} width={1086} height={1448} className="block h-full w-auto max-w-none" />
  ) : undefined;
  const action = isSet(europass) ? (
    <ArrowCta size="lg" tone="yellow" hoverTone="ink" label={h.cvCta} hoverLabel={h.cvCtaHover} href={europass} newTab className="self-start" />
  ) : undefined;
  return <PageHero current="/about" lines={h.lines} subtitle={h.subtitle} media={media} action={action} />;
}
