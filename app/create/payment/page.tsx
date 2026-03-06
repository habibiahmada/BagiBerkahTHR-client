"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { validatePaymentUrl, logger } from "@/lib/security";

export default function PaymentPage() {
  const router = useRouter();
  const [allocationData, setAllocationData] = useState<any>(null);
  const [envelopeName, setEnvelopeName] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envelopeId, setEnvelopeId] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("allocationData");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setAllocationData(parsedData);
        // Get envelope name from allocation data
        if (parsedData.envelopeName) {
          setEnvelopeName(parsedData.envelopeName);
        }
      } catch (err) {
        setError("Data alokasi tidak valid");
      }
    } else {
      setError("Data alokasi tidak ditemukan");
    }
  }, []);

  const handleCreateEnvelope = async () => {
    if (!allocationData || !envelopeName) return;

    setLoading(true);
    setError(null);

    try {
      // Create envelope first
      const envelopeResponse: any = await api.createEnvelope({
        envelopeName: envelopeName,
        totalBudget: allocationData.totalBudget,
        distributionMode: "DIGITAL",
        recipients: allocationData.recipients.map((r: any) => ({
          name: r.name,
          ageLevel: r.ageLevel.toUpperCase(),
          status: r.status.toUpperCase(),
          closeness: r.closeness.toUpperCase(),
          allocatedAmount: r.amount,
          aiReasoning: r.reasoning,
          aiGreeting: r.greeting || "",
          greetingContext: r.greetingContext || "",
          playableType: r.playableType,
          gameType: r.gameType,
          quizTopic: r.quizTopic,
          quizDifficulty: r.quizDifficulty,
        })),
      });

      if (envelopeResponse.success) {
        const createdEnvelopeId = envelopeResponse.data.id;
        setEnvelopeId(createdEnvelopeId);

        // Create payment session
        const paymentResponse: any = await api.createPayment(createdEnvelopeId);

        if (paymentResponse.success) {
          const paymentUrl = paymentResponse.data.paymentUrl;
          
          // Validate payment URL before redirect (security)
          if (!validatePaymentUrl(paymentUrl)) {
            throw new Error('Invalid payment URL. Silakan hubungi support.');
          }
          
          // Cleanup sessionStorage before redirect
          sessionStorage.removeItem("allocationData");
          
          // Redirect to payment gateway
          window.location.href = paymentUrl;
        } else {
          throw new Error(paymentResponse.error?.message || "Gagal membuat payment session");
        }
      } else {
        throw new Error(envelopeResponse.error?.message || "Gagal membuat amplop");
      }
    } catch (err: any) {
      logger.error("Payment Error:", err);
      setError(err.message || "Terjadi kesalahan saat memproses pembayaran");
      setLoading(false);
    }
  };

  if (error && !envelopeId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/create/confirm" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!allocationData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/create/confirm"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran
            </h1>
            <p className="text-muted-foreground">
              Selesaikan pembayaran untuk mengaktifkan amplop THR
            </p>
          </div>

          {/* Payment Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detail Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nama Amplop
                  </label>
                  <div className="w-full px-4 py-2 border border-border rounded-lg bg-muted/50">
                    <p className="text-foreground">{envelopeName || "Loading..."}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Budget:</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(allocationData.totalBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Penerima:</span>
                    <span className="font-bold text-foreground">
                      {allocationData.recipients.length} orang
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin:</span>
                    <span className="font-bold text-foreground">Rp 0</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total Bayar:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(allocationData.totalBudget)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pilih Metode Pembayaran</CardTitle>
              <CardDescription>
                Anda akan diarahkan ke payment gateway untuk menyelesaikan pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector
                selected={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Kembali
            </Button>
            <Button
              onClick={handleCreateEnvelope}
              disabled={!selectedMethod || !envelopeName || loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Bayar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
