"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, QrCode, Copy, Share2, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QRScanner } from "@/components/qr/qr-scanner";
import { api } from "@/lib/api";
import { formatCurrency, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface Recipient {
  id: string;
  name: string;
  allocatedAmount: number;
  playableType: "DIRECT" | "GAME" | "QUIZ";
  gameType?: string;
  quizTemplateId?: string;
  claim: {
    token: string;
    status: string;
    claimedAt?: string;
    validatedAt?: string;
  };
}

interface EnvelopeData {
  id: string;
  envelopeName: string;
  accessCode: string;
  totalBudget: number;
  distributionMode: string;
  status: string;
  createdAt: string;
  recipients: Recipient[];
}

export default function EnvelopeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const envelopeId = params.id as string;

  const [envelope, setEnvelope] = useState<EnvelopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    fetchEnvelopeData();
  }, [envelopeId]);

  const fetchEnvelopeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await api.getEnvelope(envelopeId);

      if (response.success) {
        setEnvelope(response.data);
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

  const handleQRScan = async (qrToken: string) => {
    try {
      const response: any = await api.validateQR(qrToken);

      if (response.success && response.data.valid) {
        setScanResult({
          success: true,
          recipientName: response.data.recipientName,
          amount: response.data.amount,
        });
        
        // Refresh envelope data
        setTimeout(() => {
          fetchEnvelopeData();
          setShowScanner(false);
          setScanResult(null);
        }, 3000);
      } else {
        setScanResult({
          success: false,
          message: response.data?.message || "QR code tidak valid",
        });
      }
    } catch (err: any) {
      console.error("QR Validation Error:", err);
      setScanResult({
        success: false,
        message: err.message || "Terjadi kesalahan",
      });
    }
  };

  const handleCopyLink = async (token: string, recipientName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const link = `${baseUrl}/claim/${token}`;
    
    try {
      const success = await copyToClipboard(link);
      if (success) {
        addToast(`Link untuk ${recipientName} telah disalin!`, 'success');
      } else {
        addToast('Gagal menyalin link. Silakan copy manual.', 'error');
      }
    } catch (err) {
      console.error('Copy error:', err);
      addToast('Gagal menyalin link. Silakan copy manual.', 'error');
    }
  };

  const handleShareLink = async (token: string, recipientName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const link = `${baseUrl}/claim/${token}`;

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
      handleCopyLink(token, recipientName);
    }
  };

  const getStatusIcon = (status: string, mode: string) => {
    switch (status) {
      case "VALIDATED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "CLAIMED":
        // For digital mode, CLAIMED means complete (transfer processing)
        // For cash mode, CLAIMED means waiting for QR validation
        return mode === "DIGITAL" 
          ? <CheckCircle className="w-5 h-5 text-green-600" />
          : <Clock className="w-5 h-5 text-blue-600" />;
      case "OPENED":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "EXPIRED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, mode: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      PENDING: { variant: "default", label: "Belum Dibuka" },
      OPENED: { variant: "warning", label: "Sudah Dibuka" },
      CLAIMED: mode === "DIGITAL" 
        ? { variant: "success", label: "Transfer Diproses" }
        : { variant: "info", label: "Menunggu Validasi" },
      VALIDATED: { variant: "success", label: "Selesai" },
      EXPIRED: { variant: "error", label: "Kadaluarsa" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlayableBadge = (playableType: string, gameType?: string) => {
    if (!playableType || playableType === "DIRECT") {
      return <Badge variant="default">Langsung</Badge>;
    } else if (playableType === "GAME" && gameType) {
      const gameNames: Record<string, string> = {
        MEMORY_CARD: "Memory Card",
        SCRATCH_CARD: "Scratch Card",
        SPIN_WHEEL: "Spin Wheel",
        BALLOON_POP: "Balloon Pop",
        TREASURE_HUNT: "Treasure Hunt",
      };
      return (
        <Badge variant="info">
          🎮 {gameNames[gameType] || gameType.replace(/_/g, " ")}
        </Badge>
      );
    } else if (playableType === "QUIZ") {
      return <Badge variant="info">🧠 Quiz</Badge>;
    }
    return <Badge variant="default">Langsung</Badge>;
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
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || !envelope) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const claimedCount = envelope.recipients.filter((r) => {
    // For digital mode, CLAIMED is complete
    // For cash mode, only VALIDATED is complete
    if (envelope.distributionMode === "DIGITAL") {
      return r.claim.status === "CLAIMED" || r.claim.status === "VALIDATED";
    } else {
      return r.claim.status === "VALIDATED";
    }
  }).length;
  const progress = (claimedCount / envelope.recipients.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {envelope.envelopeName || "Detail Amplop"}
            </h1>
            <p className="text-muted-foreground">
              Kelola dan pantau status klaim penerima
            </p>
          </div>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Access Code Display */}
              {envelope.accessCode && (
                <div className="mb-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Kode Amplop
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <p 
                        className="text-3xl font-bold text-primary tracking-wider font-mono select-all cursor-pointer"
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
                        onClick={async () => {
                          try {
                            const success = await copyToClipboard(envelope.accessCode);
                            if (success) {
                              addToast('Kode amplop berhasil disalin!', 'success');
                            } else {
                              addToast('Gagal menyalin kode amplop.', 'error');
                            }
                          } catch (err) {
                            console.error('Copy error:', err);
                            addToast('Gagal menyalin kode amplop.', 'error');
                          }
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Klik untuk select atau gunakan tombol copy
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Budget:</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(envelope.totalBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <Badge variant="default">
                      {envelope.distributionMode === "DIGITAL" ? "Digital" : "Cash"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dibuat:</span>
                    <span className="text-foreground">
                      {new Date(envelope.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Penerima:</span>
                    <span className="font-bold text-foreground">
                      {envelope.recipients.length} orang
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diklaim:</span>
                    <span className="font-bold text-green-600">
                      {claimedCount} orang
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-bold text-foreground">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Scanner Button (Cash Mode Only) */}
          {envelope.distributionMode === "CASH" && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Validasi QR Code
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Scan QR code penerima untuk validasi dan tandai sebagai tervalidasi
                    </p>
                  </div>
                  <Button onClick={() => setShowScanner(true)}>
                    <QrCode className="w-4 h-4" />
                    Scan QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipients List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {envelope.recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="p-4 border border-border rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(recipient.claim.status, envelope.distributionMode)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {recipient.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(recipient.allocatedAmount)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {getPlayableBadge(recipient.playableType, recipient.gameType)}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(recipient.claim.status, envelope.distributionMode)}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCopyLink(recipient.claim.token, recipient.name)
                          }
                        >
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleShareLink(recipient.claim.token, recipient.name)
                          }
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </div>

                    {recipient.claim.claimedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Diklaim: {new Date(recipient.claim.claimedAt).toLocaleString("id-ID")}
                      </p>
                    )}
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* QR Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code Penerima</DialogTitle>
          </DialogHeader>
          
          {scanResult ? (
            <div className="py-6">
              {scanResult.success ? (
                <Alert variant="success">
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    <span className="font-semibold mb-1">Validasi Berhasil!</span>
                    <p>
                      {scanResult.recipientName} - {formatCurrency(scanResult.amount)}
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="error">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription>{scanResult.message}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <QRScanner
              onScan={handleQRScan}
              onError={(error) => {
                setScanResult({ success: false, message: error });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
