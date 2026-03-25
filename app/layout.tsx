import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TekroxGPT",
  description: "Talk to an AI version of Tekrox — builder, DeFi enthusiast, and EUR stablecoin obsessive.",
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    title: "TekroxGPT",
    description: "Talk to an AI version of Tekrox — builder, DeFi enthusiast, and EUR stablecoin obsessive.",
    images: [{ url: "/images/website preview image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TekroxGPT",
    description: "Talk to an AI version of Tekrox — builder, DeFi enthusiast, and EUR stablecoin obsessive.",
    images: ["/images/website preview image.png"],
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
