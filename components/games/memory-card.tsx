"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MemoryCardProps {
  onComplete: () => void;
}

const CARD_EMOJIS = ["🎁", "🌟", "🎈", "🎉", "🎊", "🎯"];

interface CardItem {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryCard({ onComplete }: MemoryCardProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = CARD_EMOJIS.flatMap((emoji, index) => [
      { id: index * 2, emoji, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false },
    ]);

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMoves(0);
    setFlippedCards([]);
  };

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    // Flip the card
    setCards(cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(
            cards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);

          // Check if all matched
          const allMatched = cards.every(
            (c) => c.isMatched || c.id === firstId || c.id === secondId
          );
          if (allMatched) {
            setTimeout(onComplete, 500);
          }
        }, 600);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(
            cards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Memory Card Game 🎴</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Cocokkan semua pasangan kartu! Moves: {moves}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || isChecking}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all ${
                card.isFlipped || card.isMatched
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              } ${card.isMatched ? "opacity-50" : ""}`}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotateY: card.isFlipped || card.isMatched ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
            >
              {card.isFlipped || card.isMatched ? card.emoji : "?"}
            </motion.button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={initializeGame}
          className="w-full"
          size="sm"
        >
          Reset Game
        </Button>
      </CardContent>
    </Card>
  );
}
