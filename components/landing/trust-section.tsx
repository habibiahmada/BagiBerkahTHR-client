"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Server,
    Fingerprint,
    Eye,
    Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";

interface TrustItem {
    icon: LucideIcon;
    title: string;
    desc: string;
}

const trustItems: TrustItem[] = [
    {
        icon: ShieldCheck,
        title: "Anti-Fraud System",
        desc: "One-time token & QR validation mencegah duplikasi klaim.",
    },
    {
        icon: Lock,
        title: "Enkripsi End-to-End",
        desc: "Semua data terenkripsi AES-256 dan dikirim via HTTPS.",
    },
    {
        icon: Server,
        title: "Server-side Validation",
        desc: "Nominal dihitung & disimpan di backend, tidak bisa dimanipulasi.",
    },
    {
        icon: Fingerprint,
        title: "Bukan Dompet Digital",
        desc: "BagiBerkah hanya orchestration layer, bukan penyimpan dana.",
    },
    {
        icon: Eye,
        title: "Transparan & Auditable",
        desc: "Setiap transaksi tercatat dalam audit trail yang lengkap.",
    },
    {
        icon: Clock,
        title: "Auto-Expiry",
        desc: "Token klaim memiliki masa berlaku untuk keamanan ekstra.",
    },
];

export function TrustSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Aman, Terpercaya & Tervalidasi"
                    subtitle="Keamanan dan privasi keluarga Anda adalah prioritas utama kami."
                    badge={{ icon: Lock, text: "Keamanan Terjamin" }}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {trustItems.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className="flex gap-4 p-4 rounded-xl bg-card border border-border"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-lighter flex items-center justify-center shrink-0">
                                <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
