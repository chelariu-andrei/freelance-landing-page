import type { Metadata } from "next";
import { content } from "@/content/content";
import { isSet } from "@/content/links";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || content.site.url).replace(/\/$/, "");

export function pageMetadata(key: "landing" | "about" | "expertise", path: string): Metadata {
  const { title, description } = content.seo[key];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: content.site.name, type: "website", locale: "en" },
    twitter: { card: "summary", title, description },
    ...(key === "expertise" ? { robots: { index: false, follow: true } } : {}),
  };
}

export function jsonLd(): string {
  const { name, role, linkedin, github, areaServed } = content.site;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${SITE_URL}/#person`, name, jobTitle: role, url: SITE_URL, sameAs: [linkedin, github].filter(isSet) },
      { "@type": "ProfessionalService", "@id": `${SITE_URL}/#service`, name: `${name}, ${role}`, url: SITE_URL, description: content.seo.landing.description, provider: { "@id": `${SITE_URL}/#person` }, areaServed },
    ],
  };
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
