import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Three roles, three faces, and each one is doing a job:
//
// Bricolage Grotesque carries the names — wordmark and panel titles. It is a
// grotesque, so it stays legible at a glance from across a room, but it has an
// irregular, slightly condensed skeleton that keeps it from reading like a
// system font. Set at 700/800 it is heavy enough to anchor each panel.
//
// DM Sans is the interface voice: round, calm, and already the face on the
// channel's thumbnails, so the tool matches what it makes.
//
// JetBrains Mono is the instrument readout — the agent stream, paths, sizes.
// Tall x-height, unambiguous 0/O and 1/l, which is what a log needs.
const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reel Studio",
  description: "Raw materials in, finished reel out.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
