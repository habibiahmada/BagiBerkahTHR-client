"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Code2, Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StepsSection } from "@/components/landing/steps-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { TrustSection } from "@/components/landing/trust-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { StructuredData } from "@/components/seo/structured-data";

function SupportDeveloperSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl border-2 border-dashed border-pink-500/40 bg-pink-500/5 p-8 md:p-12 text-center"
        >
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-600" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Dukung Developer BagiBerkah
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            BagiBerkah dibuat oleh developer independen Indonesia. Dukungan Anda
            membantu kami tetap gratis dan terus menghadirkan fitur terbaik.
          </p>
          <Link href="/support">
            <Button size="lg" className="bg-linear-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg">
              <Heart className="w-4 h-4" />
              Dukung Sekarang
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Mulai dari Rp 15.000 — setara secangkir kopi ☕
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <StructuredData type="product" />
      <StructuredData type="faq" />
      
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <StepsSection />
          <TestimonialsSection />
          <TrustSection />
          <FaqSection />
          <SupportDeveloperSection />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
