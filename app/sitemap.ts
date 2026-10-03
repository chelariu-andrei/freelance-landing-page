import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about", "/privacy"].map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : p === "/privacy" ? 0.3 : 0.8 }));
}
