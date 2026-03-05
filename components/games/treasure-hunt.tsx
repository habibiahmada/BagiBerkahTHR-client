"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TreasureHuntProps {
  onComplete: () => void;
}

export function TreasureHunt({ onComplete }: TreasureHuntProps) {
  const [tiles, setTiles] = useState(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      revealed: false,
      hasTreasure: i === 7, // Treasure at position 7
      content: i === 7 ? "🏆" : "❌",
    }))
  );
  const [attempts, setAttempts] = useState(0);
  const [foundTreasure, setFoundTreasure] = useState(false);
  const maxAttempts = 10;

  const handleTileClick = (id: number) => {
    const tile = tiles.find((t) => t.id === id);
    if (!tile || tile.revealed || foundTreasure) return;

    setTiles(tiles.map((t) => (t.id === id ? { ...t, revealed: true } : t)));
    setAttempts(attempts + 1);

    if (tile.hasTreasure) {
      setFoundTreasure(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Treasure Hunt 🗺️</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Cari harta karun tersembunyi! Percobaan: {attempts}/{maxAttempts}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {tiles.map((tile) => (
            <motion.button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.revealed || foundTreasure || attempts >= maxAttempts}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all ${
                tile.revealed
                  ? tile.hasTreasure
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50"
                  : "bg-muted hover:bg-muted/80"
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: tile.revealed ? 1 : 1.05 }}
            >
              {tile.revealed ? tile.content : "?"}
            </motion.button>
          ))}
        </div>

        {foundTreasure && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xl font-bold text-primary animate-bounce">
              🎉 Selamat! Kamu menemukan harta karun! 🎉
            </p>
          </motion.div>
        )}

        {!foundTreasure && attempts >= maxAttempts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-lg font-bold text-destructive mb-2">
              Percobaan habis! 😢
            </p>
            <p className="text-sm text-muted-foreground">
              Tapi jangan khawatir, kamu tetap mendapat hadiah!
            </p>
            <motion.button
              onClick={onComplete}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lanjutkan
            </motion.button>
          </motion.div>
        )}

        {!foundTreasure && attempts < maxAttempts && (
          <p className="text-center text-sm text-muted-foreground">
            Klik kotak untuk mencari harta karun
          </p>
        )}
      </CardContent>
    </Card>
  );
}
