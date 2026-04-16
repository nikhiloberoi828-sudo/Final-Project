import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Himachal Explorer – Discover the Land of Gods",
    template: "%s | Himachal Explorer",
  },
  description:
    "Explore the breathtaking landscapes, ancient temples, adventure trails, and rich cultural heritage of Himachal Pradesh. Plan your perfect Himalayan getaway today.",
  keywords: [
    "Himachal Pradesh tourism",
    "Shimla",
    "Manali",
    "Spiti Valley",
    "Dharamshala",
    "Dalhousie",
    "Himachal travel guide",
    "mountain tourism India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://himachal-explorer.in",
    siteName: "Himachal Explorer",
    title: "Himachal Explorer – Discover the Land of Gods",
    description:
      "Your ultimate guide to Himachal Pradesh tourism – destinations, accommodation, experiences, and AI-powered trip planning.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Himachal Pradesh Mountains",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himachal Explorer – Discover the Land of Gods",
    description: "Explore Himachal Pradesh with AI-powered travel planning.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
