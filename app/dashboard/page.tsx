"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { api } from "@/lib/api";
import { validateAccessCode, logger } from "@/lib/security";

export default function DashboardPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = accessCode.trim().toUpperCase();
    
    if (!code) {
      setError("Kode akses wajib diisi");
      return;
    }
    
    // Validate access code format
    if (!validateAccessCode(code)) {
      setError("Format kode akses tidak valid. Harus 8 karakter huruf dan angka.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: any = await api.checkEnvelope(code);

      if (response.success && response.data.id) {
        // Redirect to envelope detail page
        router.push(`/envelope/${response.data.id}`);
      } else {
        setError("Amplop tidak ditemukan");
      }
    } catch (err: any) {
      logger.error("Check Envelope Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-lighter flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cek Status Amplop
            </h1>
            <p className="text-muted-foreground">
              Masukkan kode akses untuk melihat status amplop THR Anda
            </p>
          </div>

          {/* Check Form */}
          <Card>
            <CardHeader>
              <CardTitle>Masukkan Kode Akses</CardTitle>
              <CardDescription>
                Kode akses diberikan saat Anda membuat amplop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Kode Akses</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Contoh: A1B2C3D4"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    maxLength={8}
                    className="text-center text-lg font-mono tracking-wider"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Kode akses terdiri dari 8 karakter huruf dan angka
                  </p>
                </div>

                {error && (
                  <Alert variant="error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !accessCode.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Memeriksa...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Cek Status Amplop
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Kode akses diberikan setelah Anda berhasil membuat amplop</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Simpan kode akses dengan aman untuk mengecek status amplop kapan saja</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Dengan kode akses, Anda dapat melihat daftar penerima dan status klaim mereka</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
