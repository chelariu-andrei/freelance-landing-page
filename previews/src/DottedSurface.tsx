import * as React from "react";
import { DottedSurface, StatStatement, SectionHeading, Button, Card, Badge, icons } from "ac";
import { mount } from "./_data";
const { Clock, CornerRightDown, ArrowUpRight } = icons;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="m-0 mb-3 font-body text-caption font-medium uppercase tracking-[0.08em] text-ink-muted">{children}</p>
);

mount(
  <div className="ac-root flex flex-col gap-10 bg-white">
    <div>
      <Label>1 · White hero — default black dots, white fog</Label>
      <div className="relative h-[560px] rounded-xl overflow-hidden bg-white border border-solid border-line">
        <DottedSurface contained />
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8 text-center px-6">
          <h2 className="m-0 font-display font-regular text-display-lg text-ink">Find Your Home.</h2>
          <p className="m-0 font-body text-body-lg text-ink-muted max-w-prose">Listings, buyers and campaigns in one calm workflow.</p>
          <div className="flex gap-3"><Button size="lg">Book a Viewing</Button><Button size="lg" variant="outline-dark">Talk to Us</Button></div>
        </div>
      </div>
    </div>

    <div>
      <Label>2 · Cream section — ink dots, cream fog, softer and slower</Label>
      <div className="relative h-[420px] rounded-xl overflow-hidden bg-cream">
        <DottedSurface contained color="#1c1b1f" fogColor="#f9f6f0" opacity={0.6} size={7} speed={0.6} />
        <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
          <SectionHeading title={<>Homes that fit<br />how you live</>} subtitle="Use at 0.4–0.5 opacity behind headings so text stays the focus." />
        </div>
      </div>
    </div>

    <div>
      <Label>3 · Card texture — very low opacity inside a white card</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream p-6 rounded-xl">
        <div className="relative overflow-hidden rounded-lg bg-white h-[260px]">
          <DottedSurface contained opacity={0.3} size={6} speed={0.5} />
          <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
            <Badge tone="mint" size="md" className="self-start">+18% this month</Badge>
            <p className="m-0 font-display text-heading-lg">Buyer demand</p>
            <Button variant="ghost" className="mt-auto self-start" iconRight={<ArrowUpRight size={18} strokeWidth={1.75} />}>See the report</Button>
          </div>
        </div>
        <Card surface="white" className="h-[260px]"><p className="m-0 font-display text-heading-lg">Same card, no surface</p><p className="m-0 mt-2 text-sm text-ink-muted">For comparison.</p></Card>
      </div>
    </div>

    <div>
      <Label>4 · Integrated — StatStatement with a DottedSurface background</Label>
      <StatStatement
        className="rounded-xl py-24 lg:py-32"
        background={<DottedSurface contained color="#1c1b1f" fogColor="#f9f6f0" opacity={0.6} size={8} />}
        rows={[
          { parts: [{ kind: "text", text: "In days" }, { kind: "icon", icon: <Clock className="w-6 h-6 lg:w-16 lg:h-16" strokeWidth={1.75} />, label: "clock" }, { kind: "text", text: "not months" }], bubble: <CornerRightDown className="w-8 h-8 lg:w-24 lg:h-24" strokeWidth={1.75} /> },
          { parts: [{ kind: "text", text: "Up to" }, { kind: "value", text: "90%" }, { kind: "text", text: "less time on admin." }] },
        ]}
      />
    </div>
  </div>
);
