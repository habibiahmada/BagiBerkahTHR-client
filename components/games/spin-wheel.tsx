"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SpinWheelProps {
  onComplete: () => void;
}

const SEGMENTS = [
  { label: "WIN!", color: "#10b981", textColor: "#fff" },
  { label: "SPIN", color: "#3b82f6", textColor: "#fff" },
  { label: "AGAIN", color: "#a855f7", textColor: "#fff" },
  { label: "TRY", color: "#ec4899", textColor: "#fff" },
];

const NUM_SEGMENTS = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

// Build SVG wheel as a data URI
function buildWheelSVG(segments: typeof SEGMENTS, size = 300) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const textR = r * 0.65;

  function polarToCart(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  let paths = "";
  let texts = "";

  segments.forEach((seg, i) => {
    const startAngle = i * SEGMENT_ANGLE;
    const endAngle = startAngle + SEGMENT_ANGLE;
    const midAngle = startAngle + SEGMENT_ANGLE / 2;

    const s = polarToCart(startAngle, r);
    const e = polarToCart(endAngle, r);
    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

    paths += `<path d="M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${largeArc},1 ${e.x},${e.y} Z" fill="${seg.color}" stroke="white" stroke-width="3"/>`;

    // Label text
    const textPos = polarToCart(midAngle, textR);
    texts += `<text x="${textPos.x}" y="${textPos.y}" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="800" fill="${seg.textColor}" font-family="'Arial Black', sans-serif" transform="rotate(${midAngle}, ${textPos.x}, ${textPos.y})">${seg.label}</text>`;
  });

  // Divider lines
  let lines = "";
  segments.forEach((_, i) => {
    const angle = i * SEGMENT_ANGLE;
    const p = polarToCart(angle, r);
    lines += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="white" stroke-width="2.5"/>`;
  });

  // Center circle
  const centerCircle = `<circle cx="${cx}" cy="${cy}" r="32" fill="white" filter="url(#shadow)"/><text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="28">🎯</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
    </defs>
    ${paths}
    ${lines}
    ${texts}
    ${centerCircle}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function SpinWheel({ onComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    // Always lands on WIN (segment 0 = WIN!, centered at 0°)
    // Pointer is at top (0° = 12 o'clock), segment 0 starts at 0°
    // To land on center of segment 0, need midAngle = SEGMENT_ANGLE / 2 = 45°
    // So we offset to center: finalOffset = 360 - 45 = 315
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    const finalRotation = rotation + spins * 360 + 315;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      setTimeout(onComplete, 1000);
    }, 4000);
  };

  const wheelSrc = buildWheelSVG(SEGMENTS, 300);

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
        <div className="relative w-[300px] h-[300px]">
          {/* Pointer - pointing down to the wheel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div 
              className="w-0 h-0"
              style={{
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderTop: '32px solid #ef4444',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            />
          </div>

          {/* Wheel Container */}
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <img
                src={wheelSrc}
                alt="spin wheel"
                className="w-full h-full rounded-full block"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    : 'none',
                }}
              />
            </div>
          </div>
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
