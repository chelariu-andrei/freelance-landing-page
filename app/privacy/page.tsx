import { PrivacyHero } from "@/site/privacy/PrivacyHero";
import { PrivacyPolicy } from "@/site/privacy/PrivacyPolicy";
import { Footer } from "@/site/Footer";
import { pageMetadata } from "@/site/seo";

export const metadata = pageMetadata("privacy", "/privacy");

export default function PrivacyPage() {
  return (
    <>
      <main>
        <PrivacyHero />
        <PrivacyPolicy />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
