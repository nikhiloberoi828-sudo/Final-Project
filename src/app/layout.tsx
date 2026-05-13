import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Script from "next/script";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://final-project-em3w.onrender.com";

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "Himachal Explorer",
    title: "Himachal Explorer – Discover the Land of Gods",
    description:
      "Your ultimate guide to Himachal Pradesh tourism – destinations, accommodation, and experiences.",
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
    description: "Explore Himachal Pradesh with our comprehensive travel guide.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Himachal Explorer",
              "url": siteUrl,
              "description": "Discover the Land of Gods – Himachal Pradesh tourism guide.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteUrl}/destinations?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
