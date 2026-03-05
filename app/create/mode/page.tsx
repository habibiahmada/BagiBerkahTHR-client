"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, CreditCard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

type DistributionMode = "CASH" | "DIGITAL";

export default function ModePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<DistributionMode | null>(null);
  const [allocationData, setAllocationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("allocationData");
    if (data) {
      try {
        setAllocationData(JSON.parse(data));
      } catch (err) {
        setError("Data alokasi tidak valid");
      }
    } else {
      setError("Data alokasi tidak ditemukan");
    }
  }, []);

  const handleContinue = () => {
    if (!selectedMode || !allocationData) return;

    // Save mode to allocation data
    const updatedData = {
      ...allocationData,
      distributionMode: selectedMode,
    };

    sessionStorage.setItem("allocationData", JSON.stringify(updatedData));

    // Navigate to confirm page
    router.push("/create/confirm");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/create/allocation" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Alokasi
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
              href="/create/allocation"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pilih Mode Distribusi
            </h1>
            <p className="text-muted-foreground">
              Bagaimana Anda ingin membagikan THR kepada penerima?
            </p>
          </div>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Cash Mode */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all h-full ${
                  selectedMode === "CASH"
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMode("CASH")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Cash (Tunai)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Penerima akan mendapatkan link klaim dengan QR code. Anda validasi QR code saat memberikan uang tunai.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Gratis, tanpa biaya admin</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Kontrol penuh kapan memberikan THR</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>QR code untuk validasi</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Cocok untuk keluarga dekat</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Digital Mode */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all h-full ${
                  selectedMode === "DIGITAL"
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMode("DIGITAL")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-500" />
                    </div>
                    <CardTitle>Digital (Transfer)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Penerima input rekening bank, lalu Anda transfer langsung ke rekening mereka melalui payment gateway.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Transfer otomatis ke rekening</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Tidak perlu bertemu langsung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Cocok untuk keluarga jauh</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Biaya admin payment gateway</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info Alert */}
          <Alert variant="info" className="mb-8">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Catatan:</strong> Kedua mode tetap menggunakan fitur game/quiz yang sudah Anda pilih. Perbedaannya hanya pada cara pemberian uang THR.
            </AlertDescription>
          </Alert>

          {/* Continue Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedMode}
              size="lg"
            >
              Lanjut ke Konfirmasi →
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
