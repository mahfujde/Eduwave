import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Eduwave Educational Consultancy | Study in Malaysia",
    template: "%s | Eduwave Educational Consultancy",
  },
  description:
    "Eduwave helps Bangladeshi students study at top Malaysian universities. Expert guidance, visa support, and scholarship assistance. 350+ students successfully enrolled.",
  keywords: [
    "study in Malaysia",
    "Malaysian universities",
    "Bangladeshi students",
    "educational consultancy",
    "study abroad",
    "Eduwave",
    "theeduwave",
    "Malaysia university admission",
    "Bangladesh to Malaysia education",
    "free education consultancy",
    "student visa Malaysia",
    "scholarship Malaysia",
    "UCSI University",
    "Taylor's University",
    "APU Malaysia",
    "MMU Malaysia",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://theeduwave.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://theeduwave.com",
    siteName: "Eduwave Educational Consultancy",
    title: "Eduwave Educational Consultancy | Study in Malaysia from Bangladesh",
    description:
      "Expert guidance for Bangladeshi students seeking world-class education at top Malaysian universities. Free consultancy, visa support, 350+ students enrolled.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduwave Educational Consultancy",
    description:
      "Your gateway to world-class education in Malaysia. Free guidance for Bangladeshi students.",
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
  alternates: {
    canonical: "https://theeduwave.com",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const webSchema = getWebSiteSchema();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#1A2B5F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* JSON-LD Structured Data for SEO & AI Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
