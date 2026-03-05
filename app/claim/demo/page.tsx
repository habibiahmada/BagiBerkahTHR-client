"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Confetti } from "@/components/animations/confetti";
import { formatCurrency } from "@/lib/utils";

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

type Step = "envelope" | "playable" | "reveal" | "complete";
type DemoType = "game" | "quiz" | "direct";

// Demo data
const DEMO_DATA = {
  recipientName: "Demo User",
  amount: 100000,
  greeting: "Selamat mencoba fitur BagiBerkah! Ini adalah demo interaktif untuk menunjukkan pengalaman penerima THR.",
};

const QUIZ_DEMO = [
  {
    question: "Apa nama platform ini?",
    options: ["BagiBerkah", "THR Quest", "Amplop Digital", "Ramadhan App"],
    correctAnswer: 0,
    explanation: "BagiBerkah adalah platform AI untuk membagikan THR secara adil dan menyenangkan.",
  },
  {
    question: "Fitur apa yang membuat BagiBerkah unik?",
    options: ["Transfer bank", "AI allocation", "QR code", "Semua benar"],
    correctAnswer: 3,
    explanation: "BagiBerkah memiliki AI allocation, transfer bank, QR code, dan game interaktif!",
  },
  {
    question: "Siapa yang bisa menggunakan BagiBerkah?",
    options: ["Hanya dewasa", "Hanya anak-anak", "Semua usia", "Hanya remaja"],
    correctAnswer: 2,
    explanation: "BagiBerkah dirancang untuk semua usia dengan pengalaman yang disesuaikan.",
  },
];

export default function DemoClaimPage() {
  const router = useRouter();
  const [demoType, setDemoType] = useState<DemoType | null>(null);
  const [step, setStep] = useState<Step>("envelope");
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      if (demoType && demoType !== "direct") {
        setStep("playable");
      } else {
        setStep("reveal");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 1500);
  };

  const handlePlayableComplete = () => {
    setStep("reveal");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleRevealNext = () => {
    setStep("complete");
  };

  const handleTryAgain = () => {
    setDemoType(null);
    setStep("envelope");
    setEnvelopeOpened(false);
    setShowConfetti(false);
  };

  const renderPlayable = () => {
    if (demoType === "game") {
      // Random game untuk demo
      const games = [
        <MemoryCard key="memory" onComplete={handlePlayableComplete} />,
        <ScratchCard key="scratch" onComplete={handlePlayableComplete} />,
        <SpinWheel key="spin" onComplete={handlePlayableComplete} />,
        <BalloonPop key="balloon" onComplete={handlePlayableComplete} />,
        <TreasureHunt key="treasure" onComplete={handlePlayableComplete} />,
      ];
      return games[Math.floor(Math.random() * games.length)];
    } else if (demoType === "quiz") {
      return (
        <QuizGame
          questions={QUIZ_DEMO}
          onComplete={handlePlayableComplete}
        />
      );
    }
    return null;
  };

  // Demo type selection
  if (!demoType) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Demo Klaim THR
              </h1>
              <p className="text-muted-foreground">
                Pilih pengalaman yang ingin Anda coba
              </p>
            </div>

            <Alert variant="info" className="mb-8">
              <AlertDescription>
                Ini adalah demo interaktif. Tidak ada data yang tersimpan dan tidak ada transaksi real.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setDemoType("game")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎮 Demo dengan Game
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mainkan game interaktif sebelum melihat nominal THR
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setDemoType("quiz")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🧠 Demo dengan Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Jawab pertanyaan tentang BagiBerkah sebelum melihat nominal
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setDemoType("direct")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Demo Langsung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Langsung lihat nominal tanpa game atau quiz
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                Kembali ke Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Demo Badge */}
          <Alert variant="warning" className="mb-6">
            <AlertDescription>
              🎭 Mode Demo - Tidak ada data yang tersimpan
            </AlertDescription>
          </Alert>

          {/* Envelope Step */}
          {step === "envelope" && (
            <EnvelopeView
              recipientName={DEMO_DATA.recipientName}
              envelopeOpened={envelopeOpened}
              onOpen={handleOpenEnvelope}
            />
          )}

          {/* Playable Step (Game or Quiz) */}
          {step === "playable" && renderPlayable()}

          {/* Reveal Step */}
          {step === "reveal" && (
            <RevealView
              amount={DEMO_DATA.amount}
              greeting={DEMO_DATA.greeting}
              onNext={handleRevealNext}
            />
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Demo Selesai! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Anda telah mencoba pengalaman penerima THR di BagiBerkah!
                  </p>
                  <div className="p-4 bg-primary-lighter rounded-xl mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Dalam mode real, penerima akan:
                    </p>
                    <ul className="text-sm text-left space-y-2">
                      <li>✅ Menerima link klaim personal</li>
                      <li>✅ Main game/quiz sesuai pilihan pengirim</li>
                      <li>✅ Melihat nominal dan ucapan personal</li>
                      <li>✅ Pilih metode penerimaan (Digital/Cash)</li>
                      <li>✅ Mendapat transfer otomatis atau QR code</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Coba Lagi dengan Mode Lain
                  </Button>
                  <Button
                    onClick={() => router.push("/create")}
                    size="lg"
                    className="w-full"
                  >
                    Buat Amplop THR Real
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                    variant="ghost"
                    size="lg"
                    className="w-full"
                  >
                    Kembali ke Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* Confetti Effect */}
      <Confetti active={showConfetti} />
    </div>
  );
}
