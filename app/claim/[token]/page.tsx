"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BankAccountForm } from "@/components/claim/bank-account-form";
import { QRDisplayCard } from "@/components/qr/qr-display-card";
import { ClaimSuccess } from "@/components/claim/claim-success";
import { Confetti } from "@/components/animations/confetti";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface ClaimData {
  recipientName: string;
  amount: number;
  greeting: string;
  distributionMode: string;
  status: string;
  qrToken?: string;
  expiresAt?: string;
}

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState<
    "loading" | "envelope" | "quiz" | "reveal" | "method" | "claimed"
  >("loading");
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"digital" | "cash" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchClaimData();
  }, [token]);

  const fetchClaimData = async () => {
    try {
      const response: any = await api.getClaim(token);
      
      if (response.success) {
        setClaimData({
          recipientName: response.data.recipientName,
          amount: response.data.amount,
          greeting: response.data.greeting,
          distributionMode: response.data.distributionMode,
          status: response.data.status,
          qrToken: response.data.qrToken,
          expiresAt: response.data.expiresAt,
        });
        
        // Check if already claimed/validated
        if (response.data.status === "VALIDATED") {
          setStep("claimed");
          setClaimResult({
            ...response.data,
            claimMethod: response.data.claimMethod || 'cash',
          });
        } else if (response.data.status === "CLAIMED") {
          // Already submitted, show appropriate view based on claimMethod
          const method = response.data.claimMethod || 'digital';
          setSelectedMethod(method);
          setClaimResult({
            ...response.data,
            claimMethod: method,
          });
          setStep("claimed");
        } else {
          setStep("envelope");
        }
      } else {
        setError(response.error?.message || "Gagal memuat data klaim");
      }
    } catch (err: any) {
      console.error("Fetch Claim Error:", err);
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      setStep("quiz");
    }, 1500);
  };

  const handleQuizAnswer = () => {
    setStep("reveal");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleRevealNext = () => {
    setStep("method");
  };

  const handleMethodSelect = (method: "digital" | "cash") => {
    setSelectedMethod(method);
    if (method === "cash") {
      handleCashClaim();
    }
  };

  const handleDigitalClaim = async (bankName: string, accountNumber: string, accountHolderName: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const response: any = await api.submitClaim(token, {
        claimMethod: "digital",
        bankAccount: accountNumber,
        bankName: bankName,
        accountHolderName: accountHolderName,
      });

      if (response.success) {
        setClaimResult({
          ...response.data,
          bankName,
          accountNumber,
        });
        setStep("claimed");
      } else {
        throw new Error(response.error?.message || "Gagal submit klaim");
      }
    } catch (err: any) {
      console.error("Digital Claim Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCashClaim = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response: any = await api.submitClaim(token, {
        claimMethod: "cash",
      });

      if (response.success) {
        setClaimResult(response.data);
        setStep("claimed");
      } else {
        throw new Error(response.error?.message || "Gagal submit klaim");
      }
    } catch (err: any) {
      console.error("Cash Claim Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat amplop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Envelope Step */}
          {step === "envelope" && claimData && (
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  THR untuk {claimData.recipientName}
                </h1>
                <p className="text-muted-foreground">
                  Ada amplop THR untukmu! Tap untuk membuka
                </p>
              </div>

              <div
                className={`relative mx-auto w-64 h-80 cursor-pointer transition-transform duration-500 ${
                  envelopeOpened ? "scale-110 rotate-6" : "hover:scale-105"
                }`}
                onClick={handleOpenEnvelope}
              >
                <div className="absolute inset-0 bg-gradient-hero rounded-3xl shadow-elevated flex items-center justify-center">
                  <div className="text-primary-foreground text-center">
                    <div className="text-6xl mb-4">✉️</div>
                    <p className="text-xl font-semibold">Tap untuk buka</p>
                  </div>
                </div>
              </div>

              {!envelopeOpened && (
                <p className="text-sm text-muted-foreground">
                  Ketuk amplop untuk membukanya
                </p>
              )}
            </div>
          )}

          {/* Quiz Step */}
          {step === "quiz" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Mini Quiz Ramadhan 🌙
                </CardTitle>
                <CardDescription className="text-center">
                  Pilih jawaban yang menurutmu benar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-lg mb-4 text-foreground">
                    Bulan Ramadhan adalah bulan ke berapa dalam kalender
                    Hijriyah?
                  </p>
                  <div className="space-y-2">
                    <QuizOption
                      label="A. Bulan ke-8"
                      onClick={handleQuizAnswer}
                    />
                    <QuizOption
                      label="B. Bulan ke-9"
                      onClick={handleQuizAnswer}
                      correct
                    />
                    <QuizOption
                      label="C. Bulan ke-10"
                      onClick={handleQuizAnswer}
                    />
                    <QuizOption
                      label="D. Bulan ke-11"
                      onClick={handleQuizAnswer}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reveal Step */}
          {step === "reveal" && claimData && (
            <div className="text-center space-y-8">
              <div className="animate-bounce">
                <div className="text-8xl mb-4">🎉</div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Selamat!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-primary-lighter rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-2">
                      Kamu menerima
                    </p>
                    <p className="text-5xl font-bold text-primary mb-4">
                      {formatCurrency(claimData.amount)}
                    </p>
                    <div className="p-4 bg-card rounded-xl">
                      <p className="text-foreground italic">
                        &ldquo;{claimData.greeting}&rdquo;
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleRevealNext} className="w-full" size="lg">
                    Lanjutkan untuk Klaim
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Method Selection Step */}
          {step === "method" && claimData && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Pilih Metode Penerimaan
                </h2>
                <p className="text-muted-foreground">
                  Bagaimana Anda ingin menerima THR?
                </p>
              </div>

              {claimData.distributionMode === "DIGITAL" ? (
                <Tabs value={selectedMethod || "digital"} onValueChange={(v) => handleMethodSelect(v as any)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="digital" className="flex-1">
                      Transfer Bank
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="digital" className="mt-6">
                    {error && (
                      <Alert variant="error" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <BankAccountForm
                      onSubmit={handleDigitalClaim}
                      loading={submitting}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <Alert variant="error">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Alert variant="info">
                    <AlertDescription>
                      Mode Cash: Anda akan mendapatkan QR code untuk divalidasi saat bertemu pengirim.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => handleMethodSelect("cash")}
                    disabled={submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? "Memproses..." : "Generate QR Code"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Claimed Step */}
          {step === "claimed" && claimData && claimResult && (
            <div>
              {(claimResult.claimMethod === "digital" || (claimResult.bankAccount && claimResult.bankName)) ? (
                <ClaimSuccess
                  amount={claimData.amount}
                  recipientName={claimData.recipientName}
                  claimMethod="digital"
                  bankName={claimResult.bankName}
                  accountNumber={claimResult.bankAccount}
                />
              ) : (
                <QRDisplayCard
                  qrToken={claimResult.qrToken}
                  recipientName={claimData.recipientName}
                  amount={claimData.amount}
                  expiresAt={claimData.expiresAt || ""}
                  status={claimResult.status}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Confetti Effect */}
      <Confetti active={showConfetti} />
    </div>
  );
}

function QuizOption({
  label,
  onClick,
  correct,
}: {
  label: string;
  onClick: () => void;
  correct?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 text-left rounded-xl border-2 border-border text-foreground hover:border-primary hover:bg-primary-lighter transition-colors cursor-pointer"
    >
      {label}
    </button>
  );
}
