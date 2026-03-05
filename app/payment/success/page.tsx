"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const envelopeId = searchParams.get("envelope_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get paymentId from URL params
    const urlPaymentId = searchParams.get("payment_id");
    const urlEnvelopeId = searchParams.get("envelope_id") || searchParams.get("envelopeId");
    
    if (urlPaymentId) {
      checkPaymentStatus(urlPaymentId);
    } else if (urlEnvelopeId) {
      // Fallback: get payment from envelope
      checkPaymentFromEnvelope(urlEnvelopeId);
    } else {
      setError("Payment ID atau Envelope ID tidak ditemukan");
      setLoading(false);
    }
  }, [searchParams]);

  const checkPaymentFromEnvelope = async (envId: string) => {
    try {
      const response: any = await api.getEnvelope(envId);

      if (response.success && response.data.payment) {
        setPaymentData(response.data.payment);
      } else {
        throw new Error("Payment tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Payment Status Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (pId: string) => {
    try {
      const response: any = await api.getPaymentStatus(pId);

      if (response.success) {
        setPaymentData(response.data);
      } else {
        throw new Error(response.error?.message || "Gagal memuat status pembayaran");
      }
    } catch (err: any) {
      console.error("Payment Status Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline">
                <Home className="w-4 h-4" />
                Kembali ke Home
              </Button>
            </Link>
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
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran Berhasil!
            </h1>
            <p className="text-muted-foreground">
              Amplop THR Anda telah aktif dan siap dibagikan
            </p>
          </div>

          {/* Success Alert */}
          <Alert variant="success" className="mb-6">
            <CheckCircle className="w-4 h-4" />
            <AlertTitle>Transaksi Berhasil</AlertTitle>
            <AlertDescription>
              Pembayaran Anda telah dikonfirmasi. Link klaim telah digenerate untuk
              setiap penerima.
            </AlertDescription>
          </Alert>

          {/* Payment Details */}
          {paymentData && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-sm text-foreground">
                      {paymentData.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah:</span>
                    <span className="font-bold text-primary text-xl">
                      {formatCurrency(paymentData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-green-600">
                      {paymentData.status}
                    </span>
                  </div>
                  {paymentData.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dibayar pada:</span>
                      <span className="text-foreground">
                        {new Date(paymentData.paidAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-3">
                Langkah Selanjutnya:
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Link klaim telah digenerate untuk setiap penerima</li>
                <li>Kirim link kepada masing-masing penerima via WhatsApp/SMS</li>
                <li>Penerima akan mendapat pengalaman interaktif sebelum klaim</li>
                <li>Dana akan ditransfer otomatis setelah penerima submit rekening</li>
                <li>Pantau status klaim di dashboard</li>
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {(envelopeId || paymentData?.envelopeId) && (
              <Button
                onClick={() => router.push(`/envelope/${envelopeId || paymentData.envelopeId}`)}
                size="lg"
                className="w-full"
              >
                <Eye className="w-5 h-5" />
                Lihat Detail Amplop
              </Button>
            )}
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Ke Dashboard
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              <Home className="w-5 h-5" />
              Kembali ke Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
