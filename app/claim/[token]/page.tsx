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
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency } from "@/lib/utils";

interface ClaimData {
  recipientName: string;
  amount: number;
  greeting: string;
  senderName: string;
}

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState<
    "loading" | "envelope" | "quiz" | "reveal" | "claimed"
  >("loading");
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClaimData({
        recipientName: "Adik Kecil",
        amount: 150000,
        greeting:
          "Selamat Idul Fitri! Semoga kamu makin rajin dan bahagia selalu 🌙",
        senderName: "Kakak",
      });
      setStep("envelope");
    }, 1000);
  }, [token]);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      setStep("quiz");
    }, 1500);
  };

  const handleQuizAnswer = () => {
    setStep("reveal");
  };

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
                  THR dari {claimData.senderName}
                </h1>
                <p className="text-muted-foreground">
                  Hai {claimData.recipientName}! Ada amplop THR untukmu
                </p>
              </div>

              <div
                className={`relative mx-auto w-64 h-80 cursor-pointer transition-transform duration-500 ${envelopeOpened ? "scale-110 rotate-6" : "hover:scale-105"
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

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      💳 Pilih Metode Pencairan
                    </Button>
                    <Button className="w-full" size="lg" variant="outline">
                      📱 Tampilkan QR Code
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Pilih cara untuk menerima THR-mu
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
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
