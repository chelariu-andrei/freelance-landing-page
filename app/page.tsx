import { LandingHero } from "@/site/landing/LandingHero";
import { Services } from "@/site/landing/Services";
import { ServicesOverview } from "@/site/landing/ServicesOverview";
import { Stats } from "@/site/landing/Stats";
import { Contact } from "@/site/landing/Contact";
import { Footer } from "@/site/Footer";
import { pageMetadata } from "@/site/seo";

export const metadata = pageMetadata("landing", "/");

export default function LandingPage() {
  return (
    <>
      <main>
        <LandingHero />
        <ServicesOverview />
        <Services />
        <Stats />
        <Contact />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
