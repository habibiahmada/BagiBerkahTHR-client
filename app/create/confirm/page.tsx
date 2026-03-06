"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ConfirmPage() {
  const router = useRouter();
  const [allocationData, setAllocationData] = useState<any>(null);
  const [envelopeName, setEnvelopeName] = useState("");
  const [loading, setLoading] = useState(false);
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
    
    // Prevent back navigation after successful creation
    const handlePopState = (e: PopStateEvent) => {
      // Check if we just came from success page
      if (document.referrer.includes('/create/success')) {
        e.preventDefault();
        router.push('/');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  const handleCreateEnvelope = async () => {
    if (!allocationData) return;
    
    if (!envelopeName.trim()) {
      setError("Nama amplop wajib diisi");
      return;
    }

    // If DIGITAL mode, save envelope name and redirect to payment
    if (allocationData.distributionMode === "DIGITAL") {
      const updatedData = {
        ...allocationData,
        envelopeName: envelopeName.trim(),
      };
      sessionStorage.setItem("allocationData", JSON.stringify(updatedData));
      router.push("/create/payment");
      return;
    }

    // CASH mode: create envelope directly
    setLoading(true);
    setError(null);

    try {
      const recipientsData = allocationData.recipients.map((r: any) => ({
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
      }));

      const response: any = await api.createEnvelope({
        envelopeName: envelopeName.trim(),
        totalBudget: allocationData.totalBudget,
        distributionMode: allocationData.distributionMode || "CASH",
        recipients: recipientsData,
      });

      if (response.success) {
        // Cleanup sessionStorage
        sessionStorage.removeItem("allocationData");
        
        // Redirect to success page with fallback
        const successUrl = `/create/success?envelopeId=${response.data.id}`;
        
        try {
          router.push(successUrl);
        } catch (err) {
          console.error('Router push failed, using window.location:', err);
          window.location.href = successUrl;
        }
      } else {
        console.error('❌ Envelope creation failed:', response.error);
        throw new Error(response.error?.message || "Gagal membuat amplop");
      }
    } catch (err: any) {
      console.error("Create Envelope Error:", err);
      setError(err.message || "Terjadi kesalahan saat membuat amplop");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Data alokasi tidak ditemukan. Kemungkinan:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 mb-6">
                  <li>Anda sudah membuat amplop dan sessionStorage telah dibersihkan</li>
                  <li>Anda kembali ke halaman ini setelah sukses membuat amplop</li>
                  <li>Session telah expired atau browser di-refresh</li>
                </ul>
                <div className="space-y-3">
                  <Link href="/dashboard" className="block">
                    <Button variant="default" className="w-full">
                      Cek Status Amplop di Dashboard
                    </Button>
                  </Link>
                  <Link href="/create" className="block">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4" />
                      Buat Amplop Baru
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
          <div className="mb-8">
            <Link
              href="/create/mode"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Konfirmasi Amplop
            </h1>
            <p className="text-muted-foreground">
              Periksa kembali detail amplop THR Anda
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ringkasan Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nama Amplop
                  </label>
                  <input
                    type="text"
                    value={envelopeName}
                    onChange={(e) => setEnvelopeName(e.target.value)}
                    placeholder="Contoh: THR Lebaran 2026"
                    maxLength={100}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nama ini akan memudahkan Anda mengidentifikasi amplop
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="font-bold text-foreground">
                      {allocationData.distributionMode === "DIGITAL" ? "Digital (Transfer)" : "Cash (Tunai)"}
                    </span>
                  </div>
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
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Daftar Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allocationData.recipients.map((recipient: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-foreground">{recipient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {recipient.ageLevel} • {recipient.status}
                      </p>
                      {recipient.playableType !== "DIRECT" && (
                        <p className="text-xs text-primary mt-1">
                          {recipient.playableType === "GAME" 
                            ? `🎮 Game: ${recipient.gameType?.replace(/_/g, " ")}`
                            : `🧠 Quiz: ${recipient.quizTopic}`
                          }
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-primary">
                      {formatCurrency(recipient.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="error" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
              disabled={loading || !envelopeName.trim()}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Membuat Amplop...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Buat Amplop
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
