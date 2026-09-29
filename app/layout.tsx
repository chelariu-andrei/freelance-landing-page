import "@fontsource-variable/urbanist";
import "@fontsource-variable/inter";
import "@/tokens/tokens.css";
import "@/styles.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Andrei Chelariu" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="ac-root">{children}</div>
      </body>
    </html>
  );
}
