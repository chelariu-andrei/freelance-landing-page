import * as React from "react";
import { PriceTag } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-cream rounded-lg p-8 flex flex-wrap items-end justify-between gap-8">
      <PriceTag amount={299} currency="€" period="/ mo" note="Billed monthly · 3-month term" size="lg" align="left" />
      <PriceTag amount="1.490" currency="RON" currencyPosition="after" period="/ lună" note="Facturat lunar" size="lg" />
    </div>
    <div className="ac-dark bg-ink rounded-lg p-8 flex flex-wrap gap-10 items-end">
      <PriceTag amount={49} currency="€" period="/ listing" size="md" tone="dark" align="left" note="One-off" />
      <PriceTag amount={0} currency="€" period="first month" size="md" tone="dark" align="left" />
    </div>
  </div>
);
