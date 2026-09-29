import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";
import { pageMetadata } from "@/site/seo";

export const metadata = pageMetadata("expertise", "/expertise");

export default function ExpertisePage() {
  const h = content.expertise.hero;
  return (
    <>
      <main>
        <PageHero current="/expertise" lines={h.lines} subtitle={h.subtitle} primaryCta={h.primaryCta} />
      </main>
      <Footer />
    </>
  );
}
