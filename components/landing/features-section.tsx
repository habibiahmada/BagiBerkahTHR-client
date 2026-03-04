"use client";

import { motion } from "framer-motion";
import {
    Brain,
    BarChart3,
    Smartphone,
    Banknote,
    Gamepad2,
    MessageSquareHeart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";

interface FeatureItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

const features: FeatureItem[] = [
    {
        icon: Brain,
        title: "AI Smart Allocation",
        description:
            "Algoritma cerdas yang membagi THR secara adil berdasarkan usia, status, dan kedekatan hubungan.",
    },
    {
        icon: BarChart3,
        title: "Visualisasi Transparan",
        description:
            "Grafik interaktif yang menjelaskan logika pembagian AI secara visual dan mudah dipahami.",
    },
    {
        icon: Smartphone,
        title: "Mode Digital",
        description:
            "Kirim THR langsung ke rekening atau e-wallet penerima melalui payment gateway yang aman.",
    },
    {
        icon: Banknote,
        title: "Mode Cash",
        description:
            "Validasi digital untuk pemberian uang fisik dengan QR code yang aman dan anti-duplikasi.",
    },
    {
        icon: Gamepad2,
        title: "Playable Claim",
        description:
            "Pengalaman klaim yang menyenangkan dengan animasi amplop, quiz, dan efek confetti.",
    },
    {
        icon: MessageSquareHeart,
        title: "AI Personal Greeting",
        description:
            "Pesan personal yang di-generate AI, disesuaikan dengan usia dan konteks penerima.",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Fitur Unggulan"
                    subtitle="Semua yang Anda butuhkan untuk membagikan THR dengan cara yang modern dan berkesan."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-lighter flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
