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
            <div className="w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-30 border-t-primary" />
          </div>

          {/* Wheel */}
          <motion.div
            className="w-full h-full rounded-full relative overflow-hidden shadow-lg border-4 border-white"
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: "easeOut",
            }}
            style={{ background: 'conic-gradient(from 0deg, #10b981 0deg 90deg, #3b82f6 90deg 180deg, #a855f7 180deg 270deg, #ec4899 270deg 360deg)' }}
          >
            {/* Text labels */}
            <div className="absolute inset-0">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-white font-bold text-2xl drop-shadow-lg">
                WIN
              </div>
              <div className="absolute top-1/2 right-12 -translate-y-1/2 text-white font-bold text-xl drop-shadow-lg rotate-90 origin-center">
                SPIN
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white font-bold text-xl drop-shadow-lg rotate-180 origin-center">
                AGAIN
              </div>
              <div className="absolute top-1/2 left-12 -translate-y-1/2 text-white font-bold text-xl drop-shadow-lg -rotate-90 origin-center">
                TRY
              </div>
            </div>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
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
    </Card>
  );
}
