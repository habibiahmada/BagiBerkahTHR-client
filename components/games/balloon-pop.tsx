"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalloonPopProps {
  onComplete: () => void;
}

const BALLOON_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export function BalloonPop({ onComplete }: BalloonPopProps) {
  const [balloons, setBalloons] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      popped: false,
      hasPrize: i === 5, // Prize in balloon #5
      color: BALLOON_COLORS[i],
    }))
  );
  const [foundPrize, setFoundPrize] = useState(false);

  const handlePop = (id: number) => {
    const balloon = balloons.find((b) => b.id === id);
    if (!balloon || balloon.popped) return;

    setBalloons(
      balloons.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    if (balloon.hasPrize) {
      setFoundPrize(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Balloon Pop 🎈</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Pecahkan balon untuk menemukan hadiah!
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {balloons.map((balloon) => (
            <motion.button
              key={balloon.id}
              onClick={() => handlePop(balloon.id)}
              disabled={balloon.popped}
              className={`aspect-square rounded-full ${
                balloon.popped ? "bg-transparent" : balloon.color
              } relative overflow-hidden transition-all hover:scale-110 disabled:hover:scale-100`}
              whileTap={{ scale: 0.8 }}
              animate={
                balloon.popped
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              {!balloon.popped && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🎈</span>
                </div>
              )}
              {balloon.popped && balloon.hasPrize && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-4xl">🎁</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {foundPrize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xl font-bold text-primary animate-bounce">
              🎉 Selamat! Kamu menemukan hadiah! 🎉
            </p>
          </motion.div>
        )}

        {!foundPrize && (
          <p className="text-center text-sm text-muted-foreground">
            Pecahkan balon untuk mencari hadiah tersembunyi
          </p>
        )}
      </CardContent>
    </Card>
  );
}
