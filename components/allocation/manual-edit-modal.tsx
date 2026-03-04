"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";

interface Recipient {
  name: string;
  amount: number;
}

interface ManualEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: Recipient[];
  totalBudget: number;
  onSave: (updatedRecipients: Recipient[]) => void;
}

export function ManualEditModal({
  open,
  onOpenChange,
  recipients,
  totalBudget,
  onSave,
}: ManualEditModalProps) {
  const [editedRecipients, setEditedRecipients] = useState<Recipient[]>(recipients);

  const currentTotal = editedRecipients.reduce((sum, r) => sum + r.amount, 0);
  const difference = totalBudget - currentTotal;
  const isValid = difference === 0;

  const handleAmountChange = (index: number, value: string) => {
    const amount = parseInt(value) || 0;
    const updated = [...editedRecipients];
    updated[index] = { ...updated[index], amount };
    setEditedRecipients(updated);
  };

  const handleSave = () => {
    if (isValid) {
      onSave(editedRecipients);
      onOpenChange(false);
    }
  };

  const handleDistributeEvenly = () => {
    const perPerson = Math.floor(totalBudget / editedRecipients.length);
    const remainder = totalBudget % editedRecipients.length;

    const updated = editedRecipients.map((r, i) => ({
      ...r,
      amount: perPerson + (i === 0 ? remainder : 0),
    }));

    setEditedRecipients(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Manual Alokasi</DialogTitle>
          <DialogDescription>
            Sesuaikan nominal untuk setiap penerima. Total harus sama dengan budget.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Budget Summary */}
          <div className="p-4 bg-muted rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Budget:</span>
              <span className="font-bold text-foreground">
                {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Alokasi:</span>
              <span
                className={`font-bold ${
                  isValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(currentTotal)}
              </span>
            </div>
            {!isValid && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selisih:</span>
                <span className="font-bold text-red-600">
                  {difference > 0 ? "Kurang" : "Lebih"}{" "}
                  {formatCurrency(Math.abs(difference))}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDistributeEvenly}
            className="w-full"
          >
            Bagi Rata
          </Button>

          {/* Recipients List */}
          <div className="space-y-3">
            {editedRecipients.map((recipient, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`amount-${index}`}>{recipient.name}</Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  value={recipient.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  placeholder="Nominal"
                />
              </div>
            ))}
          </div>

          {/* Validation Alert */}
          {!isValid && (
            <Alert variant="error">
              <AlertDescription>
                Total alokasi harus sama dengan budget. Sesuaikan nominal agar
                selisih menjadi Rp 0.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1"
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
