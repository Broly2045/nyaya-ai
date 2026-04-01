import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NyayaAI — AI Legal Intelligence for Indian Courts",
  description:
    "Upload any Indian legal document — FIR, bail application, writ petition, or contract. NyayaAI analyzes it against 740+ Indian statutes instantly.",
  keywords: ["Indian law", "legal AI", "FIR analysis", "bail application", "BNS", "BNSS", "Indian courts"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
