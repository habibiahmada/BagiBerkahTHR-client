"use client";

import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

interface PaymentStatusTrackerProps {
  status: PaymentStatus;
  amount: number;
  paymentId?: string;
  paidAt?: string;
}

export function PaymentStatusTracker({
  status,
  amount,
  paymentId,
  paidAt,
}: PaymentStatusTrackerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: "warning",
      title: "Menunggu Pembayaran",
      description: "Silakan selesaikan pembayaran Anda",
    },
    SUCCESS: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      badge: "success",
      title: "Pembayaran Berhasil",
      description: "Amplop THR telah aktif dan siap dibagikan",
    },
    FAILED: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      badge: "error",
      title: "Pembayaran Gagal",
      description: "Silakan coba lagi atau hubungi support",
    },
    EXPIRED: {
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      badge: "default",
      title: "Pembayaran Kadaluarsa",
      description: "Waktu pembayaran telah habis",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}>
            {status === "PENDING" ? (
              <Loader2 className={`w-6 h-6 ${config.color} animate-spin`} />
            ) : (
              <Icon className={`w-6 h-6 ${config.color}`} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{config.title}</h3>
              <Badge variant={config.badge as any}>{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {config.description}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jumlah:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(amount)}
                </span>
              </div>
              {paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-xs text-foreground">
                    {paymentId}
                  </span>
                </div>
              )}
              {paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dibayar pada:</span>
                  <span className="text-foreground">
                    {new Date(paidAt).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
