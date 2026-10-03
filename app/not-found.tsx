import { NotFoundHero } from "@/site/NotFoundHero";
import { Footer } from "@/site/Footer";
import { pageMetadata } from "@/site/seo";

export const metadata = pageMetadata("notFound", "/404");

export default function NotFound() {
  return (
    <>
      <main>
        <NotFoundHero />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
