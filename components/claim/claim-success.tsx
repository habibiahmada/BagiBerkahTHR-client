"use client";

import { CheckCircle, Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ClaimSuccessProps {
  amount: number;
  recipientName: string;
  claimMethod: "digital" | "cash";
  bankName?: string;
  accountNumber?: string;
}

export function ClaimSuccess({
  amount,
  recipientName,
  claimMethod,
  bankName,
  accountNumber,
}: ClaimSuccessProps) {
  const handleShare = async () => {
    const text = `Alhamdulillah, saya baru saja menerima THR ${formatCurrency(amount)} melalui BagiBerkah! 🌙✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "THR dari BagiBerkah",
          text: text,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Selamat, {recipientName}!
        </h2>
        <p className="text-muted-foreground">
          {claimMethod === "digital"
            ? "THR Anda sedang diproses dan akan segera ditransfer"
            : "QR code Anda siap untuk divalidasi"}
        </p>
      </div>

      {/* Amount Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nominal THR:</span>
              <span className="font-bold text-primary text-xl">
                {formatCurrency(amount)}
              </span>
            </div>
            {claimMethod === "digital" && bankName && accountNumber && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-semibold text-foreground">{bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rekening:</span>
                  <span className="font-mono text-sm text-foreground">
                    {accountNumber}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-green-600">
                {claimMethod === "digital" ? "Diproses" : "Menunggu Validasi"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="p-4 bg-muted rounded-xl text-left">
        <p className="text-sm text-muted-foreground">
          {claimMethod === "digital" ? (
            <>
              Transfer akan diproses dalam 1-3 hari kerja. Anda akan menerima
              notifikasi saat dana sudah masuk ke rekening.
            </>
          ) : (
            <>
              Tunjukkan QR code kepada pengirim saat bertemu langsung untuk
              validasi dan menerima uang tunai.
            </>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button onClick={handleShare} variant="outline" className="w-full">
          <Share2 className="w-4 h-4" />
          Bagikan Kebahagiaan
        </Button>
        <Button onClick={() => window.location.href = "/"} className="w-full">
          <Home className="w-4 h-4" />
          Kembali ke Home
        </Button>
      </div>
    </div>
  );
}
