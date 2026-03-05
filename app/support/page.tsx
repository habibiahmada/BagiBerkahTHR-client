"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Heart, Coffee, Gift, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { validatePaymentUrl } from "@/lib/security";

const DONATION_AMOUNTS = [
  { amount: 10000, label: "☕ Kopi", icon: Coffee },
  { amount: 25000, label: "🍩 Snack", icon: Gift },
  { amount: 50000, label: "🌙 Berkah", icon: Heart },
  { amount: 100000, label: "✨ Istimewa", icon: Sparkles },
];

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/\D/g, ""));
    if (!isNaN(numValue)) {
      setCustomAmount(value);
      setSelectedAmount(numValue);
    } else {
      setCustomAmount("");
      setSelectedAmount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAmount || selectedAmount < 10000) {
      setError("Minimal donasi Rp 10.000");
      return;
    }

    setLoading(true);

    try {
      const response: any = await api.createDonation({
        amount: selectedAmount,
        donorName: donorName || undefined,
        message: message || undefined,
      });

      if (response.success && response.data.paymentUrl) {
        // Validate payment URL before redirect
        if (!validatePaymentUrl(response.data.paymentUrl)) {
          throw new Error("Invalid payment URL");
        }
        
        // Redirect to payment page
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.error?.message || "Gagal membuat donasi");
      }
    } catch (err: any) {
      console.error("Donation Error:", err);
      setError(err.message || "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lighter mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Dukung BagiBerkah
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Agar lebih banyak kebahagiaan Ramadhan bisa dibagikan ❤️
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Berikan Dukungan</CardTitle>
                <CardDescription>
                  Setiap dukungan Anda sangat berarti untuk pengembangan BagiBerkah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label>Pilih Nominal</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {DONATION_AMOUNTS.map(({ amount, label, icon: Icon }) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedAmount === amount
                              ? "border-primary bg-primary-lighter"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <div className="text-sm font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(amount)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="customAmount">Atau Nominal Lain</Label>
                    <Input
                      id="customAmount"
                      type="text"
                      placeholder="Masukkan nominal"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                    />
                  </div>

                  {/* Donor Name */}
                  <div>
                    <Label htmlFor="donorName">Nama (Opsional)</Label>
                    <Input
                      id="donorName"
                      type="text"
                      placeholder="Anonymous"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Pesan (Opsional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan dukungan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                      rows={3}
                    />
                  </div>

                  {error && (
                    <Alert variant="error">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !selectedAmount}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Memproses..." : `Donasi ${selectedAmount ? formatCurrency(selectedAmount) : ""}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kenapa Mendukung?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Gratis Selamanya</h3>
                      <p className="text-sm text-muted-foreground">
                        BagiBerkah akan selalu gratis untuk semua pengguna
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Pengembangan Fitur</h3>
                      <p className="text-sm text-muted-foreground">
                        Dukungan Anda membantu kami menambah fitur baru
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Berbagi Kebahagiaan</h3>
                      <p className="text-sm text-muted-foreground">
                        Membantu lebih banyak orang berbagi THR dengan mudah
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-hero text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Terima kasih atas dukungan Anda!
                    </p>
                    <p className="text-sm opacity-90">
                      Setiap kontribusi sangat berarti untuk kami
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
