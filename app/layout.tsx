import "@fontsource-variable/urbanist";
import "@fontsource-variable/inter";
import "@/tokens/tokens.css";
import "@/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SITE_URL, jsonLd } from "@/site/seo";
import { BookingDialog } from "@/site/booking/BookingDialog";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

// Self-hosted at build time by next/font; exposed as --font-mono for Tailwind's `font-mono`.
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <noscript>
          <style>{`.ac-root [style*="opacity:0"],.ac-root [style*="opacity: 0"]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
        <div className="ac-root">
          {children}
          <BookingDialog />
        </div>
        {/* Cookieless page-view counts; only reports when deployed on Vercel with Analytics enabled. */}
        <Analytics />
      </body>
    </html>
  );
}
