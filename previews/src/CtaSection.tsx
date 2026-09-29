import * as React from "react";
import { CtaSection } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root">
    <CtaSection title="See It In Action" subtitle="Let us show you how Ac. can sell your home faster." cta={{ label: "Get early access", hoverLabel: "Ready to join?", href: "#book" }} />
    <CtaSection tone="yellow" title="Ready to list?" cta={{ label: "Get a valuation", href: "#val" }} />
  </div>
);
