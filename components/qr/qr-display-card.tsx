"use client";

import { useState, useEffect } from "react";
import { QRGenerator } from "./qr-generator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface QRDisplayCardProps {
  qrToken: string;
  recipientName: string;
  amount: number;
  expiresAt: string;
  status: string;
}

export function QRDisplayCard({
  qrToken,
  recipientName,
  amount,
  expiresAt,
  status,
}: QRDisplayCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = timeLeft === "Expired";
  const isValidated = status === "VALIDATED";

  return (
    <div className="space-y-4">
      {/* Status Alert */}
      {isValidated ? (
        <Alert variant="success">
          <CheckCircle className="w-4 h-4" />
          <AlertTitle>QR Code Sudah Divalidasi</AlertTitle>
          <AlertDescription>
            THR telah diterima oleh {recipientName}
          </AlertDescription>
        </Alert>
      ) : isExpired ? (
        <Alert variant="error">
          <AlertTitle>QR Code Kadaluarsa</AlertTitle>
          <AlertDescription>
            Waktu validasi telah habis. Silakan hubungi pengirim.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="info">
          <Clock className="w-4 h-4" />
          <AlertTitle>Tunjukkan QR Code Ini</AlertTitle>
          <AlertDescription>
            Tunjukkan QR code ini kepada pengirim saat bertemu langsung untuk
            validasi dan menerima THR.
          </AlertDescription>
        </Alert>
      )}

      {/* Recipient Info */}
      <div className="p-4 bg-muted rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Penerima:</span>
          <span className="font-semibold text-foreground">{recipientName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nominal:</span>
          <span className="font-bold text-primary">{formatCurrency(amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={isValidated ? "success" : isExpired ? "error" : "default"}>
            {isValidated ? "Tervalidasi" : isExpired ? "Expired" : "Menunggu"}
          </Badge>
        </div>
        {!isValidated && !isExpired && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Berlaku:</span>
            <span className="font-mono text-sm text-foreground">{timeLeft}</span>
          </div>
        )}
      </div>

      {/* QR Code */}
      {!isExpired && !isValidated && (
        <QRGenerator
          value={qrToken}
          size={256}
          title="QR Code Validasi"
          description="Scan QR code ini untuk validasi dan terima THR"
          showDownload={false}
        />
      )}
    </div>
  );
}
