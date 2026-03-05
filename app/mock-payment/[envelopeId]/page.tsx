"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency } from "@/lib/utils";

export default function MockPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const envelopeId = params.envelopeId as string;
  const amount = parseInt(searchParams.get("amount") || "0");
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Get payment info from envelope
    fetchEnvelopePayment();
  }, [envelopeId]);

  const fetchEnvelopePayment = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/envelopes/${envelopeId}`);
      const data = await response.json();
      
      if (data.success && data.data.payment) {
        setPaymentId(data.data.payment.paymentId);
      }
    } catch (err) {
      console.error('Failed to fetch payment info:', err);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call mock payment success endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/payments/mock-success/${envelopeId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Redirect to success page with correct parameters
        setTimeout(() => {
          const params = new URLSearchParams({
            payment_id: paymentId || 'mock_payment',
            envelope_id: envelopeId,
          });
          router.push(`/payment/success?${params.toString()}`);
        }, 2000);
      } else {
        throw new Error(data.error?.message || 'Payment simulation failed');
      }
    } catch (err: any) {
      console.error('Mock Payment Error:', err);
      setError(err.message || 'Terjadi kesalahan saat simulasi pembayaran');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    router.push('/payment/failed');
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Pembayaran Berhasil!
                  </h2>
                  <p className="text-muted-foreground">
                    Mengalihkan ke halaman sukses...
                  </p>
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </div>
              </CardContent>
            </Card>
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
          {/* Development Mode Warning */}
          <Alert variant="warning" className="mb-8">
            <AlertCircle className="w-5 h-5" />
            <AlertTitle>Mode Development</AlertTitle>
            <AlertDescription>
              Ini adalah halaman simulasi pembayaran untuk testing. 
              Tidak ada transaksi real yang terjadi.
            </AlertDescription>
          </Alert>

          {/* Payment Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Simulasi Pembayaran</CardTitle>
              <CardDescription>
                Klik tombol di bawah untuk mensimulasikan pembayaran sukses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envelope ID:</span>
                    <span className="font-mono text-sm text-foreground">{envelopeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pembayaran:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>

                {error && (
                  <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses Pembayaran...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Simulasi Pembayaran Sukses
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleCancel}
                    disabled={processing}
                    variant="outline"
                    className="w-full"
                  >
                    Batalkan Pembayaran
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 Tip: Dalam production, halaman ini akan diganti dengan payment gateway real (Mayar)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cara Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Klik tombol "Simulasi Pembayaran Sukses" untuk mensimulasikan pembayaran berhasil</li>
                <li>Sistem akan mengaktifkan envelope dan membuat claim links</li>
                <li>Anda akan diarahkan ke halaman sukses</li>
                <li>Atau klik "Batalkan Pembayaran" untuk simulasi pembayaran gagal</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
