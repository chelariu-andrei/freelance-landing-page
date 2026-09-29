import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";

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
