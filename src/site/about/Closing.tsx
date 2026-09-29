"use client";
import dynamic from "next/dynamic";
import { Button } from "@/primitives/Button";
import { HighlightText } from "@/primitives/HighlightText";
import { content } from "@/content/content";
import { isSet, resolveHref } from "@/content/links";

function useClosingProps() {
  const c = content.about.closing;
  const primaryCta = { label: c.primaryCta, href: resolveHref(content.site.calLink) };
  const secondaryCta = isSet(content.site.linkedin) ? { label: c.secondaryCta, href: content.site.linkedin } : undefined;
  return { c, primaryCta, secondaryCta };
}

function StaticClosing() {
  const { c, primaryCta, secondaryCta } = useClosingProps();
  return (
    <section className="bg-cream px-2 lg:px-gutter py-2">
      <div className="bg-ink ac-dark rounded-lg lg:rounded-xl px-5 md:px-10 lg:px-16 py-16 lg:py-24 min-h-[480px] lg:min-h-[600px] flex flex-col items-center justify-center text-center gap-8">
        <h2 className="m-0 font-display font-regular text-display-lg max-w-[16ch] text-white">
          {c.title} <HighlightText variant="text">{c.highlight}</HighlightText>
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button href={primaryCta.href} size="lg" variant="primary">{primaryCta.label}</Button>
          {secondaryCta && <Button href={secondaryCta.href} size="lg" variant="outline">{secondaryCta.label}</Button>}
        </div>
      </div>
    </section>
  );
}

const DottedSurfaceSection = dynamic(() => import("@/sections/DottedSurfaceSection").then((m) => m.DottedSurfaceSection), {
  ssr: false,
  loading: StaticClosing,
});

export function Closing() {
  const { c, primaryCta, secondaryCta } = useClosingProps();
  return <DottedSurfaceSection mode="dark" height="md" speed={0.5} dotSize={6} title={c.title} highlight={c.highlight} primaryCta={primaryCta} secondaryCta={secondaryCta} />;
}
