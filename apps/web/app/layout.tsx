import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import styles from "./page.module.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "himagic - Intelligent Image Optimization API",
  description:
    "Optimize images in real-time with our simple and powerful API. Built for developers who care about performance. Transform, resize, and deliver images in modern formats like AVIF and WebP instantly.",
  keywords: [
    "image optimization",
    "image API",
    "real-time image processing",
    "WebP",
    "AVIF",
    "image transformation",
    "performance optimization",
    "developer tools",
    "image CDN",
    "automatic optimization",
  ],
  authors: [{ name: "himagic Team" }],
  creator: "himagic",
  publisher: "himagic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://himagic.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://himagic.online",
    title: "himagic - Intelligent Image Optimization API",
    description:
      "Optimize images in real-time with our simple and powerful API. Built for developers who care about performance.",
    siteName: "himagic",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "himagic - Intelligent Image Optimization API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "himagic - Intelligent Image Optimization API",
    description:
      "Optimize images in real-time with our simple and powerful API. Built for developers who care about performance.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "himagic",
              description:
                "Intelligent Image Optimization API for developers. Transform and optimize images in real-time with URL-based API calls.",
              url: "https://himagic.online",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "himagic",
              },
              featureList: [
                "Real-time image optimization",
                "Automatic format conversion (AVIF, WebP)",
                "URL-based image transformations",
                "Performance optimization",
                "Developer-friendly API",
                "Modern image formats support",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        <Navbar />
        <div className="container">
          <div className={styles.page}>{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
