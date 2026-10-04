"use client";
import * as React from "react";
import { PageHero } from "@/site/PageHero";
import { HeroTerminal } from "@/site/HeroTerminal";
import { ArrowCta } from "@/primitives/ArrowCta";
import { Button } from "@/primitives/Button";
import { content } from "@/content/content";
import { CONTACT_FALLBACK } from "@/content/links";

/** Long paths would push the terminal line out of its frame; keep the start, which is what people recognise. */
const MAX_PATH = 28;
const shorten = (p: string) => (p.length > MAX_PATH ? `${p.slice(0, MAX_PATH - 1)}…` : p);
const decode = (p: string) => { try { return decodeURI(p); } catch { return p; } };

export function NotFoundHero() {
  const n = content.notFound;
  // The static 404.html is the same file for every address, so the visitor's own path is read on mount.
  // The terminal starts typing after its fade-in, so swapping the command here never shows.
  const [path, setPath] = React.useState("/this-page");
  React.useEffect(() => { setPath(shorten(decode(window.location.pathname))); }, []);

  const action = (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
      <ArrowCta size="lg" tone="yellow" label={n.primaryCta} hoverLabel={n.primaryCtaHover} href="/" />
      <Button href={CONTACT_FALLBACK} variant="ghost" className="text-white py-3">{n.secondaryCta}</Button>
    </div>
  );
  return (
    <PageHero
      current=""
      lines={n.lines}
      subtitle={n.subtitle}
      action={action}
      aside={
        <HeroTerminal
          {...n.terminal}
          command={`${n.terminal.command} ${path}`}
          className="w-full max-w-[30rem] lg:max-w-[34rem] xl:max-w-[37rem] lg:ml-auto"
        />
      }
    />
  );
}
