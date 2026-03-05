"use client";

import Head from "next/head";

interface PageSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export function PageSEO({
  title,
  description,
  keywords,
  ogImage = "/og-image.png",
  canonical,
  noindex = false,
}: PageSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bagiberkah.vercel.app";
  const fullTitle = title
    ? `${title} | BagiBerkah`
    : "BagiBerkah - Platform AI untuk Bagikan THR Lebih Bermakna";
  const fullDescription =
    description ||
    "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan. Dengan AI allocation, game interaktif, dan transfer otomatis.";
  const fullCanonical = canonical || siteUrl;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="BagiBerkah" />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:creator" content="@bagiberkah" />

      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />

      {/* Additional */}
      <meta name="theme-color" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="BagiBerkah" />
    </Head>
  );
}
