import * as React from "react";
import { CtaBanner } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root">
    <CtaBanner title="Three months to prove it." cta={{ label: "Let's connect", href: "#contact" }} />
    <CtaBanner tone="ink" title="Selling this year?" subtitle="Get a free valuation in 48 hours." cta={{ label: "Let's connect", href: "#contact" }} secondaryCta={{ label: "See pricing", href: "#pricing" }} />
    <CtaBanner tone="white" title="Questions about the plan?" cta={{ label: "Let's connect", href: "#contact" }} arrow={false} />
  </div>
);
