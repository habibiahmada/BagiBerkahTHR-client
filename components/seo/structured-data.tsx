"use client";

interface StructuredDataProps {
  type: "website" | "organization" | "product" | "faq";
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bagiberkah.vercel.app";

  const getStructuredData = () => {
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "BagiBerkah",
          description:
            "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan",
          url: siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BagiBerkah",
          description:
            "Platform AI untuk membagikan THR lebih bermakna",
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          sameAs: [
            "https://twitter.com/bagiberkah",
            "https://instagram.com/bagiberkah",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: "support@bagiberkah.id",
          },
        };

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "BagiBerkah",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "IDR",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
          },
          description:
            "Platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan",
        };

      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data || [
            {
              "@type": "Question",
              name: "Apa itu BagiBerkah?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BagiBerkah adalah platform AI yang membantu keluarga membagikan THR secara adil, personal, dan menyenangkan dengan fitur AI allocation, game interaktif, dan transfer otomatis.",
              },
            },
            {
              "@type": "Question",
              name: "Apakah BagiBerkah gratis?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Ya, BagiBerkah 100% gratis untuk digunakan. Kami didukung oleh donasi sukarela dari pengguna yang puas.",
              },
            },
            {
              "@type": "Question",
              name: "Bagaimana cara kerja AI allocation?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI kami menganalisis data penerima (usia, status, kedekatan) dan budget Anda untuk memberikan rekomendasi pembagian yang adil dan personal.",
              },
            },
          ],
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
