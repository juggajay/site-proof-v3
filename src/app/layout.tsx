import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SiteProof | NSW Civil Construction Software",
  description:
    "Stop bleeding profit on NSW job sites. The only platform built for Security of Payment Act compliance, EBA rates, and real-time daily costing. Trusted by 50+ NSW civil contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} ${ibmPlexMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
