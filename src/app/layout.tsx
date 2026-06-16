import type { Metadata } from "next";
import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";
import { siteConfig } from "@/content/site";
import { getBaseUrl } from "@/lib/seo";
import { MotionProvider } from "@/components/MotionProvider";
import { Grain } from "@/components/ui/Grain";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";

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
        </MotionProvider>
      </body>
    </html>
  );
}
