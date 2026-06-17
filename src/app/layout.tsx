import type { Metadata } from "next";
import Script from "next/script";
import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";
import { siteConfig } from "@/content/site";
import { getBaseUrl } from "@/lib/seo";
import { MotionProvider } from "@/components/MotionProvider";
import { Grain } from "@/components/ui/Grain";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { TerminalLauncher } from "@/components/terminal/TerminalLauncher";
import { getAllCases } from "@/lib/content";

// §4.2 — three self-hosted families via next/font/google.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  preload: true,
});

const plexSans = IBM_Plex_Sans({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: `The portfolio of ${siteConfig.name}, ${siteConfig.role}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const caseList = getAllCases().map((c) => ({
    slug: c.slug,
    title: c.title,
    year: c.year,
    order: c.order,
  }));
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html
      lang="en"
      className={`${anton.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <Grain />
          <NavBar />
          {children}
          <Footer />
          <TerminalLauncher cases={caseList} />
        </MotionProvider>
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
