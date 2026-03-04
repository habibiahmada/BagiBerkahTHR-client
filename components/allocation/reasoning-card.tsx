"use client";

import { Brain, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReasoningCardProps {
  recipientName: string;
  amount: number;
  reasoning: string;
  ageLevel?: string;
  status?: string;
  closeness?: string;
}

export function ReasoningCard({
  recipientName,
  amount,
  reasoning,
  ageLevel,
  status,
  closeness,
}: ReasoningCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          {recipientName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(amount)}
          </span>
        </div>

        {(ageLevel || status || closeness) && (
          <div className="flex flex-wrap gap-2">
            {ageLevel && (
              <span className="px-2 py-1 bg-primary-lighter text-primary text-xs rounded-full">
                {ageLevel}
              </span>
            )}
            {status && (
              <span className="px-2 py-1 bg-secondary-lighter text-secondary text-xs rounded-full">
                {status}
              </span>
            )}
            {closeness && (
              <span className="px-2 py-1 bg-muted text-foreground text-xs rounded-full">
                {closeness}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 p-3 bg-muted/50 rounded-xl">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
