"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency } from "@/lib/utils";

interface Envelope {
  id: string;
  totalBudget: number;
  distributionMode: string;
  status: string;
  createdAt: string;
  recipientCount: number;
  claimedCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    // TODO: Fetch envelopes from API
    // For now, using mock data
    setTimeout(() => {
      const mockEnvelopes: Envelope[] = [];
      setEnvelopes(mockEnvelopes);
      setStats({
        total: mockEnvelopes.length,
        active: mockEnvelopes.filter((e) => e.status === "ACTIVE").length,
        completed: mockEnvelopes.filter((e) => e.status === "COMPLETED").length,
        totalAmount: mockEnvelopes.reduce((sum, e) => sum + e.totalBudget, 0),
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      DRAFT: { variant: "default", label: "Draft" },
      PENDING_PAYMENT: { variant: "warning", label: "Menunggu Pembayaran" },
      ACTIVE: { variant: "success", label: "Aktif" },
      COMPLETED: { variant: "info", label: "Selesai" },
      EXPIRED: { variant: "error", label: "Kadaluarsa" },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Kelola semua amplop THR Anda
              </p>
            </div>
            <Link href="/create">
              <Button size="lg">
                <Plus className="w-5 h-5" />
                Buat Amplop Baru
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amplop</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aktif</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.active}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Selesai</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.completed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Dibagikan
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Envelopes List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Amplop</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : envelopes.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Belum Ada Amplop
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Mulai buat amplop THR pertama Anda
                  </p>
                  <Link href="/create">
                    <Button>
                      <Plus className="w-4 h-4" />
                      Buat Amplop Baru
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {envelopes.map((envelope) => (
                    <div
                      key={envelope.id}
                      className="p-4 border border-border rounded-xl hover:shadow-soft transition-shadow cursor-pointer"
                      onClick={() => router.push(`/envelope/${envelope.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {formatCurrency(envelope.totalBudget)}
                            </h3>
                            {getStatusBadge(envelope.status)}
                            <Badge variant="default">
                              {envelope.distributionMode === "DIGITAL"
                                ? "Digital"
                                : "Cash"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {envelope.recipientCount} penerima
                            </span>
                            <span>•</span>
                            <span>
                              {envelope.claimedCount} diklaim
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(envelope.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
