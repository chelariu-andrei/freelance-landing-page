import * as React from "react";
import { ArrowCta } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="ac-dark bg-ink rounded-lg p-10 flex flex-col items-center gap-8">
      <p className="m-0 font-body text-caption uppercase tracking-[0.08em] text-muted-on-dark">Hover or Tab to it — colour sweeps left → right, the disc travels, the text changes</p>
      <ArrowCta label="Get early access" hoverLabel="Ready to join?" href="#join" />
      <ArrowCta label="Book a Viewing" hoverLabel="Pick a time" href="#book" size="lg" />
    </div>
    <div className="bg-yellow rounded-lg p-10 flex flex-col items-center gap-6">
      <ArrowCta label="Get a valuation" hoverLabel="Takes 2 minutes" tone="white" hoverTone="white" href="#val" size="lg" />
      <ArrowCta label="Nudge only" hoverEffect="nudge" href="#x" size="lg" />
    </div>
  </div>
);
