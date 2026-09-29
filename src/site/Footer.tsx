"use client";
import { Linkedin, Github } from "lucide-react";
import { SiteFooter } from "@/layout/SiteFooter";
import { content } from "@/content/content";
import { isSet, mailtoHref, resolveHref } from "@/content/links";

export interface FooterProps {
  year: number;
}

export function Footer({ year }: FooterProps) {
  const { site, nav, footer } = content;
  const connect = [
    ...(isSet(site.linkedin) ? [{ label: footer.linkedinLabel, href: site.linkedin }] : []),
    ...(isSet(site.github) ? [{ label: footer.githubLabel, href: site.github }] : []),
    ...(isSet(site.email) ? [{ label: footer.emailLabel, href: mailtoHref(site.email) }] : []),
    { label: nav.cta, href: resolveHref(site.calLink) },
  ];
  const socials = [
    ...(isSet(site.linkedin) ? [{ label: footer.linkedinLabel, href: site.linkedin, icon: <Linkedin size={26} strokeWidth={1.75} /> }] : []),
    ...(isSet(site.github) ? [{ label: footer.githubLabel, href: site.github, icon: <Github size={26} strokeWidth={1.75} /> }] : []),
  ];
  return (
    <SiteFooter
      tagline={footer.tagline}
      ctas={[{ label: nav.cta, href: resolveHref(site.calLink) }]}
      columns={[{ title: footer.pagesTitle, links: nav.links }, { title: footer.connectTitle, links: connect }]}
      socials={socials}
      copyright={`© ${year} ${site.name} · ${footer.privacy}`}
    />
  );
}
