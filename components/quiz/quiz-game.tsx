"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: boolean}>({});
  const [wrongAttempts, setWrongAttempts] = useState<{[key: number]: number}>({});

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const allQuestionsAnswered = Object.keys(answeredQuestions).length === questions.length;
  const canNavigate = answeredQuestions[currentQuestion] === true;

  const handleAnswerSelect = (index: number) => {
    if (showResult || answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === question.correctAnswer) {
      // Mark as answered correctly
      setAnsweredQuestions({
        ...answeredQuestions,
        [currentQuestion]: true
      });
    } else {
      // Track wrong attempts
      setWrongAttempts({
        ...wrongAttempts,
        [currentQuestion]: (wrongAttempts[currentQuestion] || 0) + 1
      });
    }
  };

  const handleRetry = () => {
    // Reset current question to retry
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (allQuestionsAnswered) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Quiz Challenge 🧠</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Jawab semua pertanyaan dengan benar untuk melanjutkan
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{
              width: `${(Object.keys(answeredQuestions).length / questions.length) * 100}%`,
            }}
          />
        </div>
        
        {/* Question navigation dots */}
        <div className="flex justify-center gap-2 mt-3">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                index === currentQuestion
                  ? "bg-primary text-primary-foreground scale-110"
                  : answeredQuestions[index]
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
              }`}
            >
              {index + 1}
            </button>
          ))}
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
            const isDisabled = answeredQuestions[currentQuestion] === true;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult || isDisabled}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  showCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : showWrong
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : isDisabled
                    ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                    : "border-border hover:border-primary hover:bg-primary/5"
                }`}
                whileTap={{ scale: showResult || isDisabled ? 1 : 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className={`${
                    showCorrect || (isDisabled && isCorrectOption)
                      ? "text-green-900 dark:text-green-100 font-medium"
                      : showWrong
                      ? "text-red-900 dark:text-red-100 font-medium"
                      : "text-foreground"
                  }`}>
                    {option}
                  </span>
                  {showCorrect && (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                  {showWrong && <X className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  {isDisabled && isCorrectOption && (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
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
            <p className={`font-semibold mb-2 ${
              isCorrect 
                ? "text-green-900 dark:text-green-100" 
                : "text-red-900 dark:text-red-100"
            }`}>
              {isCorrect ? "✅ Benar!" : "❌ Salah!"}
            </p>
            <p className={`text-sm ${
              isCorrect 
                ? "text-green-800 dark:text-green-200" 
                : "text-red-800 dark:text-red-200"
            }`}>
              {question.explanation}
            </p>
            {!isCorrect && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                Coba lagi! Pilih jawaban yang benar.
              </p>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {/* Retry or Next Button */}
          {showResult && !isCorrect ? (
            <Button onClick={handleRetry} className="flex-1" variant="default">
              Coba Lagi
            </Button>
          ) : canNavigate ? (
            <Button onClick={handleNext} className="flex-1">
              {currentQuestion === questions.length - 1 && allQuestionsAnswered
                ? "Selesai! 🎉"
                : "Lanjut"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : null}
        </div>

        {/* Score */}
        <div className="text-center text-sm space-y-1">
          <p className="text-muted-foreground">
            Benar: {Object.keys(answeredQuestions).length} / {questions.length}
          </p>
          {Object.keys(wrongAttempts).length > 0 && (
            <p className="text-xs text-red-600">
              Total percobaan salah: {Object.values(wrongAttempts).reduce((a, b) => a + b, 0)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
