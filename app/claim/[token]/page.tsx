"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Confetti } from "@/components/animations/confetti";
import { api } from "@/lib/api";

// Import game components
import { MemoryCard } from "@/components/games/memory-card";
import { ScratchCard } from "@/components/games/scratch-card";
import { SpinWheel } from "@/components/games/spin-wheel";
import { BalloonPop } from "@/components/games/balloon-pop";
import { TreasureHunt } from "@/components/games/treasure-hunt";
import { QuizGame } from "@/components/quiz/quiz-game";

// Import claim components
import { EnvelopeView } from "@/components/claim/envelope-view";
import { RevealView } from "@/components/claim/reveal-view";
import { MethodSelection } from "@/components/claim/method-selection";
import { ClaimSuccess } from "@/components/claim/claim-success";
import { QRDisplayCard } from "@/components/qr/qr-display-card";

type Step = "loading" | "envelope" | "playable" | "reveal" | "method" | "claimed";
type PlayableType = "DIRECT" | "GAME" | "QUIZ";
type GameType = "MEMORY_CARD" | "SCRATCH_CARD" | "SPIN_WHEEL" | "BALLOON_POP" | "TREASURE_HUNT";

interface ClaimData {
  recipientName: string;
  amount: number;
  greeting: string;
  distributionMode: string;
  status: string;
  qrToken?: string;
  expiresAt?: string;
  playableType: PlayableType;
  gameType?: GameType;
  quizQuestions?: any[];
  gameCompleted: boolean;
}

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState<Step>("loading");
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
        const data = {
          recipientName: response.data.recipientName,
          amount: response.data.amount,
          greeting: response.data.greeting,
          distributionMode: response.data.distributionMode,
          status: response.data.status,
          qrToken: response.data.qrToken,
          expiresAt: response.data.expiresAt,
          playableType: response.data.playableType || "DIRECT",
          gameType: response.data.gameType,
          quizQuestions: response.data.quizQuestions,
          gameCompleted: response.data.gameCompleted || false,
        };
        
        setClaimData(data);
        
        // Check if already claimed/validated
        if (response.data.status === "VALIDATED" || response.data.status === "CLAIMED") {
          setStep("claimed");
          setClaimResult({
            ...response.data,
            claimMethod: response.data.claimMethod || 'cash',
          });
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
      // Check if needs playable (game/quiz)
      if (claimData && claimData.playableType !== "DIRECT" && !claimData.gameCompleted) {
        setStep("playable");
      } else {
        setStep("reveal");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 1500);
  };

  const handlePlayableComplete = async () => {
    // Mark game as completed
    try {
      await api.completeGame(token);
    } catch (err) {
      console.error("Failed to mark game complete:", err);
    }

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

  const renderPlayable = () => {
    if (!claimData) return null;

    if (claimData.playableType === "GAME") {
      switch (claimData.gameType) {
        case "MEMORY_CARD":
          return <MemoryCard onComplete={handlePlayableComplete} />;
        case "SCRATCH_CARD":
          return <ScratchCard onComplete={handlePlayableComplete} />;
        case "SPIN_WHEEL":
          return <SpinWheel onComplete={handlePlayableComplete} />;
        case "BALLOON_POP":
          return <BalloonPop onComplete={handlePlayableComplete} />;
        case "TREASURE_HUNT":
          return <TreasureHunt onComplete={handlePlayableComplete} />;
        default:
          return <ScratchCard onComplete={handlePlayableComplete} />;
      }
    } else if (claimData.playableType === "QUIZ" && claimData.quizQuestions) {
      return (
        <QuizGame
          questions={claimData.quizQuestions}
          onComplete={handlePlayableComplete}
        />
      );
    }

    return null;
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
            <EnvelopeView
              recipientName={claimData.recipientName}
              envelopeOpened={envelopeOpened}
              onOpen={handleOpenEnvelope}
            />
          )}

          {/* Playable Step (Game or Quiz) */}
          {step === "playable" && renderPlayable()}

          {/* Reveal Step */}
          {step === "reveal" && claimData && (
            <RevealView
              amount={claimData.amount}
              greeting={claimData.greeting}
              onNext={handleRevealNext}
            />
          )}

          {/* Method Selection Step */}
          {step === "method" && claimData && (
            <MethodSelection
              distributionMode={claimData.distributionMode}
              selectedMethod={selectedMethod}
              onMethodSelect={handleMethodSelect}
              onDigitalSubmit={handleDigitalClaim}
              submitting={submitting}
              error={error}
            />
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
