"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface RevealViewProps {
  amount: number;
  greeting: string;
  onNext: () => void;
}

export function RevealView({ amount, greeting, onNext }: RevealViewProps) {
  return (
    <div className="text-center space-y-8">
      <div className="animate-bounce">
        <div className="text-8xl mb-4">🎉</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selamat!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-primary-lighter rounded-2xl">
            <p className="text-sm text-muted-foreground mb-2">
              Kamu menerima
            </p>
            <p className="text-5xl font-bold text-primary mb-4">
              {formatCurrency(amount)}
            </p>
            <div className="p-4 bg-card rounded-xl">
              <p className="text-foreground italic">
                &ldquo;{greeting}&rdquo;
              </p>
            </div>
          </div>

          <Button onClick={onNext} className="w-full" size="lg">
            Lanjutkan untuk Klaim
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
