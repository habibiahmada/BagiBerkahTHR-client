"use client";

import { CreditCard, Wallet, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "bank_transfer",
    name: "Transfer Bank",
    icon: Building2,
    description: "Transfer via bank lokal",
  },
  {
    id: "e_wallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "GoPay, OVO, Dana, dll",
  },
  {
    id: "credit_card",
    name: "Kartu Kredit",
    icon: CreditCard,
    description: "Visa, Mastercard",
  },
];

interface PaymentMethodSelectorProps {
  selected: string | null;
  onSelect: (methodId: string) => void;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;

        return (
          <Card
            key={method.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-elevated",
              isSelected && "ring-2 ring-primary shadow-elevated"
            )}
            onClick={() => onSelect(method.id)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    isSelected ? "bg-primary" : "bg-primary-lighter"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6",
                      isSelected ? "text-primary-foreground" : "text-primary"
                    )}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {method.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
