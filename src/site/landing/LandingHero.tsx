"use client";
import { PageHero } from "@/site/PageHero";
import { PipelineDiagram } from "@/site/PipelineDiagram";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function LandingHero() {
  const h = content.landing.hero;
  return (
    <PageHero
      current="/"
      lines={h.lines}
      subtitle={<>{h.subtitle}<span className="block mt-4 font-body text-body-md text-muted-on-dark">{h.trust}</span></>}
      primaryCta={{ label: h.primaryCta, href: resolveHref(content.site.calLink) }}
      secondaryCta={h.secondaryCta}
      aside={
        <div className="rounded-lg border border-solid border-line-on-dark p-5 lg:p-8">
          <p className="m-0 mb-4 font-body text-overline uppercase text-muted-on-dark">{h.pipelineLabel}</p>
          <PipelineDiagram steps={h.pipeline} ariaLabel={h.pipelineAriaLabel} />
        </div>
      }
    />
  );
}
