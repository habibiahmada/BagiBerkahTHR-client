"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy, Share2, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatCurrency, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

function CreateSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const envelopeId = searchParams.get("envelopeId");
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [envelope, setEnvelope] = useState<any>(null);
  const [claimLinks, setClaimLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear sessionStorage immediately when landing on success page
    sessionStorage.removeItem("allocationData");
    
    if (!envelopeId) {
      setError("Envelope ID tidak ditemukan");
      setLoading(false);
      return;
    }

    fetchEnvelopeData();
    
    // Prevent back navigation to confirm page
    const handlePopState = () => {
      // If user tries to go back, redirect to home
      router.push('/');
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [envelopeId, router]);

  const fetchEnvelopeData = async () => {
    try {
      const response: any = await api.getEnvelope(envelopeId!);

      if (response.success) {
        setEnvelope(response.data);

        // Generate claim links
        const links = response.data.recipients.map((recipient: any) => {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          const token = recipient.claim?.token;
          if (!token) {
            console.error("No claim token for recipient:", recipient.name);
            return "";
          }
          return `${baseUrl}/claim/${token}`;
        });

        setClaimLinks(links);
      } else {
        throw new Error(response.error?.message || "Gagal memuat data amplop");
      }
    } catch (err: any) {
      console.error("Fetch Envelope Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (link: string, recipientName: string) => {
    if (!link) {
      addToast("Link tidak tersedia", "error");
      return;
    }

    try {
      const success = await copyToClipboard(link);
      if (success) {
        addToast(`Link untuk ${recipientName} telah disalin!`, "success");
      } else {
        addToast("Gagal menyalin link. Silakan copy manual.", "error");
      }
    } catch (err) {
      console.error("Copy error:", err);
      addToast("Gagal menyalin link. Silakan copy manual.", "error");
    }
  };

  const handleShareLink = async (link: string, recipientName: string) => {
    if (!link) {
      addToast("Link tidak tersedia", "error");
      return;
    }

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
      handleCopyLink(link, recipientName);
    }
  };

  const handleCopyAccessCode = async () => {
    if (!envelope?.accessCode) return;

    try {
      const success = await copyToClipboard(envelope.accessCode);
      if (success) {
        addToast("Kode akses telah disalin!", "success");
      } else {
        addToast("Gagal menyalin kode akses.", "error");
      }
    } catch (err) {
      console.error("Copy error:", err);
      addToast("Gagal menyalin kode akses.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !envelope) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error" className="mb-6">
              <AlertDescription>{error || "Data amplop tidak ditemukan"}</AlertDescription>
            </Alert>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Tidak dapat memuat data amplop. Kemungkinan:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 mb-6">
                  <li>Envelope ID tidak valid atau tidak ditemukan</li>
                  <li>Terjadi kesalahan saat mengambil data dari server</li>
                  <li>Koneksi internet bermasalah</li>
                </ul>
                <div className="space-y-3">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    Coba Lagi
                  </Button>
                  <Link href="/dashboard" className="block">
                    <Button variant="outline" className="w-full">
                      Ke Dashboard
                    </Button>
                  </Link>
                  <Link href="/create" className="block">
                    <Button variant="outline" className="w-full">
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Alert */}
          <Alert variant="success" className="mb-8">
            <AlertTitle className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Amplop THR Berhasil Dibuat!
            </AlertTitle>
            <AlertDescription>
              {envelope.distributionMode === "DIGITAL"
                ? "Setelah pembayaran dikonfirmasi, kirim link klaim kepada setiap penerima."
                : "Kirim link klaim kepada setiap penerima. Mereka akan mendapatkan pengalaman interaktif sebelum melihat nominal dan QR code untuk validasi."}
            </AlertDescription>
          </Alert>

          {/* Access Code Card */}
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle>Kode Akses Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-6 bg-primary-lighter rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-2">Kode Akses Anda:</p>
                  <div className="flex items-center justify-center gap-3">
                    <p
                      className="text-4xl font-bold font-mono text-primary tracking-wider select-all cursor-pointer"
                      onClick={(e) => {
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(e.currentTarget);
                        selection?.removeAllRanges();
                        selection?.addRange(range);
                      }}
                    >
                      {envelope.accessCode}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAccessCode}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Klik untuk select atau gunakan tombol copy
                  </p>
                </div>
                <Alert variant="info">
                  <AlertDescription>
                    <strong>Simpan kode ini!</strong> Gunakan kode akses untuk mengecek status
                    amplop kapan saja di halaman Dashboard.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Envelope Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ringkasan Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama Amplop:</span>
                  <span className="font-semibold text-foreground">{envelope.envelopeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="font-semibold text-foreground">
                    {envelope.distributionMode === "DIGITAL" ? "Digital (Transfer)" : "Cash (Tunai)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget:</span>
                  <span className="font-bold text-primary text-xl">
                    {formatCurrency(envelope.totalBudget)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah Penerima:</span>
                  <span className="font-semibold text-foreground">
                    {envelope.recipients.length} orang
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-semibold ${
                      envelope.status === "ACTIVE"
                        ? "text-green-600"
                        : envelope.status === "PENDING_PAYMENT"
                        ? "text-yellow-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {envelope.status === "ACTIVE"
                      ? "Aktif"
                      : envelope.status === "PENDING_PAYMENT"
                      ? "Menunggu Pembayaran"
                      : envelope.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Links */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Link Klaim untuk Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {envelope.recipients.map((recipient: any, index: number) => (
                  <div key={recipient.id} className="p-4 bg-muted/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{recipient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(recipient.allocatedAmount)}
                        </p>
                        {recipient.playableType !== "DIRECT" && (
                          <p className="text-xs text-primary mt-1">
                            {recipient.playableType === "GAME"
                              ? `🎮 ${recipient.gameType?.replace(/_/g, " ")}`
                              : `🧠 Quiz`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={claimLinks[index] || "Generating link..."}
                        readOnly
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono select-all"
                        onClick={(e) => {
                          if (claimLinks[index]) {
                            e.currentTarget.select();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(claimLinks[index], recipient.name)}
                        disabled={!claimLinks[index]}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareLink(claimLinks[index], recipient.name)}
                        disabled={!claimLinks[index]}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {envelopeId && (
              <Button
                onClick={() => router.push(`/envelope/${envelopeId}`)}
                size="lg"
                className="w-full"
              >
                <Check className="w-5 h-5" />
                Lihat Detail Amplop
              </Button>
            )}
            <Link href="/support" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                ❤️ Dukung BagiBerkah
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <ArrowRight className="w-5 h-5" />
              Kembali ke Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CreateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-48 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <CreateSuccessContent />
    </Suspense>
  );
}
