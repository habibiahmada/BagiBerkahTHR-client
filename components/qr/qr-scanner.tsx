"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, CameraOff, Loader2 } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const elementId = "qr-reader";

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore continuous scanning errors
        }
      );
      
      isScanningRef.current = true;
    } catch (err: any) {
      const errorMsg = "Gagal mengakses kamera. Pastikan izin kamera diberikan.";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setIsScanning(false);
      isScanningRef.current = false;
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current && isScanningRef.current) {
        await scannerRef.current.stop();
        isScanningRef.current = false;
      }
      setIsScanning(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
      setIsScanning(false);
      isScanningRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current.stop().catch(console.error);
        isScanningRef.current = false;
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning && (
          <div
            id={elementId}
            className="w-full rounded-xl overflow-hidden"
          />
        )}
        
        {!isScanning && (
          <div
            id={elementId}
            className="w-full h-0 overflow-hidden"
          />
        )}

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full">
              <Camera className="w-4 h-4" />
              Mulai Scan
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
            >
              <CameraOff className="w-4 h-4" />
              Berhenti Scan
            </Button>
          )}
        </div>

        {isScanning && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Arahkan kamera ke QR code...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
