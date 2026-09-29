import * as React from "react";
import { HeroSection, SiteHeader, CampaignCard, SignalCard } from "ac";
import { mount, navLinks, headerCtas, metrics, people } from "./_data";
mount(
  <div className="ac-root">
    <HeroSection
      header={<SiteHeader variant="notch" sticky={false} links={navLinks} ctas={headerCtas} />}
      lines={[{ text: "Find Your Home." }, { text: "Sell With Confidence." }, { text: "Start Your", highlight: "Next Move." }]}
      subtitle="Ac. brings listings, buyers and campaigns into one workflow, so every property reaches the right people faster."
      primaryCta={{ label: "Book a Viewing", href: "#book" }}
      secondaryCta={{ label: "Talk to Us", href: "#talk" }}
      aside={
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <CampaignCard className="md:col-span-7" title="Spring open-house week" objective="Awareness" channels="Portals, Instagram, Facebook" metrics={metrics.slice(0, 6)} />
          <SignalCard className="md:col-span-5" title="Buyer Signal" delta="+92%" people={people} extraCount={12} />
        </div>
      }
    />
  </div>
);
