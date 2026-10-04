"use client";
import { Mail, FileUser } from "lucide-react";
import { Linkedin, Github } from "@/icons/brand";
import { SiteFooter } from "@/layout/SiteFooter";
import { content } from "@/content/content";
import { CONTACT_FALLBACK, isSet, mailtoHref } from "@/content/links";

export interface FooterProps {
  year: number;
}

export function Footer({ year }: FooterProps) {
  const { site, nav, footer } = content;
  const icon = (I: typeof Linkedin) => <I strokeWidth={1.75} />;
  const socials = [
    ...(isSet(site.linkedin) ? [{ label: footer.linkedinLabel, href: site.linkedin, icon: icon(Linkedin) }] : []),
    ...(isSet(site.github) ? [{ label: footer.githubLabel, href: site.github, icon: icon(Github) }] : []),
    ...(isSet(site.email) ? [{ label: footer.emailLabel, href: mailtoHref(site.email), icon: icon(Mail) }] : []),
    ...(isSet(site.europass) ? [{ label: footer.europassLabel, href: site.europass, icon: icon(FileUser) }] : []),
  ];
  return (
    <SiteFooter
      tagline={footer.tagline}
      ctas={[{ label: nav.cta, href: CONTACT_FALLBACK }]}
      columns={[{ title: footer.pagesTitle, links: [...nav.links, footer.privacyLink] }]}
      socials={socials}
      socialsTitle={footer.connectTitle}
      copyright={`© ${year} ${site.name} · ${footer.privacy}`}
    />
  );
}
