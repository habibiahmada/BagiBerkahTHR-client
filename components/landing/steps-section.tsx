"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/layout/section-header";

const steps = [
    {
        step: "1",
        title: "Buat Amplop",
        desc: "Tentukan anggaran dan tambahkan data penerima",
    },
    {
        step: "2",
        title: "AI Rekomendasikan",
        desc: "Dapatkan pembagian adil dari AI dengan visualisasi",
    },
    {
        step: "3",
        title: "Kirim & Klaim",
        desc: "Penerima klaim dengan pengalaman interaktif",
    },
];

export function StepsSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Cara Kerja"
                    subtitle="Tiga langkah mudah untuk berbagi THR"
                />

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {steps.map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary-foreground">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="font-bold text-xl text-foreground mb-2">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link href="/create">
                        <Button variant="hero" size="lg">
                            <Gift className="w-5 h-5" />
                            Mulai Sekarang
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
