"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SpinWheelProps {
  onComplete: () => void;
}

export function SpinWheel({ onComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Random rotation (always lands on WIN)
    // WIN is at 0 degrees, so we rotate to a multiple of 360
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = spins * 360;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      setTimeout(onComplete, 1000);
    }, 4000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Spin the Wheel 🎡</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Putar roda untuk mendapatkan hadiah!
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Wheel */}
        <div className="relative w-64 h-64">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-primary" />
          </div>

          {/* Wheel */}
          <motion.div
            className="w-full h-full rounded-full relative overflow-hidden shadow-lg"
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: "easeOut",
            }}
          >
            {/* Segments */}
            <div className="absolute inset-0">
              {/* WIN segment (top) */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 clip-segment-1">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-primary-foreground font-bold text-xl">
                  WIN
                </div>
              </div>
              
              {/* Other segments */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 clip-segment-2">
                <div className="absolute top-1/2 right-8 text-white font-bold text-lg rotate-90">
                  SPIN
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 clip-segment-3">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-bold text-lg rotate-180">
                  AGAIN
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 clip-segment-4">
                <div className="absolute top-1/2 left-8 text-white font-bold text-lg -rotate-90">
                  TRY
                </div>
              </div>
            </div>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="text-2xl">🎯</div>
            </div>
          </motion.div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning || hasSpun}
          size="lg"
          className="w-full"
        >
          {isSpinning ? "Berputar..." : hasSpun ? "Selesai!" : "Putar Roda"}
        </Button>

        {hasSpun && (
          <p className="text-center text-primary font-bold text-xl animate-bounce">
            🎉 Selamat! Kamu Menang! 🎉
          </p>
        )}
      </CardContent>

      <style jsx>{`
        .clip-segment-1 {
          clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%);
        }
        .clip-segment-2 {
          clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
        }
        .clip-segment-3 {
          clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%);
        }
        .clip-segment-4 {
          clip-path: polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%);
        }
      `}</style>
    </Card>
  );
}
