import * as React from "react";
import { SiteFooter, icons } from "ac";
import { mount, navLinks } from "./_data";
const { Linkedin } = icons;
mount(
  <div className="ac-root">
    <SiteFooter
      tagline={<>Your Next<br />Home, Found</>}
      ctas={[{ label: "Talk To Us", href: "#talk" }, { label: "Book a Viewing", href: "#book" }]}
      columns={[{ links: [{ label: "Careers", href: "#careers" }, ...navLinks.slice(0, 3)] }]}
      socials={[{ label: "LinkedIn", href: "#li", icon: <Linkedin size={26} strokeWidth={1.75} /> }]}
      copyright="Copyright © 2026 Ac."
      legal={[{ label: "Terms Of Use and Privacy Policy", href: "#legal" }]}
    />
  </div>
);
