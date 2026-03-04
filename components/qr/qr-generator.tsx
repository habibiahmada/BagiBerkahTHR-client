"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRGeneratorProps {
  value: string;
  size?: number;
  title?: string;
  description?: string;
  showDownload?: boolean;
}

export function QRGenerator({
  value,
  size = 256,
  title,
  description,
  showDownload = true,
}: QRGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="flex flex-col items-center gap-4">
        <div
          ref={qrRef}
          className="p-4 bg-white rounded-xl border-2 border-border"
        >
          <QRCodeCanvas
            value={value}
            size={size}
            level="H"
            includeMargin={true}
          />
        </div>
        {showDownload && (
          <Button variant="outline" onClick={handleDownload} className="w-full">
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
