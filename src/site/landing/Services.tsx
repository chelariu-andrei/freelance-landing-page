"use client";
import { FeatureStep } from "@/sections/FeatureStep";
import { Card } from "@/primitives/Card";
import { CheckItem } from "@/primitives/CheckItem";
import { ArrowCta } from "@/primitives/ArrowCta";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function Services() {
  const { services, servicesCta, servicesAriaLabel, serviceLabels, servicesMediaTitle } = content.landing;
  const cal = resolveHref(content.site.calLink);
  return (
    <section id="services" aria-label={servicesAriaLabel}>
      {services.map((s, i) => (
        <FeatureStep
          key={s.id}
          number={s.number}
          label={s.label}
          tone={s.tone}
          mediaSide={i % 2 === 0 ? "right" : "left"}
          icon={iconFor(s.icon)}
          body={
            <div className="flex flex-col gap-4">
              <p className="m-0"><strong>{serviceLabels.forWho}</strong> {s.forWho}</p>
              <p className="m-0"><strong>{serviceLabels.youGet}</strong> {s.youGet}</p>
              <p className="m-0"><strong>{serviceLabels.outcome}</strong> {s.outcome}</p>
              <ArrowCta label={servicesCta} href={cal} tone={s.tone === "yellow" ? "white" : "yellow"} className="self-start" />
            </div>
          }
          media={
            <Card surface="white" radius="xl" padding="lg">
              <p className="m-0 mb-5 font-display text-heading-lg">{servicesMediaTitle}</p>
              <ul className="flex flex-col gap-3">
                {s.deliverables.map((d) => <CheckItem key={d}>{d}</CheckItem>)}
              </ul>
              {content.site.pricingMode === "from" && <p className="m-0 mt-5 font-body text-body-md text-ink-muted">{s.price}</p>}
            </Card>
          }
        />
      ))}
    </section>
  );
}
