"use client";
import { Check } from "lucide-react";
import { FeatureStep } from "@/sections/FeatureStep";
import { visualFor } from "@/site/landing/ServiceVisuals";
import { ArrowCta } from "@/primitives/ArrowCta";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { CONTACT_FALLBACK } from "@/content/links";

export function Services() {
  const { services, servicesCta, servicesAriaLabel, serviceLabels } = content.landing;
  const cal = CONTACT_FALLBACK;
  return (
    <section id="service-details" aria-label={servicesAriaLabel}>
      {services.map((s, i) => (
        <FeatureStep
          key={s.id}
          id={`service-${s.id}`}
          number={s.number}
          label={s.label}
          tone={s.tone}
          mediaSide={i % 2 === 0 ? "right" : "left"}
          icon={iconFor(s.icon)}
          body={
            <div className="flex flex-col gap-8">
              {/* The problem, in the reader's words, carries the display voice; the engineering detail reads as body text. */}
              <p className="m-0">{s.forWho}</p>
              <div className="flex flex-col gap-3 font-body text-body-md text-ink">
                <p className="m-0"><strong className="font-medium">{serviceLabels.youGet}</strong> {s.youGet}</p>
                <p className="m-0"><strong className="font-medium">{serviceLabels.outcome}</strong> {s.outcome}</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="m-0 font-body text-body-md font-medium text-ink">{serviceLabels.safeguards}</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-2 font-body text-body-md text-ink">
                  {s.safeguards.map((g) => (
                    <li key={g} className="flex gap-3">
                      <span aria-hidden className={`mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.tone === "yellow" ? "bg-ink text-yellow" : "bg-yellow text-ink"}`}>
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="m-0 font-body text-sm text-ink-muted">{serviceLabels.stack}</p>
                <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                  {s.stack.map((t) => (
                    <li key={t} className="rounded-pill border border-solid border-ink px-3 py-1 font-body text-sm text-ink">{t}</li>
                  ))}
                </ul>
              </div>
              <ArrowCta size="lg" label={servicesCta} href={cal} tone={s.tone === "yellow" ? "white" : "yellow"} className="self-start" />
            </div>
          }
          media={
            <>
              {visualFor(s.id, s.visual)}
              {content.site.pricingMode === "from" && <p className="m-0 mt-5 font-body text-body-md text-ink-muted">{s.price}</p>}
            </>
          }
        />
      ))}
    </section>
  );
}
