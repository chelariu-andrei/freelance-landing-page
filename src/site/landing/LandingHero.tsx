"use client";
import { PageHero } from "@/site/PageHero";
import { ArrowCta } from "@/primitives/ArrowCta";
import { Button } from "@/primitives/Button";
import { ArrowDown } from "lucide-react";
import { PipelineDiagram } from "@/site/PipelineDiagram";
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
      aside={
        <div className="rounded-lg border border-solid border-line-on-dark p-5 lg:p-8">
          <p className="m-0 mb-4 font-body text-overline uppercase text-muted-on-dark">{h.pipelineLabel}</p>
          <PipelineDiagram steps={h.pipeline} ariaLabel={h.pipelineAriaLabel} />
        </div>
      }
    />
  );
}
