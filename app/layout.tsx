import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TekroxGPT",
  description: "Talk to an AI version of Tekrox — builder, DeFi enthusiast, and EUR stablecoin obsessive.",
  openGraph: {
    title: "TekroxGPT",
    description: "Talk to an AI version of Tekrox",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
