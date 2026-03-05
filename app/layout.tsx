import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google";
import { Heart } from "lucide-react";
import { ToastProvider } from "@/components/ui/toast";
import { StructuredData } from "@/components/seo/structured-data";
import { defaultMetadata } from "./metadata";
import { FloatingSupportButton } from "@/components/layout/floating-support-button";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Analytics/>
        <StructuredData type="website" />
        <StructuredData type="organization" />
        
        <ToastProvider>
          {children}
          <FloatingSupportButton />
        </ToastProvider>
      </body>
    </html>
  );
}
