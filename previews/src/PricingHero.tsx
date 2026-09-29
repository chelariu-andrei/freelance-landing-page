import * as React from "react";
import { PricingHero, SiteHeader, PromoBanner, icons } from "ac";
import { mount, navLinks, headerCtas } from "./_data";
const { Gift } = icons;
mount(
  <div className="ac-root">
    <PricingHero
      header={<SiteHeader variant="notch" notchTone="white" sticky={false} links={navLinks} ctas={headerCtas} />}
      title={<>List it. Show it.<br />Sell it each month.</>}
      subtitle="From pricing and buyer discovery to photography and multi-portal listings, one plan covers every step of selling a home."
      planLabel="Seller plan"
      price={{ amount: 299, currency: "€", period: "/ mo", note: "Billed monthly · 3-month term" }}
      cta={{ label: "Start your 3 months", href: "#start" }}
      banner={<PromoBanner icon={<Gift size={32} strokeWidth={1.75} />} highlight="Free photoshoot for new listings.">Your first month's on us — for a limited time.</PromoBanner>}
    />
  </div>
);
