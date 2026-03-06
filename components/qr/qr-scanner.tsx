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
  const elementId = useRef(`qr-reader-${Date.now()}`).current;
  const lastScanRef = useRef<{ data: string; time: number } | null>(null);
  const SCAN_COOLDOWN = 2000; // 2 seconds cooldown between same QR scans

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clean up existing scanner if any
      if (scannerRef.current) {
        try {
          if (isScanningRef.current) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
        } catch (err) {
          console.error("Error cleaning up old scanner:", err);
        }
        scannerRef.current = null;
      }

      // Create new scanner instance
      scannerRef.current = new Html5Qrcode(elementId);

      // Get container width for responsive qrbox
      const container = document.getElementById(elementId);
      const containerWidth = container?.offsetWidth || 300;
      
      // Calculate qrbox size - smaller for better fit in modal
      const qrboxSize = Math.min(containerWidth * 0.7, 220); // 70% of container, max 220px

      const config = {
        fps: 10,
        qrbox: { width: qrboxSize, height: qrboxSize },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Prevent duplicate scans within cooldown period
          const now = Date.now();
          if (
            lastScanRef.current &&
            lastScanRef.current.data === decodedText &&
            now - lastScanRef.current.time < SCAN_COOLDOWN
          ) {
            return; // Ignore duplicate scan
          }
          
          // Update last scan
          lastScanRef.current = { data: decodedText, time: now };
          
          // Call onScan callback
          onScan(decodedText);
        },
        () => {
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
        await scannerRef.current.clear();
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
      // Cleanup on unmount
      const cleanup = async () => {
        if (scannerRef.current) {
          try {
            if (isScanningRef.current) {
              await scannerRef.current.stop();
            }
            await scannerRef.current.clear();
            scannerRef.current = null;
            isScanningRef.current = false;
          } catch (err) {
            console.error("Cleanup error:", err);
          }
        }
      };
      cleanup();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Container */}
        <div className="relative w-full overflow-hidden rounded-lg bg-black">
          <div
            id={elementId}
            className="w-full qr-scanner-container"
            style={{ 
              minHeight: isScanning ? "280px" : "0px",
              maxHeight: isScanning ? "400px" : "0px",
              display: isScanning ? "block" : "none"
            }}
          />
          
          {!isScanning && (
            <div className="flex items-center justify-center py-12 bg-muted/50 rounded-lg">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Klik tombol di bawah untuk memulai scan
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full" size="lg">
              <Camera className="w-4 h-4" />
              Mulai Scan
            </Button>
          ) : (
            <>
              <Button
                onClick={stopScanning}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <CameraOff className="w-4 h-4" />
                Berhenti
              </Button>
              <Button
                onClick={async () => {
                  await stopScanning();
                  setTimeout(() => startScanning(), 300);
                }}
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                <Camera className="w-4 h-4" />
                Restart
              </Button>
            </>
          )}
        </div>

        {isScanning && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Arahkan kamera ke QR code...</span>
          </div>
        )}
      </CardContent>
      
      <style jsx global>{`
        .qr-scanner-container {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .qr-scanner-container video {
          width: 100% !important;
          height: auto !important;
          max-height: 400px !important;
          object-fit: contain !important;
          border-radius: 0.5rem;
          display: block;
        }
        
        .qr-scanner-container canvas {
          display: none !important;
        }
        
        .qr-scanner-container #qr-shaded-region {
          border-width: 30px !important;
          border-color: rgba(0, 0, 0, 0.48) !important;
        }
        
        @media (max-width: 640px) {
          .qr-scanner-container video {
            max-height: 280px !important;
          }
          
          .qr-scanner-container #qr-shaded-region {
            border-width: 20px !important;
          }
        }
      `}</style>
    </Card>
  );
}
