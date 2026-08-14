import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CloudflareAnalytics } from "@/components/CloudflareAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Evolutionary Prophecy - Predict the Future Through Evolution",
    template: "%s | Evolutionary Prophecy",
  },
  description:
    "A community prediction platform where people forecast future paths through evolutionary branches. Vote on technology, biology, culture, life, and society prophecies.",
  keywords: [
    "future prediction",
    "evolutionary forecasting",
    "community predictions",
    "future of technology",
    "future of humanity",
    "evolution theory",
    "collective intelligence",
  ],
  authors: [{ name: "Evolutionary Prophecy" }],
  creator: "Evolutionary Prophecy",
  metadataBase: new URL("https://prophet.lifelong-growth.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prophet.lifelong-growth.com",
    siteName: "Evolutionary Prophecy",
    title: "Evolutionary Prophecy - Predict the Future Through Evolution",
    description:
      "Explore prophecies, vote on evolutionary branches, and see where the community thinks humanity is heading.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolutionary Prophecy",
    description: "Predict the future through evolutionary branches.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-neon-600/10 blur-[100px]" />
          <div className="absolute bottom-20 right-0 h-96 w-96 rounded-full bg-bio-600/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cell-600/10 blur-[100px]" />
        </div>
        <Header />
        <main className="mx-auto min-h-screen max-w-6xl px-4 pb-20 pt-24">{children}</main>
        <Footer />
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
