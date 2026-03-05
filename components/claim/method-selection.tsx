"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BankAccountForm } from "./bank-account-form";

interface MethodSelectionProps {
  distributionMode: string;
  selectedMethod: "digital" | "cash" | null;
  onMethodSelect: (method: "digital" | "cash") => void;
  onDigitalSubmit: (
    bankName: string,
    accountNumber: string,
    accountHolderName: string
  ) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

export function MethodSelection({
  distributionMode,
  selectedMethod,
  onMethodSelect,
  onDigitalSubmit,
  submitting,
  error,
}: MethodSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Pilih Metode Penerimaan
        </h2>
        <p className="text-muted-foreground">
          Bagaimana Anda ingin menerima THR?
        </p>
      </div>

      {distributionMode === "DIGITAL" ? (
        <Tabs
          value={selectedMethod || "digital"}
          onValueChange={(v) => onMethodSelect(v as any)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="digital" className="flex-1">
              Transfer Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digital" className="mt-6">
            {error && (
              <Alert variant="error" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <BankAccountForm onSubmit={onDigitalSubmit} loading={submitting} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Alert variant="info">
            <AlertDescription>
              Mode Cash: Anda akan mendapatkan QR code untuk divalidasi saat
              bertemu pengirim.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => onMethodSelect("cash")}
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? "Memproses..." : "Generate QR Code"}
          </Button>
        </div>
      )}
    </div>
  );
}
