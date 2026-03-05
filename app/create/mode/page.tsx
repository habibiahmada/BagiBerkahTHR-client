"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Smartphone, Banknote, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency } from "@/lib/utils";

type DistributionMode = "DIGITAL" | "CASH" | null;

export default function ModePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<DistributionMode>(null);
  const [allocationData, setAllocationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get allocation data from sessionStorage
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
    if (!selectedMode) return;

    if (selectedMode === "DIGITAL") {
      router.push("/create/payment");
    } else {
      router.push("/create/confirm");
    }
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
            <Link href="/create" className="mt-4 inline-block">
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
              Pilih cara Anda ingin membagikan THR kepada penerima
            </p>
          </div>

          {/* Summary */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(allocationData.totalBudget)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Jumlah Penerima
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {allocationData.recipients.length} orang
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Digital Mode */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-elevated ${
                selectedMode === "DIGITAL"
                  ? "ring-2 ring-primary shadow-elevated"
                  : ""
              }`}
              onClick={() => setSelectedMode("DIGITAL")}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-lighter flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  {selectedMode === "DIGITAL" && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle>Mode Digital</CardTitle>
                <CardDescription>
                  Transfer langsung ke rekening atau e-wallet penerima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Transfer otomatis ke rekening bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Real-time tracking status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Aman melalui payment gateway</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Cocok untuk penerima yang punya rekening</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cash Mode */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-elevated ${
                selectedMode === "CASH"
                  ? "ring-2 ring-primary shadow-elevated"
                  : ""
              }`}
              onClick={() => setSelectedMode("CASH")}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary-lighter flex items-center justify-center mb-4">
                    <Banknote className="w-6 h-6 text-secondary" />
                  </div>
                  {selectedMode === "CASH" && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle>Mode Cash</CardTitle>
                <CardDescription>
                  Berikan uang fisik dengan validasi QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Pengalaman digital + pemberian langsung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Validasi QR code anti-duplikasi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Tidak perlu rekening bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>Cocok untuk anak-anak & keluarga dekat</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

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
              Lanjutkan
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
