import "@fontsource-variable/urbanist";
import "@fontsource-variable/inter";
import "@/tokens/tokens.css";
import "@/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { SITE_URL, jsonLd } from "@/site/seo";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <noscript>
          <style>{`.ac-root [style*="opacity:0"],.ac-root [style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
        <div className="ac-root">{children}</div>
      </body>
    </html>
  );
}
