"use client";

import { useState } from "react";
import { Gamepad2, Brain, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlayableType = "DIRECT" | "GAME" | "QUIZ";
type GameType = "MEMORY_CARD" | "SPIN_WHEEL" | "SCRATCH_CARD" | "BALLOON_POP" | "TREASURE_HUNT";
type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

interface PlayableConfig {
  playableType: PlayableType;
  gameType?: GameType;
  quizTopic?: string;
  quizDifficulty?: QuizDifficulty;
  playableReasoning?: string;
}

interface PlayableSelectorProps {
  recipientName: string;
  config: PlayableConfig;
  onChange: (config: PlayableConfig) => void;
}

const GAME_OPTIONS = [
  { value: "MEMORY_CARD", label: "Memory Card 🎴", desc: "Cocokkan kartu" },
  { value: "SCRATCH_CARD", label: "Scratch Card 🎫", desc: "Gores kartu" },
  { value: "SPIN_WHEEL", label: "Spin Wheel 🎡", desc: "Putar roda" },
  { value: "BALLOON_POP", label: "Balloon Pop 🎈", desc: "Pecahkan balon" },
  { value: "TREASURE_HUNT", label: "Treasure Hunt 🗺️", desc: "Cari harta karun" },
];

export function PlayableSelector({ recipientName, config, onChange }: PlayableSelectorProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePlayableTypeChange = (type: PlayableType) => {
    const newConfig: PlayableConfig = {
      ...config,
      playableType: type,
    };

    // Set default game type if GAME selected
    if (type === "GAME" && !config.gameType) {
      newConfig.gameType = "MEMORY_CARD";
    }

    // Set default quiz settings if QUIZ selected
    if (type === "QUIZ") {
      if (!config.quizTopic) newConfig.quizTopic = "";
      if (!config.quizDifficulty) newConfig.quizDifficulty = "MEDIUM";
    }

    onChange(newConfig);
  };

  const getPlayableIcon = () => {
    switch (config.playableType) {
      case "GAME":
        return <Gamepad2 className="w-4 h-4 text-blue-500" />;
      case "QUIZ":
        return <Brain className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const getPlayableLabel = () => {
    switch (config.playableType) {
      case "GAME":
        const game = GAME_OPTIONS.find(g => g.value === config.gameType);
        return game ? game.label : "Game";
      case "QUIZ":
        return `Quiz: ${config.quizTopic || "Belum diatur"}`;
      default:
        return "Langsung";
    }
  };

  return (
    <Card className="border-2 border-muted">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getPlayableIcon()}
            <span className="font-medium text-sm">{getPlayableLabel()}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* AI Reasoning */}
        {config.playableReasoning && !expanded && (
          <p className="text-xs text-muted-foreground mb-2">
            💡 {config.playableReasoning}
          </p>
        )}

        {/* Expanded Configuration */}
        {expanded && (
          <div className="space-y-4 pt-3 border-t">
            {/* AI Reasoning */}
            {config.playableReasoning && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Rekomendasi AI:</strong> {config.playableReasoning}
                </p>
              </div>
            )}

            {/* Playable Type Selection */}
            <div>
              <Label className="text-xs">Mode Penerimaan</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handlePlayableTypeChange("DIRECT")}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    config.playableType === "DIRECT"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Zap className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">Langsung</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePlayableTypeChange("GAME")}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    config.playableType === "GAME"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">Game</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePlayableTypeChange("QUIZ")}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    config.playableType === "QUIZ"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-border hover:border-purple-500/50"
                  }`}
                >
                  <Brain className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">Quiz</span>
                </button>
              </div>
            </div>

            {/* Game Type Selection */}
            {config.playableType === "GAME" && (
              <div>
                <Label htmlFor={`game-${recipientName}`} className="text-xs">
                  Pilih Game
                </Label>
                <Select
                  id={`game-${recipientName}`}
                  value={config.gameType || "MEMORY_CARD"}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      gameType: e.target.value as GameType,
                    })
                  }
                  className="mt-1"
                >
                  {GAME_OPTIONS.map((game) => (
                    <option key={game.value} value={game.value}>
                      {game.label} - {game.desc}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Quiz Configuration */}
            {config.playableType === "QUIZ" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`topic-${recipientName}`} className="text-xs">
                    Topik Quiz
                  </Label>
                  <Input
                    id={`topic-${recipientName}`}
                    placeholder="Contoh: Sejarah Indonesia"
                    value={config.quizTopic || ""}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        quizTopic: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`difficulty-${recipientName}`} className="text-xs">
                    Tingkat Kesulitan
                  </Label>
                  <Select
                    id={`difficulty-${recipientName}`}
                    value={config.quizDifficulty || "MEDIUM"}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        quizDifficulty: e.target.value as QuizDifficulty,
                      })
                    }
                    className="mt-1"
                  >
                    <option value="EASY">Mudah</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HARD">Sulit</option>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
