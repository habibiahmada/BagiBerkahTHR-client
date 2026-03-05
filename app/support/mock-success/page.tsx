"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Heart, CheckCircle, Home, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/animations/confetti";

export default function MockDonationSuccessPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {showConfetti && <Confetti active={true} />}

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Development Mode Warning */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="warning">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Development Mode:</strong> Ini adalah simulasi pembayaran. 
                  Di production, pembayaran akan diproses melalui Mayar payment gateway.
                </AlertDescription>
              </Alert>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-primary/20 shadow-xl">
                <CardContent className="pt-12 pb-10 text-center">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-pink-500 to-red-500 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                  >
                    Terima Kasih! 🙏
                  </motion.h1>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 mb-8"
                  >
                    <p className="text-lg text-muted-foreground">
                      Donasi Mock Berhasil Diproses!
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Ini adalah simulasi pembayaran untuk testing. Dukungan Anda sangat berarti 
                      untuk pengembangan BagiBerkah. Kami akan terus berinovasi dan menghadirkan 
                      fitur terbaik untuk Anda.
                    </p>
                  </motion.div>

                  {/* Impact Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-linear-to-r from-pink-50 to-red-50 dark:from-pink-900/10 dark:to-red-900/10 rounded-xl p-6 mb-8"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <h3 className="font-bold text-foreground">
                        Dampak Donasi Anda
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">💻</div>
                        <p className="text-muted-foreground">Pengembangan Fitur Baru</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">🚀</div>
                        <p className="text-muted-foreground">Server & Infrastruktur</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">✨</div>
                        <p className="text-muted-foreground">Riset AI & Inovasi</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mock Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-muted/50 rounded-lg p-4 mb-8 text-sm text-muted-foreground"
                  >
                    <p className="font-semibold mb-2">ℹ️ Development Mode Info:</p>
                    <ul className="text-left space-y-1 max-w-md mx-auto">
                      <li>• Donation record tersimpan di database dengan status PENDING</li>
                      <li>• Tidak ada pembayaran real yang diproses</li>
                      <li>• Untuk production, configure MAYAR_API_KEY di .env</li>
                      <li>• Webhook akan update status ke SUCCESS setelah payment</li>
                    </ul>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Link href="/">
                      <Button size="lg" variant="default">
                        <Home className="w-5 h-5" />
                        Kembali ke Beranda
                      </Button>
                    </Link>
                    <Link href="/create">
                      <Button size="lg" variant="outline">
                        Buat Amplop THR
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Social Share */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 pt-6 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-3">
                      Bantu sebarkan BagiBerkah ke teman dan keluarga
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const text = "Saya baru saja mendukung BagiBerkah! Platform AI untuk berbagi THR yang lebih bermakna. Coba sekarang!";
                          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        Share di Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const text = "Saya baru saja mendukung BagiBerkah! Platform AI untuk berbagi THR yang lebih bermakna.";
                          const url = window.location.origin;
                          const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                          window.open(shareUrl, "_blank");
                        }}
                      >
                        Share di Facebook
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
