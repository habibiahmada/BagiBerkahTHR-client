"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScratchCardProps {
  onComplete: () => void;
}

export function ScratchCard({ onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw scratch layer
    ctx.fillStyle = "#9ca3af";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Gores di sini!", canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || completed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 70 && !completed) {
      setCompleted(true);
      setTimeout(onComplete, 500);
    }
  };

  const handleMouseDown = () => setIsScratching(true);
  const handleMouseUp = () => setIsScratching(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Scratch Card 🎫</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Gores untuk mengungkap hadiah! ({Math.round(scratchPercentage)}%)
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video bg-gradient-to-br from-primary to-primary/70 rounded-xl overflow-hidden">
          {/* Prize underneath */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🎁</div>
              <p className="text-2xl font-bold text-primary-foreground">
                Selamat!
              </p>
            </div>
          </div>

          {/* Scratch layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          />
        </div>
      </CardContent>
    </Card>
  );
}
