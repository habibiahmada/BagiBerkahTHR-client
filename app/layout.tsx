import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BagiBerkah - AI-Powered THR Experience",
  description:
    "Aplikasi pembuat amplop THR interaktif dengan AI untuk pembagian yang adil dan menyenangkan",
  keywords: ["THR", "Ramadhan", "Lebaran", "AI", "Amplop Digital"],
};

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
        {children}
      </body>
    </html>
  );
}
