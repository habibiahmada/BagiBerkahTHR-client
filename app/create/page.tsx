"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency, generateId } from "@/lib/utils";
import type { Recipient, AgeLevel, Status, Closeness } from "@/lib/types";
import { sanitizeText } from "@/lib/security";
import { useToast } from "@/components/ui/toast";

export default function CreateEnvelopePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [totalBudget, setTotalBudget] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [currentRecipient, setCurrentRecipient] = useState<Partial<Recipient>>({
    name: "",
    ageLevel: "child",
    status: "school",
    closeness: "very_close",
  });

  const addRecipient = () => {
    if (!currentRecipient.name) return;
    
    // Validate and sanitize name
    const name = sanitizeText(currentRecipient.name, 100);
    if (name.length === 0) {
      addToast('Nama tidak valid', 'error');
      return;
    }
    
    // Validate greetingContext if provided
    const greetingContext = currentRecipient.greetingContext 
      ? sanitizeText(currentRecipient.greetingContext, 500)
      : undefined;

    const newRecipient: Recipient = {
      id: generateId(), // Use browser-compatible ID generation
      name,
      ageLevel: currentRecipient.ageLevel as AgeLevel,
      status: currentRecipient.status as Status,
      closeness: currentRecipient.closeness as Closeness,
      greetingContext,
    };

    setRecipients([...recipients, newRecipient]);
    setCurrentRecipient({
      name: "",
      ageLevel: "child",
      status: "school",
      closeness: "very_close",
    });
    
    addToast(`${name} berhasil ditambahkan`, 'success');
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && totalBudget) {
      const budget = Number(totalBudget);
      
      // Validate minimum budget
      if (budget < 10000) {
        setBudgetError("Budget minimal adalah Rp 10.000");
        return;
      }
      
      // Validate maximum budget (1 billion)
      if (budget > 1000000000) {
        setBudgetError("Budget maksimal adalah Rp 1.000.000.000");
        return;
      }
      
      setBudgetError("");
      setStep(2);
    } else if (step === 2 && recipients.length > 0) {
      // Navigate to AI allocation page
      const recipientsParam = encodeURIComponent(JSON.stringify(recipients));
      router.push(`/create/allocation?budget=${totalBudget}&recipients=${recipientsParam}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Buat Amplop THR
            </h1>
            <p className="text-muted-foreground">
              Ikuti langkah-langkah untuk membuat amplop THR dengan AI
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <StepIndicator number={1} active={step >= 1} label="Budget" />
            <div
              className={`w-16 h-1 mx-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`}
            />
            <StepIndicator number={2} active={step >= 2} label="Penerima" />
            <div
              className={`w-16 h-1 mx-2 rounded-full ${step >= 3 ? "bg-primary" : "bg-border"}`}
            />
            <StepIndicator
              number={3}
              active={step >= 3}
              label="AI Allocation"
            />
          </div>

          {/* Step 1: Budget */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Total Budget THR</CardTitle>
                <CardDescription>
                  Berapa total budget yang ingin dibagikan?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget">Jumlah (Rupiah)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Contoh: 1000000"
                    value={totalBudget}
                    min={10000}
                    step={1000}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow integers
                      if (value === '' || /^\d+$/.test(value)) {
                        setTotalBudget(value);
                        setBudgetError(""); // Clear error on change
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent decimal point and minus
                      if (e.key === '.' || e.key === ',' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {totalBudget && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Total: {formatCurrency(Number(totalBudget))}
                    </p>
                  )}
                  {budgetError && (
                    <p className="text-sm text-red-600 mt-2">
                      {budgetError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimal Rp 10.000 - Maksimal Rp 1.000.000.000
                  </p>
                </div>
                <Button
                  onClick={handleNext}
                  disabled={!totalBudget || Number(totalBudget) < 10000 || Number(totalBudget) > 1000000000}
                  className="w-full"
                >
                  Lanjut ke Penerima →
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Recipients */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Penerima</CardTitle>
                  <CardDescription>
                    Masukkan data masing-masing penerima THR
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      placeholder="Nama penerima"
                      value={currentRecipient.name}
                      onChange={(e) =>
                        setCurrentRecipient({
                          ...currentRecipient,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Usia</Label>
                    <Select
                      id="age"
                      value={currentRecipient.ageLevel}
                      onChange={(e) =>
                        setCurrentRecipient({
                          ...currentRecipient,
                          ageLevel: e.target.value as AgeLevel,
                        })
                      }
                    >
                      <option value="child">Anak-anak (0-12 tahun)</option>
                      <option value="teen">Remaja (13-17 tahun)</option>
                      <option value="adult">Dewasa (18+ tahun)</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      id="status"
                      value={currentRecipient.status}
                      onChange={(e) =>
                        setCurrentRecipient({
                          ...currentRecipient,
                          status: e.target.value as Status,
                        })
                      }
                    >
                      <option value="school">Sekolah</option>
                      <option value="college">Kuliah</option>
                      <option value="working">Bekerja</option>
                      <option value="not_working">Belum Bekerja</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="closeness">Kedekatan</Label>
                    <Select
                      id="closeness"
                      value={currentRecipient.closeness}
                      onChange={(e) =>
                        setCurrentRecipient({
                          ...currentRecipient,
                          closeness: e.target.value as Closeness,
                        })
                      }
                    >
                      <option value="very_close">Sangat Dekat</option>
                      <option value="close">Cukup Dekat</option>
                      <option value="distant">Jauh</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="context">
                      Konteks untuk Greeting (Opsional)
                    </Label>
                    <Input
                      id="context"
                      placeholder="Contoh: Adik kecil yang rajin puasa"
                      value={currentRecipient.greetingContext || ""}
                      onChange={(e) =>
                        setCurrentRecipient({
                          ...currentRecipient,
                          greetingContext: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    onClick={addRecipient}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Penerima
                  </Button>
                </CardContent>
              </Card>

              {/* Recipients List */}
              {recipients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Daftar Penerima ({recipients.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {recipient.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getAgeLevelLabel(recipient.ageLevel)} •{" "}
                              {getStatusLabel(recipient.status)} •{" "}
                              {getClosenessLabel(recipient.closeness)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(recipient.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleNext} className="w-full mt-4">
                      Lanjut ke AI Allocation →
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}


        </div>
      </main>

      <Footer />
    </div>
  );
}

function StepIndicator({
  number,
  active,
  label,
}: {
  number: number;
  active: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
          }`}
      >
        {number}
      </div>
      <span className="text-xs mt-1 text-muted-foreground">{label}</span>
    </div>
  );
}

function getAgeLevelLabel(level: AgeLevel): string {
  const labels: Record<AgeLevel, string> = {
    child: "Anak-anak",
    teen: "Remaja",
    adult: "Dewasa",
  };
  return labels[level];
}

function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    school: "Sekolah",
    college: "Kuliah",
    working: "Bekerja",
    not_working: "Belum Bekerja",
  };
  return labels[status];
}

function getClosenessLabel(closeness: Closeness): string {
  const labels: Record<Closeness, string> = {
    very_close: "Sangat Dekat",
    close: "Cukup Dekat",
    distant: "Jauh",
  };
  return labels[closeness];
}
