"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Head from "next/head";
import { Heart } from "lucide-react";
import { ToastProvider } from "@/components/ui/toast";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSupport = pathname === "/support";

  return (
    <html lang="id">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <StructuredData type="website" />
        <StructuredData type="organization" />
        
        <ToastProvider>
          {children}
          
          {/* Floating Support Button - Hidden on support page */}
          {!isSupport && (
            <Link href="/support">
              <button
                className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-br from-pink-500 to-red-500 shadow-elevated hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                aria-label="Dukung BagiBerkah"
              >
                <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                
                {/* Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Dukung BagiBerkah ❤️
                </span>
              </button>
            </Link>
          )}
        </ToastProvider>
      </body>
    </html>
  );
}
