import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";

export default function Page() {
  return (
    <>
      <main><PageHero current="/about" lines={content.about.hero.lines} /></main>
      <Footer />
    </>
  );
}
