"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BankSelector } from "./bank-selector";
import { ArrowRight, Loader2 } from "lucide-react";

interface BankAccountFormProps {
  onSubmit: (bankName: string, accountNumber: string, accountHolderName: string) => Promise<void>;
  loading?: boolean;
}

export function BankAccountForm({ onSubmit, loading = false }: BankAccountFormProps) {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!bankName) {
      setError("Pilih bank terlebih dahulu");
      return;
    }

    if (!accountNumber || accountNumber.length < 8) {
      setError("Nomor rekening tidak valid (minimal 8 digit)");
      return;
    }

    if (!accountName) {
      setError("Nama pemilik rekening harus diisi");
      return;
    }

    try {
      await onSubmit(bankName, accountNumber, accountName);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer ke Rekening Bank</CardTitle>
        <CardDescription>
          Masukkan detail rekening bank untuk menerima THR
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bank">Bank</Label>
            <BankSelector
              id="bank"
              value={bankName}
              onChange={setBankName}
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Nomor Rekening</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="Contoh: 1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="Sesuai dengan rekening bank"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Konfirmasi & Terima THR
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
