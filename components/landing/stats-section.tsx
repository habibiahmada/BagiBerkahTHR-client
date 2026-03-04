"use client";

import { motion } from "framer-motion";
import { Users, Gift, Star, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
    icon: LucideIcon;
    value: string;
    label: string;
    color: string;
}

const stats: StatItem[] = [
    { icon: Users, value: "2,500+", label: "Keluarga Terdaftar", color: "text-primary" },
    { icon: Gift, value: "12,000+", label: "Amplop Terkirim", color: "text-secondary" },
    { icon: Star, value: "4.9/5", label: "Rating Pengguna", color: "text-primary" },
    { icon: TrendingUp, value: "Rp 850jt+", label: "THR Terdistribusi", color: "text-secondary" },
];

export function StatsSection() {
    return (
        <section className="py-12 border-y border-border bg-card/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                            <div className="text-2xl md:text-3xl font-extrabold text-foreground">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
