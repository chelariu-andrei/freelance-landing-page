import { LandingHero } from "@/site/landing/LandingHero";
import { Services } from "@/site/landing/Services";
import { Stats } from "@/site/landing/Stats";
import { Contact } from "@/site/landing/Contact";
import { Footer } from "@/site/Footer";

export default function LandingPage() {
  return (
    <>
      <main>
        <LandingHero />
        <Services />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
