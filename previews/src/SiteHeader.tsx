import * as React from "react";
import { SiteHeader } from "ac";
import { mount, navLinks, headerCtas } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-cream rounded-lg overflow-hidden"><SiteHeader links={navLinks} ctas={headerCtas} sticky={false} /></div>
    <div className="bg-ink rounded-xl h-40"><SiteHeader variant="notch" links={navLinks} ctas={headerCtas} sticky={false} /></div>
  </div>
);
