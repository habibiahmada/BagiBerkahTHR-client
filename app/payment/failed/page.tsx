"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Failed Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran Gagal
            </h1>
            <p className="text-muted-foreground">
              Transaksi pembayaran tidak dapat diselesaikan
            </p>
          </div>

          {/* Error Alert */}
          <Alert variant="error" className="mb-6">
            <XCircle className="w-4 h-4" />
            <AlertTitle>Transaksi Gagal</AlertTitle>
            <AlertDescription>
              {reason || "Pembayaran tidak dapat diproses. Silakan coba lagi atau hubungi support."}
            </AlertDescription>
          </Alert>

          {/* Payment Details */}
          {paymentId && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-sm text-foreground">
                      {paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-red-600">FAILED</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-3">
                Kemungkinan Penyebab:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Saldo tidak mencukupi</li>
                <li>Kartu kredit/debit ditolak</li>
                <li>Koneksi internet terputus</li>
                <li>Waktu pembayaran habis</li>
                <li>Informasi pembayaran tidak valid</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/create/payment")}
              size="lg"
              className="w-full"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Lagi
            </Button>
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

          {/* Support Info */}
          <div className="mt-8 p-4 bg-muted rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              Butuh bantuan? Hubungi support kami di{" "}
              <a
                href="mailto:support@bagiberkah.com"
                className="text-primary hover:underline"
              >
                support@bagiberkah.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
