import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bagiberkah.vercel.app";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
   verification: {
    google: "iBKUL5cUoj0BHHMA9EJ0mGlVnrNYz4K6YQGduYoO8GM",
  },
  title: {
    default: "BagiBerkah - Platform AI untuk Bagikan THR Lebih Bermakna",
    template: "%s | BagiBerkah",
  },
  description:
    "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan. Dengan AI allocation, game interaktif, dan transfer otomatis untuk semua usia.",
  keywords: [
    "THR",
    "Tunjangan Hari Raya",
    "Amplop Digital",
    "AI Allocation",
    "Ramadhan",
    "Idul Fitri",
    "Lebaran",
    "Transfer THR",
    "Amplop THR",
    "BagiBerkah",
    "Game Interaktif",
    "Quiz THR",
    "Digital Envelope",
    "Smart THR",
    "AI-Powered THR",
    "BagiBerkah THR"
  ],
  authors: [{ name: "BagiBerkah Team" }],
  creator: "BagiBerkah",
  publisher: "BagiBerkah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "BagiBerkah",
    title: "BagiBerkah - Platform AI untuk Bagikan THR Lebih Bermakna",
    description:
      "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan. Dengan AI allocation, game interaktif, dan transfer otomatis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BagiBerkah - Platform AI untuk THR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BagiBerkah - Platform AI untuk Bagikan THR Lebih Bermakna",
    description:
      "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan.",
    images: ["/og-image.png"],
    creator: "@bagiberkah",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  category: "finance",
};
