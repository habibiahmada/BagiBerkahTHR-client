"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Heart, Coffee, Rocket, Star, Code2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { validatePaymentUrl } from "@/lib/security";

const DONATION_TIERS = [
  {
    icon: Coffee,
    title: "Traktir Kopi ☕",
    amount: 15000,
    desc: "Secangkir kopi untuk developer yang begadang coding",
    accent: "border-amber-500/40 hover:border-amber-500",
  },
  {
    icon: Heart,
    title: "Support Reguler 💚",
    amount: 50000,
    desc: "Bantu biaya server dan operasional bulanan",
    accent: "border-primary/40 hover:border-primary",
    popular: true,
  },
  {
    icon: Rocket,
    title: "Booster 🚀",
    amount: 100000,
    desc: "Akselerasi pengembangan fitur baru lebih cepat",
    accent: "border-blue-500/40 hover:border-blue-500",
  },
  {
    icon: Star,
    title: "Super Supporter ⭐",
    amount: 250000,
    desc: "Nama Anda akan tampil di halaman kredit & early access fitur baru",
    accent: "border-yellow-500/40 hover:border-yellow-500",
  },
];

// Fallback data untuk development (akan diganti dengan data dari backend)
const FALLBACK_SUPPORTERS = [
  { name: "Ahmad R.", amount: 100000, message: "Semangat terus dev! 🔥" },
  { name: "Siti N.", amount: 50000, message: "Aplikasi keren, sangat membantu!" },
  { name: "Budi S.", amount: 250000, message: "Lanjutkan karya terbaiknya 💪" },
  { name: "Dewi L.", amount: 15000, message: "Kopi buat begadang 😄" },
  { name: "Rizky P.", amount: 50000, message: "Fitur AI-nya mantap!" },
  { name: "Anonim", amount: 100000, message: "Keep up the great work!" },
];

interface Supporter {
  donorName: string;
  amount: number;
  message: string | null;
  createdAt?: string;
}

export default function SupportPage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSupporters, setRecentSupporters] = useState<Supporter[]>([]);
  const [loadingSupporters, setLoadingSupporters] = useState(true);

  // Fetch recent supporters from backend
  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const response: any = await api.getDonationStats();
        if (response.success && response.data.recentDonations) {
          const supporters = response.data.recentDonations.map((d: any) => ({
            donorName: d.donorName,
            amount: d.amount,
            message: d.message,
            createdAt: d.createdAt,
          }));
          
          // Jika ada data dari backend, gunakan itu
          if (supporters.length > 0) {
            setRecentSupporters(supporters);
          } else {
            // Jika belum ada data, gunakan fallback
            setRecentSupporters(FALLBACK_SUPPORTERS.map(s => ({
              donorName: s.name,
              amount: s.amount,
              message: s.message,
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch supporters:', err);
        // Fallback ke hardcoded data jika backend error
        setRecentSupporters(FALLBACK_SUPPORTERS.map(s => ({
          donorName: s.name,
          amount: s.amount,
          message: s.message,
        })));
      } finally {
        setLoadingSupporters(false);
      }
    };

    fetchSupporters();
  }, []);

  const handleDonate = async (tierIndex: number) => {
    setError(null);

    // Validate email and phone
    if (!donorEmail || !donorEmail.includes('@')) {
      setError("Email wajib diisi dengan format yang benar");
      return;
    }

    if (!donorPhone || donorPhone.length < 10) {
      setError("Nomor telepon wajib diisi minimal 10 digit");
      return;
    }

    setLoading(true);
    setSelectedTier(tierIndex);

    const tier = DONATION_TIERS[tierIndex];

    try {
      const response: any = await api.createDonation({
        amount: tier.amount,
        donorName: donorName || undefined,
        donorEmail: donorEmail,
        donorPhone: donorPhone,
        message: message || undefined,
      });

      if (response.success && response.data.paymentUrl) {
        if (!validatePaymentUrl(response.data.paymentUrl)) {
          throw new Error("Invalid payment URL");
        }
        
        // Redirect ke halaman pembayaran
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.error?.message || "Gagal membuat donasi");
      }
    } catch (err: any) {
      console.error("Donation Error:", err);
      setError(err.message || "Terjadi kesalahan");
      setLoading(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        {/* Hero */}
        <section className="pb-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                <Heart className="w-4 h-4" />
                Support Developer
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Dukung Pengembangan BagiBerkah
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                BagiBerkah dibuat dengan ❤️ oleh developer independen Indonesia. 
                Dukungan Anda membantu kami tetap gratis dan terus berinovasi.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            {/* Optional Info Form */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Info Donatur</CardTitle>
                  <CardDescription>
                    Email dan nomor telepon diperlukan untuk konfirmasi pembayaran
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="donorName">Nama</Label>
                    <Input
                      id="donorName"
                      type="text"
                      placeholder="Anonymous"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      maxLength={100}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="donorEmail">Email</Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      maxLength={100}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Diperlukan untuk konfirmasi pembayaran
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="donorPhone">Nomor Telepon</Label>
                    <Input
                      id="donorPhone"
                      type="tel"
                      placeholder="08123456789"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      maxLength={15}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Diperlukan untuk konfirmasi pembayaran
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="message">Pesan Dukungan (Opsional)</Label>
                    <textarea
                      id="message"
                      placeholder="Tulis pesan dukungan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                      rows={3}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {error && (
                    <Alert variant="error">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Donation Tiers */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {DONATION_TIERS.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={`relative border-2 ${tier.accent} transition-all duration-200 hover:shadow-lg ${
                      loading && selectedTier === i ? "ring-2 ring-primary opacity-75" : ""
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Populer
                      </div>
                    )}
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <tier.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-1">
                        {tier.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {formatCurrency(tier.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-5">
                        {tier.desc}
                      </p>
                      <Button
                        variant={loading && selectedTier === i ? "outline" : "default"}
                        className="w-full"
                        onClick={() => handleDonate(i)}
                        disabled={loading}
                      >
                        <Heart className="w-4 h-4" />
                        {loading && selectedTier === i ? "Memproses..." : "Donasi"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How donations help */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Donasi Anda Digunakan Untuk
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Code2,
                  title: "Pengembangan Fitur",
                  desc: "Fitur baru seperti multi-currency, tema custom, dan integrasi e-wallet",
                },
                {
                  icon: Rocket,
                  title: "Infrastruktur",
                  desc: "Server, database, CDN, dan keamanan agar BagiBerkah tetap cepat & aman",
                },
                {
                  icon: Sparkles,
                  title: "AI & Inovasi",
                  desc: "Riset AI untuk rekomendasi pembagian THR yang lebih cerdas",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Supporters */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Supporter Terbaru 🙏
              </h2>
            </motion.div>
            
            {loadingSupporters ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Memuat data supporter...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {recentSupporters.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-border">
                      <CardContent className="flex items-start gap-3 py-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Heart className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-foreground">
                              {s.donorName}
                            </span>
                            <span className="text-xs text-primary font-semibold">
                              {formatCurrency(s.amount)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {s.message || "Terima kasih atas dukungannya! 🙏"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
