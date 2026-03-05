"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const [envelope, setEnvelope] = useState<any>(null);
  const [claimLinks, setClaimLinks] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("allocationData");
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

  const handleCreateEnvelope = async () => {
    if (!allocationData) return;
    
    if (!envelopeName.trim()) {
      setError("Nama amplop wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: any = await api.createEnvelope({
        envelopeName: envelopeName.trim(),
        totalBudget: allocationData.totalBudget,
        distributionMode: "CASH",
        recipients: allocationData.recipients.map((r: any) => ({
          name: r.name,
          ageLevel: r.ageLevel.toUpperCase(),
          status: r.status.toUpperCase(),
          closeness: r.closeness.toUpperCase(),
          allocatedAmount: r.amount,
          aiReasoning: r.reasoning,
          aiGreeting: r.greeting || "",
          greetingContext: r.greetingContext || "",
        })),
      });

      if (response.success) {
        setEnvelope(response.data);
        
        // Generate claim links
        const links = response.data.recipients.map((recipient: any) => {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          return `${baseUrl}/claim/${recipient.claim.token}`;
        });
        
        setClaimLinks(links);
      } else {
        throw new Error(response.error?.message || "Gagal membuat amplop");
      }
    } catch (err: any) {
      console.error("Create Envelope Error:", err);
      setError(err.message || "Terjadi kesalahan saat membuat amplop");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    // You can add toast notification here
    alert(`Link untuk ${allocationData.recipients[index].name} telah disalin!`);
  };

  const handleShareLink = async (link: string, recipientName: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "THR dari BagiBerkah",
          text: `Hai ${recipientName}! Ada THR untukmu. Buka link ini untuk klaim:`,
          url: link,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink(link, 0);
    }
  };

  if (error && !envelope) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/create/mode" className="mt-4 inline-block">
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

  if (!envelope) {
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
                      <span className="font-bold text-foreground">Cash (Tunai)</span>
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

  // Success state - show claim links
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert variant="success" className="mb-8">
            <AlertTitle className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Amplop THR Berhasil Dibuat!
            </AlertTitle>
            <AlertDescription>
              Kirim link klaim kepada setiap penerima. Mereka akan mendapatkan pengalaman
              interaktif sebelum melihat nominal dan QR code untuk validasi.
            </AlertDescription>
          </Alert>

          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle>Kode Akses Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-6 bg-primary-lighter rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-2">Kode Akses Anda:</p>
                  <p className="text-4xl font-bold font-mono text-primary tracking-wider">
                    {envelope.accessCode}
                  </p>
                </div>
                <Alert variant="info">
                  <AlertDescription>
                    <strong>Simpan kode ini!</strong> Gunakan kode akses untuk mengecek status amplop kapan saja di halaman Dashboard.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Link Klaim untuk Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocationData.recipients.map((recipient: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/50 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {recipient.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(recipient.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={claimLinks[index]}
                        readOnly
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(claimLinks[index], index)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareLink(claimLinks[index], recipient.name)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cek Status Amplop
            </Button>
            <Button onClick={() => router.push("/")}>
              Kembali ke Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
