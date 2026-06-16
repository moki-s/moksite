import type { Metadata } from "next";
import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "moksite",
  description: "Issue #01 — a noir case file. Under construction.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
