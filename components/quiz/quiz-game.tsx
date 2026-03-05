"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export function QuizGame({ questions, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === question.correctAnswer) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongAnswers([...wrongAnswers, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Check if all answered correctly
      if (wrongAnswers.length === 0 && isCorrect) {
        onComplete();
      } else {
        // Retry wrong answers
        setCurrentQuestion(wrongAnswers[0]);
        setWrongAnswers(wrongAnswers.slice(1));
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Quiz Challenge 🧠</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Pertanyaan {currentQuestion + 1} dari {questions.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <p className="text-lg font-medium text-foreground">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectOption;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  showCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : showWrong
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary hover:bg-primary/5"
                }`}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{option}</span>
                  {showCorrect && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {showWrong && <X className="w-5 h-5 text-red-600" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              isCorrect
                ? "bg-green-50 dark:bg-green-950 border-2 border-green-500"
                : "bg-red-50 dark:bg-red-950 border-2 border-red-500"
            }`}
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "✅ Benar!" : "❌ Salah!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {question.explanation}
            </p>
          </motion.div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button onClick={handleNext} className="w-full" size="lg">
            {isLastQuestion && wrongAnswers.length === 0 && isCorrect
              ? "Selesai! 🎉"
              : wrongAnswers.length > 0 && isLastQuestion
              ? "Ulangi Soal yang Salah"
              : "Lanjut"}
          </Button>
        )}

        {/* Score */}
        <div className="text-center text-sm text-muted-foreground">
          Benar: {correctCount} | Salah: {wrongAnswers.length}
        </div>
      </CardContent>
    </Card>
  );
}
