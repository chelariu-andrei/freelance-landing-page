import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";

export default function Page() {
  return (
    <>
      <main><PageHero current="/" lines={content.landing.hero.lines} /></main>
      <Footer />
    </>
  );
}
