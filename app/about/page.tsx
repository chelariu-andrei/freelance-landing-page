import { AboutHero } from "@/site/about/AboutHero";
import { Orbit } from "@/site/about/Orbit";
import { Experience } from "@/site/about/Experience";
import { Matrix } from "@/site/about/Matrix";
import { StackCarousel } from "@/site/about/StackCarousel";
import { Closing } from "@/site/about/Closing";
import { Footer } from "@/site/Footer";
import { pageMetadata } from "@/site/seo";

export const metadata = pageMetadata("about", "/about");

export default function AboutPage() {
  return (
    <>
      <main>
        <AboutHero />
        <Orbit />
        <Experience />
        <Matrix />
        <StackCarousel />
        <Closing />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
