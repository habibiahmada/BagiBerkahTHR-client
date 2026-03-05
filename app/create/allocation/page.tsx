"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Edit, RefreshCw, Check, BarChart3, PieChart as PieChartIcon, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AllocationPieChart } from "@/components/charts/allocation-pie-chart";
import { AllocationBarChart } from "@/components/charts/allocation-bar-chart";
import { AllocationTable } from "@/components/charts/allocation-table";
import { ReasoningCard } from "@/components/allocation/reasoning-card";
import { ManualEditModal } from "@/components/allocation/manual-edit-modal";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Recipient } from "@/lib/types";

import { PlayableSelector } from "@/components/allocation/playable-selector";

interface AllocationWithPlayable {
  name: string;
  amount: number;
  reasoning: string;
  ageLevel: string;
  status: string;
  closeness: string;
  greetingContext?: string;
  playableType: "DIRECT" | "GAME" | "QUIZ";
  gameType?: string;
  playableReasoning?: string;
  quizTopic?: string;
  quizDifficulty?: string;
}

function AllocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [allocations, setAllocations] = useState<AllocationWithPlayable[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedView, setSelectedView] = useState("pie");

  useEffect(() => {
    // Get data from localStorage or URL params
    const budgetParam = searchParams.get("budget");
    const recipientsParam = searchParams.get("recipients");

    if (budgetParam && recipientsParam) {
      try {
        const budget = parseInt(budgetParam);
        const recipientsData = JSON.parse(decodeURIComponent(recipientsParam));
        
        setTotalBudget(budget);
        setRecipients(recipientsData);
        
        // Request AI allocation
        requestAIAllocation(budget, recipientsData);
      } catch (err) {
        setError("Data tidak valid");
        setLoading(false);
      }
    } else {
      setError("Data tidak lengkap");
      setLoading(false);
    }
  }, [searchParams]);

  const requestAIAllocation = async (budget: number, recipientsData: Recipient[]) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await api.getAIAllocation({
        totalBudget: budget,
        recipients: recipientsData.map((r) => ({
          name: r.name,
          ageLevel: r.ageLevel.toUpperCase(),
          status: r.status.toUpperCase(),
          closeness: r.closeness.toUpperCase(),
        })),
      });

      if (response.success) {
        const allocationsData = response.data.allocations.map((alloc: any) => ({
          name: recipientsData[alloc.recipientIndex].name,
          amount: alloc.amount,
          reasoning: alloc.reasoning,
          ageLevel: recipientsData[alloc.recipientIndex].ageLevel,
          status: recipientsData[alloc.recipientIndex].status,
          closeness: recipientsData[alloc.recipientIndex].closeness,
          greetingContext: recipientsData[alloc.recipientIndex].greetingContext,
          // Playable data from AI
          playableType: alloc.playableType || "DIRECT",
          gameType: alloc.gameType,
          playableReasoning: alloc.playableReasoning,
          quizTopic: alloc.quizTopic || "",
          quizDifficulty: alloc.quizDifficulty || "MEDIUM",
        }));

        setAllocations(allocationsData);
        
        // Check if fallback was used
        if (response.data.usedFallback) {
          setUsedFallback(true);
        }
      } else {
        throw new Error(response.error?.message || "Gagal mendapatkan alokasi AI");
      }
    } catch (err: any) {
      console.error("AI Allocation Error:", err);
      setError(err.message || "Terjadi kesalahan saat memproses alokasi");
    } finally {
      setLoading(false);
    }
  };

  const handleManualEdit = (updatedRecipients: any[]) => {
    console.log('📝 Manual Edit - Updated Recipients:', updatedRecipients);
    console.log('📝 Manual Edit - Current Allocations:', allocations);
    
    // Update allocations with new amounts
    const updatedAllocations = allocations.map((alloc) => {
      const updated = updatedRecipients.find(r => r.name === alloc.name);
      if (updated) {
        return {
          ...alloc,
          amount: updated.amount,
        };
      }
      return alloc;
    });
    
    console.log('📝 Manual Edit - Updated Allocations:', updatedAllocations);
    setAllocations(updatedAllocations);
    setShowEditModal(false);
  };

  const handleRegenerate = () => {
    requestAIAllocation(totalBudget, recipients);
  };

  const handlePlayableChange = (index: number, config: any) => {
    const updatedAllocations = [...allocations];
    updatedAllocations[index] = {
      ...updatedAllocations[index],
      playableType: config.playableType,
      gameType: config.gameType,
      quizTopic: config.quizTopic,
      quizDifficulty: config.quizDifficulty,
    };
    setAllocations(updatedAllocations);
  };

  const handleConfirm = () => {
    // Save to sessionStorage
    sessionStorage.setItem(
      "allocationData",
      JSON.stringify({
        totalBudget,
        recipients: allocations,
      })
    );

    // Navigate to confirm page
    router.push("/create/confirm");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href="/create" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/create"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Allocation
            </h1>
            <p className="text-muted-foreground">
              AI telah menganalisis data dan memberikan rekomendasi pembagian yang adil
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Ringkasan Alokasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary-lighter rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Budget
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(totalBudget)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">
                        Jumlah Penerima
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {allocations.length} orang
                      </p>
                    </div>
                    <div className="p-4 bg-secondary-lighter rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">
                        Rata-rata
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {formatCurrency(totalBudget / allocations.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visualization */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Visualisasi Pembagian</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEditModal(true)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit Manual
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Re-generate
                      </Button>
                    </div>
                  </div>
                  
                  {/* Fallback Warning */}
                  {usedFallback && (
                    <Alert variant="warning" className="mt-4">
                      <AlertDescription>
                        <strong>Catatan:</strong> Alokasi ini menggunakan metode berbasis aturan karena layanan AI sedang tidak tersedia. Hasil tetap adil berdasarkan usia, status, dan kedekatan keluarga.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedView} onValueChange={setSelectedView}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="pie">
                        <PieChartIcon className="w-4 h-4" />
                        Pie Chart
                      </TabsTrigger>
                      <TabsTrigger value="bar">
                        <BarChart3 className="w-4 h-4" />
                        Bar Chart
                      </TabsTrigger>
                      <TabsTrigger value="table">
                        <Table className="w-4 h-4" />
                        Tabel
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pie">
                      <AllocationPieChart data={allocations} />
                    </TabsContent>

                    <TabsContent value="bar">
                      <AllocationBarChart data={allocations} />
                    </TabsContent>

                    <TabsContent value="table">
                      <AllocationTable
                        data={allocations}
                        totalBudget={totalBudget}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Reasoning Cards with Playable Selector */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Penjelasan AI & Mode Penerimaan
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {allocations.map((alloc, index) => (
                    <div key={index} className="space-y-3">
                      <ReasoningCard
                        recipientName={alloc.name}
                        amount={alloc.amount}
                        reasoning={alloc.reasoning}
                        ageLevel={alloc.ageLevel}
                        status={alloc.status}
                        closeness={alloc.closeness}
                      />
                      <PlayableSelector
                        recipientName={alloc.name}
                        config={{
                          playableType: alloc.playableType,
                          gameType: alloc.gameType as any,
                          quizTopic: alloc.quizTopic,
                          quizDifficulty: alloc.quizDifficulty as any,
                          playableReasoning: alloc.playableReasoning,
                        }}
                        onChange={(config) => handlePlayableChange(index, config)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
                <Button onClick={handleConfirm} size="lg">
                  <Check className="w-5 h-5" />
                  Konfirmasi & Lanjutkan
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Manual Edit Modal */}
      <ManualEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        recipients={allocations.map((a) => ({ name: a.name, amount: a.amount }))}
        totalBudget={totalBudget}
        onSave={handleManualEdit}
      />
    </div>
  );
}

export default function AllocationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <AllocationContent />
    </Suspense>
  );
}
